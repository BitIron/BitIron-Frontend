// src/main.js
// Punto de entrada de la aplicación BitIron Frontend
// Orden de secciones (presentación scroll):
//   1. Hero          (100dvh, blanco)
//   2. Philosophy    (100dvh, blanco — frase + 3 pilares)
//   3. Shop Catalog  (100dvh, blanco)
//   4. Footer

import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { Hero } from './components/Hero.js';
import { PhilosophySection } from './components/PhilosophySection.js';
import { ShopCatalog, initShopCatalog } from './components/ShopCatalog.js';
import { initHeroAnimations, animatePhilosophySection } from './lib/motion.js';

/**
 * Función de inicialización principal.
 * 1. Construye el HTML completo con todas las secciones.
 * 2. Lanza las animaciones y lógicas de cada componente.
 */
const initApp = () => {
  const app = document.querySelector('#app');

  // Construimos el HTML completo (presentación por diapositivas)
  app.innerHTML = MainLayout(
    Hero() + 
    PhilosophySection() + 
    ShopCatalog()
  );

  // Lanza las animaciones tras el render
  initHeroAnimations();
  animatePhilosophySection();
  
  // Inicializa la lógica del catálogo (carga de productos)
  initShopCatalog();

  console.log('🚀 BitIron Frontend Initialized | Unleash Your Legacy');
};

document.addEventListener('DOMContentLoaded', initApp);
