// src/main.js
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { Hero } from './components/Hero.js';
import { PhilosophySection } from './components/PhilosophySection.js';
import { ShopCatalog, initShopCatalog } from './components/ShopCatalog.js';
import { initHeroAnimations, animatePhilosophySection } from './lib/motion.js';

import { AICoachChat } from './components/AIchat.js';
import { initAICoach } from './lib/aichat.js';
import { initCart } from './lib/cart.js';

const initApp = () => {
  const app = document.querySelector('#app');


  app.innerHTML = MainLayout(
    Hero() +
    PhilosophySection() +
    ShopCatalog() +
    AICoachChat()
  );
  initHeroAnimations();
  animatePhilosophySection();
  initShopCatalog();
  initAICoach();
  initCart();

  console.log('🚀 BitIron Frontend Initialized | Unleash Your Legacy');
};

document.addEventListener('DOMContentLoaded', initApp);