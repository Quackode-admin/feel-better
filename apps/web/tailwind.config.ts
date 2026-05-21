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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'fb-green': {
          950: '#154212',
          900: '#166534',
          800: '#23501E',
          700: '#2D5A27',
          500: '#9DD090',
          400: '#BCF0AE',
          200: '#C2C9BB',
          100: '#E7E9E1',
          50:  '#EDEFE7',
          25:  '#F3F4ED',
        },
        'fb-ink': {
          900: '#191C18',
          700: '#42493E',
          500: '#72796E',
          400: '#9CA3AF',
          200: '#E2E3DC',
          100: '#F3F4F6',
          50:  '#FAFAFA',
        },
        'fb-teal': {
          700: '#356668',
          200: '#B9ECEE',
        },
        'fb-cream': '#FAFAFA',
        'fb-success': '#4CAF50',
        'fb-warning': '#FF9800',
        'fb-error':   '#F44336',
        'fb-info':    '#2196F3',
        // shadcn/ui bridge
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
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
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'fb-xs':   '0 1px 2px rgba(0,0,0,0.05)',
        'fb-card': '0 4px 20px rgba(0,0,0,0.04)',
        'fb-pop':  '0 4px 6px -4px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.1)',
        'fb-nav':  '0 -4px 20px rgba(0,0,0,0.03)',
      },
      spacing: {
        's-1': '4px',  's-2': '8px',  's-3': '12px', 's-4': '16px',
        's-5': '24px', 's-6': '32px', 's-7': '48px', 's-8': '64px',
      },
      fontSize: {
        'fb-display': ['40px', { lineHeight: '48px',   letterSpacing: '-0.8px',  fontWeight: '700' }],
        'fb-h1':      ['32px', { lineHeight: '38.4px', letterSpacing: '-0.32px', fontWeight: '700' }],
        'fb-h2':      ['24px', { lineHeight: '31.2px',                           fontWeight: '700' }],
        'fb-h3':      ['18px', { lineHeight: '27px',                             fontWeight: '500' }],
        'fb-h4':      ['20px', { lineHeight: '28px',   letterSpacing: '-0.5px',  fontWeight: '700' }],
        'fb-stat':    ['32px', { lineHeight: '38.4px', letterSpacing: '-0.32px', fontWeight: '700' }],
        'fb-body':    ['16px', { lineHeight: '25.6px',                           fontWeight: '400' }],
        'fb-label':   ['14px', { lineHeight: '19.6px', letterSpacing: '0.14px',  fontWeight: '500' }],
        'fb-caption': ['12px', { lineHeight: '18px',                             fontWeight: '500' }],
        'fb-button':  ['16px', { lineHeight: '16px',   letterSpacing: '0.32px',  fontWeight: '700' }],
      },
      transitionTimingFunction: {
        'fb': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        'fb': '150ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
