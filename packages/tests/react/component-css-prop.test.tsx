import { createSutairu } from '@sutairu/react';
import { describe, expect, test } from 'vitest';

describe('React Component with CSS prop', () => {
  test('Authors can create a component and pass it a css prop of overrides', () => {
    const { styled, toString } = createSutairu();

    styled('button', {
      order: 1,
    }).render({
      css: {
        order: 2,
      },
    });

    expect(toString()).toBe(
      '--sxs{--sxs:2 c-hhyRYU}@layer styled{.c-hhyRYU{order:1}}--sxs{--sxs:6 c-hhyRYU-ilhKMMn-css}@layer inline{.c-hhyRYU-ilhKMMn-css{order:2}}',
    );
  });

  test('React example from Radix', () => {
    const { styled, toString } = createSutairu({
      media: {
        bp2: '(min-width: 900px)',
      },
    });

    const expression = styled('button', {
      color: 'inherit',
    }).render({
      css: {
        fontWeight: 500,
        fontVariantNumeric: 'proportional-nums',
        lineHeight: '35px',
        '@bp2': {
          lineHeight: '55px',
          color: 'red',
        },
      },
    });

    expect(expression.props.className).toEqual('c-bHwuwj c-bHwuwj-ibwrayD-css');

    expect(toString()).toBe(
      '--sxs{--sxs:2 c-bHwuwj}@layer styled{.c-bHwuwj{color:inherit}}--sxs{--sxs:6 c-bHwuwj-ibwrayD-css}@layer inline{.c-bHwuwj-ibwrayD-css{font-weight:500;font-variant-numeric:proportional-nums;line-height:35px}@media (min-width: 900px){.c-bHwuwj-ibwrayD-css{line-height:55px;color:red}}}',
    );
  });
});
