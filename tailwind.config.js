/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cria: {
          primary: '#7B2CBF',
          'primary-dark': '#5A189A',
          'primary-darker': '#3C096C',
          'primary-light': '#9D4EDD',
          'primary-lighter': '#C77DFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [],
};
