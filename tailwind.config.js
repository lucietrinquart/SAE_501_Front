/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'blanc': '#FFFFFF',
        'fond_page': '#1E1E1E',
        'fond_section1': '#303139',
        'police': '#000000',
        'fond_section2': '#4D4F59'
      }
    },
  },
  plugins: [],
}