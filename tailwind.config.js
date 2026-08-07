/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#22c55e', deep: '#16a34a' },
        gold: { DEFAULT: '#d4a843', light: '#f0c860' },
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
