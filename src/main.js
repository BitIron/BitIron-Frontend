// src/main.js
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { Hero } from './components/Hero.js';
import { PhilosophySection } from './components/PhilosophySection.js';
import { ShopCatalog, initShopCatalog } from './components/ShopCatalog.js';
import { initHeroAnimations, animatePhilosophySection } from './lib/motion.js';

import { AICoachChat } from './components/AIchat.js';
import { AIchatPage } from './pages/AIchat.js';
import { initAICoach } from './lib/aichat.js';

const initApp = () => {
  const app = document.querySelector('#app');
  const path = window.location.pathname;
  if (path === '/aichat') {
    app.innerHTML = MainLayout(AIchatPage());
    initAICoach();
    return;
  }

  app.innerHTML = MainLayout(
    Hero() +
    PhilosophySection() +
    ShopCatalog() +
    Footer() +
    AICoachChat()
  );
  initHeroAnimations();
  animatePhilosophySection();
  initShopCatalog();
  initAICoach();

  console.log('🚀 BitIron Frontend Initialized | Unleash Your Legacy');
};

document.addEventListener('DOMContentLoaded', initApp);