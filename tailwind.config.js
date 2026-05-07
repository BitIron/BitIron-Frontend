/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.html",              // Para archivos en la raíz de src
    "./src/pages/**/*.html",
    "./src/components/**/*.html",
    "./src/js/**/*.js",
  ],
  theme: {
    extend: {
      // Colores de BitIron para usar fuera de componentes DaisyUI
      colors: {
        "bit-cyan": "#29b6c1",
        "bit-purple": "#6a359c",
        "bit-pink": "#d92e7f",
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        bitiron: {
          "primary": "#29b6c1",    // Cian (Botones principales)
          "secondary": "#6a359c",  // Morado (Botones secundarios)
          "accent": "#d92e7f",     // Rosa (Destacados)
          "neutral": "#1f2937",
          "base-100": "#0b021a",   // Fondo oscuro profundo del logo
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
};