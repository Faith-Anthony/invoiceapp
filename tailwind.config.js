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
        primary: '#7C3AED',
        success: '#4ADE80',
        warning: '#FB923C',
        dark: '#2D2E44',
      },
    },
  },
  plugins: [],
}
