/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF4',
          100: '#FAF4E1',
          200: '#F5E7BD',
          300: '#EED693',
          400: '#E5C065',
          500: '#D49B24', // Company Brand Gold
          600: '#BA8018',
          700: '#946111',
          800: '#6E450D',
          900: '#4C2F09',
        },
        cream: {
          50: '#FCFBF7',
          100: '#FAF7EE',
          200: '#F4EEDB',
          300: '#EBE2C6',
          400: '#DFD2AD',
          500: '#CCBD91',
        },
        bronze: {
          50: '#F7F6F3',
          100: '#ECE9E2',
          200: '#DAD4C7',
          300: '#BFB5A2',
          400: '#9E917A',
          500: '#7B6F57',
          600: '#5E5441',
          700: '#453E30',
          800: '#2F2A21',
          900: '#1E1B15', // Deep Olive/Charcoal Bronze
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
