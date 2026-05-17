/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // toggle via classe CSS
  theme: {
    extend: {
      colors: {
        charmy: {
          50:  '#fff0f6',
          100: '#ffd6e8',
          200: '#ffadd2',
          300: '#ff85be',
          400: '#f759a0',
          500: '#eb2f82',  // couleur principale
          600: '#c4136a',
          700: '#9e0055',
          800: '#780040',
          900: '#52002c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}