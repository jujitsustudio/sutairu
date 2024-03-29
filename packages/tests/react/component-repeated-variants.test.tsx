import { type PropertyValue, createSutairu } from '@sutairu/react';
import { describe, expect, test } from 'vitest';

describe('emerson', () => {
  test('lake', () => {
    const { styled, toString } = createSutairu({
      utils: {
        px: (value: PropertyValue<'paddingLeft'>) => ({
          paddingLeft: value,
          paddingRight: value,
        }),
      },
    });

    const component = styled('span', {
      variants: {
        size: {
          '1': {
            px: '$1',
          },
          '2': {
            px: '$2',
          },
        },
      },
    });

    const cssText =
      '--sxs{--sxs:3 c-PJLV-efCiES-size-1}@layer onevar{' +
      '.c-PJLV-efCiES-size-1{padding-left:var(--space-1);padding-right:var(--space-1)}' +
      '}';

    component.render({ size: '1' });

    expect(toString()).toBe(cssText);

    component.render({ size: '1' });

    expect(toString()).toBe(cssText);

    component.render({ size: '1' });

    expect(toString()).toBe(cssText);
  });
});
