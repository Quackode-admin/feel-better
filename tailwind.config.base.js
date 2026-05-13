/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [],
  theme: {
    extend: {
      // ── Design tokens de Feel Better ────────────────────────────────────────
      colors: {
        brand: {
          50:  '#E8F5EF',
          100: '#C3E5D4',
          200: '#9DD4B8',
          300: '#6CBD96',
          400: '#3DA674',
          500: '#1D9E75',  // primary brand
          600: '#158A63',
          700: '#0D7050',
          800: '#075540',
          900: '#033A2B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // ── shadcn/ui CSS variables ─────────────────────────────────────────────
      // Estas variables se definen en globals.css de cada app.
      // Los componentes de shadcn las usan automáticamente.
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
