/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#facc15', // yellow-400
          dark: '#eab308', // yellow-500
        },
        dark: {
          DEFAULT: '#1f2937', // gray-800
          light: '#374151', // gray-700
          darker: '#111827', // gray-900
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
