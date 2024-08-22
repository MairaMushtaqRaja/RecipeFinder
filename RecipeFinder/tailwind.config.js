/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./Screens/**/*.{js,jsx,ts,tsx}",  // Make sure the directory name is correct
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
