/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0f172a', soft: '#475569', mute: '#64748b' },
        paper: { DEFAULT: '#f8fafc', card: '#ffffff', line: '#e2e8f0' },
        accent: { DEFAULT: '#2563eb', dark: '#1d4ed8', soft: '#eff6ff' },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,.04)',
        lift: '0 4px 16px -4px rgba(15,23,42,.12)',
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
