import { createSutairu } from '@sutairu/core';
import { describe, expect, test } from 'vitest';

describe('Issue #652', () => {
  test('Applying both variants from the one default variant', () => {
    const { css } = createSutairu();

    const component1 = css({
      variants: {
        hue: {
          primary: {
            color: 'red',
          },
        },
      },
      defaultVariants: {
        hue: 'primary',
      },
    });

    const component2 = css(component1, {
      variants: {
        hue: {
          primary: {
            color: 'blue',
          },
        },
      },
    });

    const expression2 = component2();

    expect(expression2.className).toBe(
      'c-PJLV c-PJLV-gmqXFB-hue-primary c-PJLV-kydkiA-hue-primary',
    );
  });
});
