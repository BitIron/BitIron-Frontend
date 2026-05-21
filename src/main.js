// src/main.js
import './styles/global.css';
import { initTheme } from './lib/theme.js';

// Inicializar tema antes de renderizar
initTheme();

import { MainLayout } from './layouts/MainLayout.js';
import { Hero } from './components/Hero.js';
import { PhilosophySection } from './components/PhilosophySection.js';
import { ShopCatalog, initShopCatalog } from './components/ShopCatalog.js';
import { initHeroAnimations, animatePhilosophySection } from './lib/motion.js';

import { AdvisorCTA, initAdvisorCTA } from './components/AdvisorCTA.js';
import { initAICoach } from './lib/aichat.js';
import { initCart } from './lib/cart.js';
import { initFooter } from './components/Footer.js';

const initApp = () => {
  const app = document.querySelector('#app');


  app.innerHTML = MainLayout(
    Hero() +
    PhilosophySection() +
    ShopCatalog() +
    AdvisorCTA()
  );
  initHeroAnimations();
  animatePhilosophySection();
  initShopCatalog();
  initAdvisorCTA();
  // initAICoach is only needed in advisor.html now
  initCart();
  initFooter();

  console.log('🚀 BitIron Frontend Initialized | Unleash Your Legacy');
};

document.addEventListener('DOMContentLoaded', initApp);