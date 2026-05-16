// src/advisor.js
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { AIchatPage } from './pages/AIchat.js';
import { initAICoach } from './lib/aichat.js';

const initAdvisorPage = () => {
  const app = document.querySelector('#app');
  
  // Inyectamos la página de chat en el layout principal
  app.innerHTML = MainLayout(AIchatPage());
  
  // Inicializamos la lógica del chat
  initAICoach();
};

document.addEventListener('DOMContentLoaded', initAdvisorPage);
