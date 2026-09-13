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
        brand: {
          50: '#f8fafc',
          900: '#090d16',
          950: '#030712',
        },
        accent: {
          teal: '#14b8a6',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
