// src/main.js
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { Hero } from './components/Hero.js';
import { PhilosophySection } from './components/PhilosophySection.js';
import { ShopCatalog, initShopCatalog } from './components/ShopCatalog.js';
import { Footer } from './components/Footer.js';
import { initHeroAnimations, animatePhilosophySection } from './lib/motion.js';

// Componentes y Páginas del Chat
import { AICoachChat } from './components/AIchat.js';      // El botón flotante
import { AIchatPage } from './pages/AIchat.js';          // La página completa
import { initAICoach } from './lib/aichat.js';            // La lógica (redirección y escritura)

const initApp = () => {
  const app = document.querySelector('#app');
  const path = window.location.pathname;

  // 1. MODO PÁGINA DE CHAT
  if (path === '/aichat') {
    app.innerHTML = MainLayout(AIchatPage());
    initAICoach(); // Esto activará el formulario de escritura
    return; // Salimos para no cargar la Home
  }

  // 2. MODO HOME (Por defecto)
  app.innerHTML = MainLayout(
    Hero() +
    PhilosophySection() +
    ShopCatalog() +
    Footer() +
    AICoachChat() // Aquí AICoachChat() solo devuelve el botón flotante
  );

  // Inicializamos lógicas de la Home
  initHeroAnimations();
  animatePhilosophySection();
  initShopCatalog();
  initAICoach(); // Esto activará el evento click del botón flotante para ir a /aichat

  console.log('🚀 BitIron Frontend Initialized | Unleash Your Legacy');
};

document.addEventListener('DOMContentLoaded', initApp);