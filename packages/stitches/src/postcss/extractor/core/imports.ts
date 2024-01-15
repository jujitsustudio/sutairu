import path from 'node:path';
import jiti from 'jiti';
import type { State } from '.';
import { visitSync } from '../../ast/visit';

export interface Import {
  loader: string;
  ctxt: number;
  source: string;
  value?: string;
  resolved: string;
}

export const extractImports = ({ ast, loaders, id }: State) => {
  const require = jiti(import.meta.url);
  const imports: Import[] = [];

  visitSync(ast, {
    visitImportDeclaration(importDecl) {
      try {
        let pass = loaders.includes(importDecl.source.value);

        let resolved = path.isAbsolute(importDecl.source.value)
          ? importDecl.source.value
          : path.resolve(path.dirname(id), importDecl.source.value);
        pass = loaders.includes(resolved);

        if (!pass) {
          try {
            resolved = require.resolve(importDecl.source.value);
            pass = !!resolved;
          } catch {}
          try {
            resolved = require.resolve(resolved);
            pass = !!resolved;
          } catch {}
          if (!pass) return;
        }

        for (const specifier of importDecl.specifiers) {
          if (specifier.type === 'ImportSpecifier') {
            const functionName = specifier.imported
              ? specifier.imported.value
              : specifier.local.value;

            imports.push({
              loader: importDecl.source.value,
              ctxt: importDecl.span.ctxt,
              source: importDecl.source.value,
              value: functionName,
              resolved,
            });
          } else if (specifier.type === 'ImportDefaultSpecifier') {
            imports.push({
              loader: importDecl.source.value,
              ctxt: importDecl.span.ctxt,
              source: importDecl.source.value,
              value: specifier.local.value,
              resolved,
            });
          } else if (specifier.type === 'ImportNamespaceSpecifier') {
            imports.push({
              loader: importDecl.source.value,
              ctxt: importDecl.span.ctxt,
              source: importDecl.source.value,
              value: specifier.local.value,
              resolved,
            });
          }
        }
      } catch {}
    },
  });

  return imports;
};