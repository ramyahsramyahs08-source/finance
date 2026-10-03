/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0B0D11',
          panel: '#0E1117',
          card: '#13161C',
          cardHover: '#171B24',
          border: 'rgba(255, 255, 255, 0.07)',
          neon: '#A3FF12',
          neonHover: '#B8FF33',
          green: '#22C55E',
          accent: '#6366F1',
          purple: '#A855F7',
          danger: '#EF4444',
          subtext: '#8E95A5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-lime': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'card': '0 4px 24px -1px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 12px 32px -4px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
