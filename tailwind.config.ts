/** @type {import('tailwindcss').Config} */

const channel = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['src/components/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Falls back to --font-sans while headings share the body font.
        display: ['var(--font-display, var(--font-sans))', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: channel('primary'),
        'on-primary': channel('on-primary'),

        control: channel('control'),
        'on-control': channel('on-control'),

        'bg-1': channel('bg-1'),
        'bg-2': channel('bg-2'),
        'bg-3': channel('bg-3'),

        'text-1': channel('text-1'),
        'text-2': channel('text-2'),
        'text-3': channel('text-3'),
        'text-strong': channel('text-strong'),

        accent: channel('accent'),
        'accent-deep': channel('accent-deep'),

        'gray-1': channel('gray-1'),

        stroke: channel('stroke'),

        scrim: 'rgb(var(--c-overlay) / var(--overlay-opacity))',

        success: channel('success'),
        'success-surface': channel('success-surface'),
        danger: channel('danger'),
        'danger-surface': channel('danger-surface'),
        warning: channel('warning'),
        'warning-surface': channel('warning-surface'),
      },

      zIndex: {
        raised: '10',
        header: '100',
        scrim: '200',
        drawer: '300',
        'drawer-controls': '310',
      },

      animation: {
        aurora: 'aurora 60s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
