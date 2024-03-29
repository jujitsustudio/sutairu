import { createSutairu } from '@sutairu/core';
import { describe, expect, test } from 'vitest';

describe('Autoprefixer', () => {
  test('appearance', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        appearance: 'none',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 kozGVo}@layer global{x-element{-webkit-appearance:none;appearance:none}}',
    );
  });

  test('backfaceVisibility', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        backfaceVisibility: 'visible',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 gaCVoe}@layer global{x-element{-webkit-backface-visibility:visible;backface-visibility:visible}}',
    );
  });

  test('backgroundClip', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        backgroundClip: 'border-box',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 gIcRdw}@layer global{x-element{-webkit-background-clip:border-box;background-clip:border-box}}',
    );
  });

  test('clipPath', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        clipPath: 'circle(40%)',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 ccZNl}@layer global{x-element{-webkit-clip-path:circle(40%);clip-path:circle(40%)}}',
    );
  });

  test('hyphens', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        hyphens: 'none',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 cRggdz}@layer global{x-element{-webkit-hyphens:none;hyphens:none}}',
    );
  });

  test('maskImage', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        maskImage: 'none',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 eNBesV}@layer global{x-element{-webkit-mask-image:none;mask-image:none}}',
    );
  });

  test('tabSize', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        tabSize: 'none',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 kPCdtQ}@layer global{x-element{tab-size:none}}',
    );
  });

  test('textSizeAdjust', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        textSizeAdjust: '100%',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 gVFtip}@layer global{x-element{-webkit-text-size-adjust:100%;text-size-adjust:100%}}',
    );
  });

  test('userSelect', () => {
    const { globalCss, toString } = createSutairu();

    globalCss({
      'x-element': {
        userSelect: 'none',
      },
    })();

    expect(toString()).toBe(
      '--sxs{--sxs:1 kEUokv}@layer global{x-element{-webkit-user-select:none;user-select:none}}',
    );
  });
});
