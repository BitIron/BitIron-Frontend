// src/main.js
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { Hero, initHeroAnimations } from './components/Hero.js';

/**
 * Función de inicialización de la App.
 * Aquí montamos la estructura inicial y disparamos las animaciones.
 */
const initApp = () => {
  const app = document.querySelector('#app');
  
  // En una arquitectura modular de Vanilla JS, inyectamos el Hero dentro del Layout
  app.innerHTML = MainLayout(Hero());

  // Una vez inyectado en el DOM, inicializamos las animaciones de Motion
  initHeroAnimations();

  console.log('🚀 BitIron Frontend Initialized | Unleash Your Legacy');
};

// Arrancamos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
