import { createSutairu } from '@sutairu/core';
import { expectTypeOf, test } from 'vitest';

test('Types', () => {
  const { css, globalCss, keyframes } = createSutairu({
    utils: {
      mx: () => ({
        backgroundColor: 'red',
      }),
    },
    theme: {
      colors: {
        hiContrast: 'hsl(200, 12%, 5%)',
        loContrast: 'white',
        gray100: 'hsl(206, 20%, 98.8%)',
        gray200: 'hsl(206, 14%, 96.0%)',
        gray300: 'hsl(206, 13%, 93.7%)',
        gray400: 'hsl(206, 12%, 92.0%)',
        gray500: 'hsl(206, 12%, 89.5%)',
        gray600: 'hsl(206, 11%, 85.2%)',
        gray700: 'hsl(206, 10%, 80.0%)',
        gray800: 'hsl(206, 6%, 56.1%)',
        gray900: 'hsl(206, 6%, 43.9%)',
        pedro: '$gray100',
      },
      space: {
        1: '10px',
        2: '20px',
      },
      fontSizes: {
        '1': '11px',
        '2': '13px',
        '3': '15px',
        '4': '17px',
        '5': '19px',
        '6': '21px',
        '7': '27px',
        '8': '35px',
        '9': '59px',
      },
    },
    media: {
      bp1: '(min-width: 620px)',
    },
  });

  expectTypeOf(
    keyframes({
      from: {
        color: '$gray100',
      },
      to: {
        color: '$gray900',
      },
    }),
  ).toBeFunction();

  expectTypeOf(
    globalCss({
      body: {
        '@bp1': {
          backgroundColor: '$gray100',
        },
        backgroundColor: '$gray300',
      },
    }),
  ).toBeFunction();

  const PotatoButton = css({
    variants: {
      peace: {
        mercy: {
          color: 'MediumOrchid',
        },
        trust: {
          color: 'Turquoise',
        },
      },
      variant: {
        blue: {
          backgroundColor: '$gray100',
        },
        red: {
          backgroundColor: '$gray100',
        },
      },
    },
    compoundVariants: [
      {
        variant: 'blue',
        css: {
          backgroundColor: '$gray200',
        },
      },
    ],
  });

  expectTypeOf(PotatoButton).toBeFunction();

  expectTypeOf(
    PotatoButton({
      peace: 'mercy',
    }),
  ).toMatchTypeOf<ReturnType<ReturnType<typeof css>>>();

  const two = css(PotatoButton, {
    $$max: '2px',
    width: '$$max',
    variants: {
      hue: {
        green: {
          width: '$$max',
          backgroundColor: '$gray100',
        },
        red: {
          backgroundColor: '$gray100',
        },
      },
      love: {
        free: {
          color: 'ForestGreen',
        },
        good: {
          color: 'GoldenRod',
        },
      },
    },
    defaultVariants: {
      hue: 'red',
    },
    compoundVariants: [
      {
        hue: 'green',
        css: {
          backgroundColor: '$gray200',
        },
      },
    ],
  });

  expectTypeOf(two).toBeFunction();

  expectTypeOf(
    two({
      peace: 'mercy',
      hue: 'green',
      love: 'free',
    }),
  ).toMatchTypeOf<ReturnType<ReturnType<typeof css>>>();

  expectTypeOf(
    PotatoButton({
      className: '',
      css: {
        backgroundColor: '$gray300',

        '@all': {
          backgroundColor: 'initial',
        },

        '@bp1': {
          backgroundColor: 'initial',
        },
      },
    }),
  ).toMatchTypeOf<ReturnType<ReturnType<typeof css>>>();
});
