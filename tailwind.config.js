/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bitiron: {
          red: "#e62429",
          black: "#000000",
          white: "#ffffff",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
