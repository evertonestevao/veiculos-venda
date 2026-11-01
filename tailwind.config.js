/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1c1f26', soft: '#4b5160', mute: '#8a90a0' },
        paper: { DEFAULT: '#faf8f4', card: '#ffffff', line: '#e8e4dc' },
        accent: { DEFAULT: '#c8892b', dark: '#a56d1a', soft: '#fbf1de' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,31,38,.04), 0 8px 24px -8px rgba(28,31,38,.10)',
        lift: '0 2px 4px rgba(28,31,38,.05), 0 18px 40px -12px rgba(28,31,38,.20)',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
        slideIn: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'none' } },
        pop: { '0%': { transform: 'scale(.9)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
      animation: {
        fadeUp: 'fadeUp .35s ease both',
        slideIn: 'slideIn .25s ease both',
        pop: 'pop .18s ease both',
      },
    },
  },
  plugins: [],
}
