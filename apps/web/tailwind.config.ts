import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Feel Better brand tokens
        'fb-green': {
          950: 'rgb(21, 66, 18)',
          900: 'rgb(22, 101, 52)',
          800: 'rgb(35, 80, 30)',
          700: 'rgb(45, 90, 39)',
          500: 'rgb(157, 208, 144)',
          400: 'rgb(188, 240, 174)',
          200: 'rgb(194, 201, 187)',
          100: 'rgb(231, 233, 225)',
          50:  'rgb(237, 239, 231)',
          25:  'rgb(243, 244, 237)',
        },
        'fb-ink': {
          900: 'rgb(25, 28, 24)',
          700: 'rgb(66, 73, 62)',
          500: 'rgb(114, 121, 110)',
          400: 'rgb(156, 163, 175)',
          200: 'rgb(226, 227, 220)',
          100: 'rgb(243, 244, 246)',
          50:  'rgb(250, 250, 250)',
        },
        cream: 'rgb(250, 250, 250)',
        // shadcn/ui bridge
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        'fb-xs':   '4px',
        'fb-sm':   '8px',
        'fb-md':   '12px',
        'fb-lg':   '16px',
        'fb-xl':   '24px',
        'fb-pill': '9999px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'fb-card': '0 4px 20px rgba(0,0,0,0.04)',
        'fb-pop':  '0 4px 6px -4px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.1)',
        'fb-nav':  '0 -4px 20px rgba(0,0,0,0.03)',
      },
      spacing: {
        's-1': '4px',
        's-2': '8px',
        's-3': '12px',
        's-4': '16px',
        's-5': '24px',
        's-6': '32px',
        's-7': '48px',
        's-8': '64px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
