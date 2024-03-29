/*
MIT License

Copyright (c) 2021-PRESENT Anthony Fu <https://github.com/antfu>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { createFilter } from '@rollup/pluginutils';
import type { LoadConfigResult, LoadConfigSource } from 'unconfig';
import { loadConfig } from './config';
import { defaultPipelineExclude, defaultPipelineInclude } from './defaults';
import { createGenerator } from './generator';
import type {
  SutairuPluginContext,
  UserConfig,
  UserConfigDefaults,
} from './types';
import { BetterMap } from './utils/map';

export function createContext<Config extends UserConfig = UserConfig>(
  config?: Config,
  defaults: UserConfigDefaults = {
    content: {
      include: [],
    },
  },
  extraConfigSources: LoadConfigSource[] = [],
  resolveConfigResult: (config: LoadConfigResult<Config>) => void = () => {},
): SutairuPluginContext<Config> {
  let root = process.cwd();
  let rawConfig = {} as Config;
  const generator = createGenerator(rawConfig, defaults);
  let rollupFilter = createFilter(
    defaultPipelineInclude,
    defaultPipelineExclude,
    { resolve: root },
  );

  const invalidations: Array<() => void> = [];
  const reloadListeners: Array<() => void> = [];

  const modules = new BetterMap<string, string>();
  const tokens = new Set<string>();
  const tasks: Promise<void>[] = [];
  const affectedModules = new Set<string>();

  let ready = reloadConfig();

  async function reloadConfig() {
    const result = await loadConfig(config);
    resolveConfigResult(result);

    rawConfig = result.config;
    generator.setConfig(rawConfig);
    generator.config.envMode = 'dev';
    rollupFilter =
      !rawConfig.content?.include && !rawConfig.content?.exclude
        ? () => false
        : createFilter(rawConfig.content.include, rawConfig.content.exclude, {
            resolve: root,
          });
    tokens.clear();
    modules.map((code, id) => generator.applyExtractors(code, id, tokens));
    invalidate();
    dispatchReload();

    return result;
  }

  async function updateRoot(newRoot: string) {
    if (newRoot !== root) {
      root = newRoot;
      ready = reloadConfig();
    }
    return await ready;
  }

  function invalidate() {
    for (const cb of invalidations) {
      cb();
    }
  }

  function dispatchReload() {
    for (const cb of reloadListeners) {
      cb();
    }
  }

  async function extract(code: string, id?: string) {
    if (id) modules.set(id, code);
    const len = tokens.size;
    await generator.applyExtractors(code, id, tokens);
    if (tokens.size > len) invalidate();
  }

  async function extractLoaders(code: string, id?: string) {
    if (id) modules.set(id, code);
    await generator.updateLoaders(code, id, tokens);
  }

  function filter(code: string, id: string) {
    return rollupFilter(id.replace(/\?v=\w+$/, ''));
  }

  async function getConfig() {
    await ready;
    return rawConfig;
  }

  async function flushTasks() {
    const _tasks = [...tasks];
    await Promise.all(_tasks);
    tasks.splice(0, _tasks.length);
  }

  return {
    get ready() {
      return ready;
    },
    tokens,
    modules,
    affectedModules,
    tasks,
    flushTasks,
    invalidate,
    onInvalidate(fn: () => void) {
      invalidations.push(fn);
    },
    filter,
    reloadConfig,
    onReload(fn: () => void) {
      reloadListeners.push(fn);
    },
    generator,
    extract,
    extractLoaders,
    getConfig,
    get root() {
      return root;
    },
    updateRoot,
  };
}
