/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.html",
    "./src/components/**/*.html",
    "./src/js/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
