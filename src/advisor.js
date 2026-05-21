// src/advisor.js
import './styles/global.css';
import { initTheme } from './lib/theme.js';
initTheme();

import { AIchatPage } from './pages/AIchat.js';
import { initAICoach } from './lib/aichat.js';
import { getToken } from './lib/api.js';

const initAdvisorPage = () => {
  // Redirect to login if not authenticated
  if (!getToken()) {
    window.location.href = '/login.html';
    return;
  }

  // Render full-screen advisor (no main layout — advisor is its own dark canvas)
  const app = document.querySelector('#app');
  app.innerHTML = AIchatPage();

  // Remove FOUC prevent class
  document.body.classList.remove('fouc-prevent');

  // Boot the slideshow controller
  initAICoach();
};

document.addEventListener('DOMContentLoaded', initAdvisorPage);
