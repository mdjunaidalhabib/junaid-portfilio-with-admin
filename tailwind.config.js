/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        bg: { DEFAULT: '#f8f5f0', card: '#ffffff', deep: '#f0ece5' },
        brand: { DEFAULT: '#22c55e', deep: '#16a34a' },
        gold: { DEFAULT: '#d4a843', light: '#f0c860' },
        muted: '#6b7c6e',
      },
      fontFamily: {
        display: ['"Tiro Bangla"', 'serif'],
        body: ['"Hind Siliguri"', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
      },
    },
  },
  plugins: [],
}
