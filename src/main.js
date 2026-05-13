// src/main.js
// Punto de entrada de la aplicación BitIron Frontend

import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { Hero } from './components/Hero.js';
import { initHeroAnimations } from './lib/motion.js';

/**
 * Función de inicialización principal.
 * 1. Inyecta el HTML del Layout (Navbar + Hero + Footer) en #app
 * 2. Lanza las animaciones de Motion una vez el DOM está pintado
 */
const initApp = () => {
  const app = document.querySelector('#app');

  // Construimos el HTML completo y lo inyectamos
  app.innerHTML = MainLayout(Hero());

  // Iniciamos las animaciones del Hero tras el render
  initHeroAnimations();

  console.log('🚀 BitIron Frontend Initialized | Unleash Your Legacy');
};

document.addEventListener('DOMContentLoaded', initApp);
// src/main.js (o donde manejes la lista de productos)

document.addEventListener('input', (e) => {
  if (e.target.id === 'search-input') {
    const searchTerm = e.target.value.toLowerCase();

    // Suponiendo que tienes tus datos de productos en un array llamado 'products'
    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );

    // Aquí llamarías a la función que limpia el contenedor y pinta los filtrados
    renderProducts(filteredProducts);
  }
});