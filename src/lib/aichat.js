// src/lib/aichat.js
// Controller for the full-screen AI Advisor slideshow form
import { animate } from 'motion';
import api from './api.js';
import { imgCard } from '../pages/AIchat.js';
import { addItemToCart } from './cart.js';

const TOTAL_STEPS = 8;

// Labels shown in the review summary
const LABELS = {
  disciplina:          { title: 'DISCIPLINE',     map: { musculacion:'Strength', aerobico:'Cardio', mixta:'Hybrid' } },
  objetivo:            { title: 'GOAL',            map: { volumen:'Bulk', definicion:'Cut', recomposicion:'Recomposition' } },
  nivel:               { title: 'LEVEL',           map: { principiante:'Beginner', intermedio:'Intermediate', avanzado:'Advanced' } },
  diasEntreno:         { title: 'TRAINING DAYS',   map: {} },
  tipoDieta:           { title: 'DIET',            map: { omnivoro:'Omnivore', vegano:'Vegan', flexible:'Flexible' } },
  nivelSuplementacion: { title: 'SUPPLEMENTS',     map: { nada:'None', esencial:'Essential', avanzado:'Advanced' } },
  comidasAlDia:        { title: 'MEALS/DAY',       map: {} },
  horaEntreno:         { title: 'TRAINING TIME',   map: { '08:00':'Morning', '13:00':'Midday', '17:00':'Afternoon', '20:00':'Night' } },
};

const HOUR_LABEL = { '08:00':'Morning (8am)', '13:00':'Midday (1pm)', '17:00':'Afternoon (5pm)', '20:00':'Night (8pm)' };

const IMAGES_TO_PRELOAD = [
  '/assets/advisor/slide1.png',
  '/assets/advisor/slide2.png',
  '/assets/advisor/slide3.png',
  '/assets/advisor/slide4.png',
  '/assets/advisor/slide5.png',
  '/assets/advisor/slide6.png',
  '/assets/advisor/slide7.png',
  '/assets/advisor/slide8.png',
  '/assets/advisor/card_strength.png',
  '/assets/advisor/card_cardio.png',
  '/assets/advisor/card_hybrid.png',
  '/assets/advisor/card_bulk.png',
  '/assets/advisor/card_cut.png',
  '/assets/advisor/card_recomp.png',
  '/assets/advisor/card_stamina.png',
  '/assets/advisor/card_metabolic.png',
  '/assets/advisor/card_vo2max.png',
  '/assets/advisor/card_beginner.png',
  '/assets/advisor/card_intermediate.png',
  '/assets/advisor/card_advanced.png',
  '/assets/advisor/card_days3.png',
  '/assets/advisor/card_days4.png',
  '/assets/advisor/card_days5.png',
  '/assets/advisor/card_days6.png',
  '/assets/advisor/card_omnivore.png',
  '/assets/advisor/card_vegan.png',
  '/assets/advisor/card_flexible.png',
  '/assets/advisor/card_supp_none.png',
  '/assets/advisor/card_supp_essential.png',
  '/assets/advisor/card_supp_advanced.png',
  '/assets/advisor/card_meals3.png',
  '/assets/advisor/card_meals4.png',
  '/assets/advisor/card_meals5.png',
  '/assets/advisor/card_time_morning.png',
  '/assets/advisor/card_time_midday.png',
  '/assets/advisor/card_time_afternoon.png',
  '/assets/advisor/card_time_night.png',
];

const preloadAdvisorImages = () => {
  if (typeof window === 'undefined') return;
  IMAGES_TO_PRELOAD.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

export const initAICoach = () => {
  // Preload all assets immediately to prevent visual load flickering
  preloadAdvisorImages();

  // ── Floating button (home page) ──────────────────────────────
  const trigger = document.querySelector('#ai-coach-trigger');
  if (trigger) {
    if (!trigger.dataset.initialized) {
      trigger.dataset.initialized = 'true';
      trigger.addEventListener('click', () => window.location.href = '/advisor.html');
    }
  }

  // ── Advisor page logic ───────────────────────────────────────
  const app = document.getElementById('advisor-app');
  if (!app) return;
  if (app.dataset.initialized) return;
  app.dataset.initialized = 'true';

  let currentStep = 1;
  let transitioning = false;
  const answers = {};

  const slides   = () => [...document.querySelectorAll('.advisor-slide')];
  const getSlide = (n) => document.querySelector(`.advisor-slide[data-step="${n}"]`);
  const progress = document.getElementById('progress-bar');
  const counter  = document.getElementById('step-counter');
  const prevBtn  = document.getElementById('btn-prev');

  // ── Animate slide content in — cinematic cascade ─────────────
  const animateIn = (slide) => {
    // Ken Burns on slide background: subtle zoom-out
    const bg = slide.querySelector('.slide-bg');
    if (bg) {
      bg.style.transform = 'scale(1.06)';
      animate(bg, { scale: [1.06, 1.0] }, { duration: 1.6, easing: [0.16, 1, 0.3, 1] });
    }

    // Step label
    const label = slide.querySelector('.slide-label');
    if (label) {
      label.style.opacity = '0'; label.style.transform = 'translateY(14px)';
      animate(label, { opacity: [0, 1], y: [14, 0] }, { duration: 0.55, delay: 0.05, easing: 'ease-out' });
    }

    // Headline
    const h2 = slide.querySelector('.slide-headline');
    if (h2) {
      h2.style.opacity = '0'; h2.style.transform = 'translateY(24px)';
      animate(h2, { opacity: [0, 1], y: [24, 0] }, { duration: 0.72, delay: 0.16, easing: [0.16, 1, 0.3, 1] });
    }

    // Enlarged cards — majestic lift + scale spring
    const cards = slide.querySelectorAll('.option-card');
    cards.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(36px) scale(0.96)';
      animate(c,
        { opacity: [0, 1], y: [36, 0], scale: [0.96, 1] },
        { duration: 0.65, delay: 0.24 + i * 0.09, easing: [0.16, 1, 0.3, 1] }
      );
    });

    // Summary grid items
    slide.querySelectorAll('#summary-grid > *').forEach((el, i) => {
      el.style.opacity = '0'; el.style.transform = 'translateY(12px)';
      animate(el, { opacity: [0, 1], y: [12, 0] }, { duration: 0.38, delay: 0.32 + i * 0.055, easing: 'ease-out' });
    });

    // Result content fade-in
    const resultContent = slide.querySelector('[style*="opacity:0"]');
    if (resultContent) {
      resultContent.style.opacity = '0'; resultContent.style.transform = 'translateY(24px)';
      animate(resultContent, { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, delay: 0.1, easing: [0.16, 1, 0.3, 1] });
    }

    // Loading heading cascade
    slide.querySelectorAll('h2').forEach(el => {
      if (getComputedStyle(el).opacity === '0' || el.style.opacity === '0') {
        el.style.opacity = '0'; el.style.transform = 'translateY(14px)';
        animate(el, { opacity: [0, 1], y: [14, 0] }, { duration: 0.65, delay: 0.2, easing: 'ease-out' });
      }
    });
  };

  // ── Render Goal options dynamically based on training style ──
  const renderGoalOptions = (discipline) => {
    const container = document.getElementById('goal-cards-container');
    if (!container) return;

    if (discipline === 'aerobico') {
      container.innerHTML = `
        ${imgCard('objetivo','volumen',      '/assets/advisor/card_stamina.png',   'STAMINA / BASE',  'Increase aerobic capacity. Long distance performance.','linear-gradient(135deg,#101a2e,#0f3460)')}
        ${imgCard('objetivo','definicion',   '/assets/advisor/card_metabolic.png', 'FAT LOSS',        'Optimize fat oxidation. Lean down for speed.','linear-gradient(135deg,#150f1e,#321040)')}
        ${imgCard('objetivo','recomposicion','/assets/advisor/card_vo2max.png',    'VO2 MAX / SPEED', 'Improve lactic threshold & anaerobic power.','linear-gradient(135deg,#1e0a0a,#4a0a0a)')}
      `;
    } else if (discipline === 'mixta') {
      container.innerHTML = `
        ${imgCard('objetivo','volumen',      '/assets/advisor/card_bulk.png',   'HYBRID MASS',    'Build muscle size while maintaining aerobic conditioning.','linear-gradient(135deg,#1a140a,#2d2210)')}
        ${imgCard('objetivo','definicion',   '/assets/advisor/card_cut.png',    'LEAN HYBRID',    'Lose body fat while protecting strength and endurance.','linear-gradient(135deg,#1a0a1a,#2d102d)')}
        ${imgCard('objetivo','recomposicion','/assets/advisor/card_recomp.png', 'ATHLETIC RECOMP','Gain strength and increase VO2 Max simultaneously.','linear-gradient(135deg,#0a1525,#10223a)')}
      `;
    } else {
      container.innerHTML = `
        ${imgCard('objetivo','volumen',      '/assets/advisor/card_bulk.png',   'BULK',          'Caloric surplus. Maximum athletic mass.','linear-gradient(135deg,#1a1a1a,#2d2d2d)')}
        ${imgCard('objetivo','definicion',   '/assets/advisor/card_cut.png',    'CUT',           'Lean and shredded. Fat loss optimization.','linear-gradient(135deg,#1e0a0a,#3d1010)')}
        ${imgCard('objetivo','recomposicion','/assets/advisor/card_recomp.png', 'RECOMPOSITION', 'Lose fat. Build muscle. Simultaneous transition.','linear-gradient(135deg,#0a1525,#10223a)')}
      `;
    }
  };

  // ── Render Days options dynamically based on training style ──
  const renderDaysOptions = (discipline) => {
    const container = document.getElementById('days-cards-container');
    if (!container) return;

    if (discipline === 'aerobico') {
      container.innerHTML = `
        ${imgCard('diasEntreno','3','/assets/advisor/card_days3.png','3 DAYS','LISS & Threshold. Balanced cardiovascular base.','linear-gradient(135deg,#111,#1a1a1a)')}
        ${imgCard('diasEntreno','4','/assets/advisor/card_days4.png','4 DAYS','LISS, Threshold & HIIT. Ideal progression.','linear-gradient(135deg,#141414,#202020)')}
        ${imgCard('diasEntreno','5','/assets/advisor/card_days5.png','5 DAYS','Polarised training split. Elite stamina builder.','linear-gradient(135deg,#1e0a0a,#321010)')}
        ${imgCard('diasEntreno','6','/assets/advisor/card_days6.png','6 DAYS','High-volume block. Maximum adaptation curve.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    } else if (discipline === 'mixta') {
      container.innerHTML = `
        ${imgCard('diasEntreno','3','/assets/advisor/card_days3.png','3 DAYS','3-Day Split. 2 Lifting sessions + 1 LISS engine day.','linear-gradient(135deg,#111,#1a1a1a)')}
        ${imgCard('diasEntreno','4','/assets/advisor/card_days4.png','4 DAYS','4-Day Split. Torso / Pierna + 1 cardiovascular run.','linear-gradient(135deg,#141414,#202020)')}
        ${imgCard('diasEntreno','5','/assets/advisor/card_days5.png','5 DAYS','5-Day Split. PPL lifting + 2 aerobic conditioning days.','linear-gradient(135deg,#1e0a0a,#321010)')}
        ${imgCard('diasEntreno','6','/assets/advisor/card_days6.png','6 DAYS','6-Day Split. Elite athletic volume. Max adaptation curve.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    } else {
      container.innerHTML = `
        ${imgCard('diasEntreno','3','/assets/advisor/card_days3.png','3 DAYS','Full Body split. Optimal recovery.','linear-gradient(135deg,#111,#1a1a1a)')}
        ${imgCard('diasEntreno','4','/assets/advisor/card_days4.png','4 DAYS','Upper / Lower split. Balanced volume.','linear-gradient(135deg,#141414,#202020)')}
        ${imgCard('diasEntreno','5','/assets/advisor/card_days5.png','5 DAYS','PPL + Upper/Lower. High frequency.','linear-gradient(135deg,#1e0a0a,#321010)')}
        ${imgCard('diasEntreno','6','/assets/advisor/card_days6.png','6 DAYS','Max frequency. Elite dedication.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    }
  };

  // ── Render Supplements options dynamically based on training style ──
  const renderSuppOptions = (discipline) => {
    const container = document.getElementById('supp-cards-container');
    if (!container) return;

    if (discipline === 'aerobico') {
      container.innerHTML = `
        ${imgCard('nivelSuplementacion','nada',    '/assets/advisor/card_supp_none.png','NONE','Food only. No performance supplements.','linear-gradient(135deg,#111,#1f1f1f)')}
        ${imgCard('nivelSuplementacion','esencial','/assets/advisor/card_supp_essential.png','ESSENTIAL','Energy gels & baseline rehydration.','linear-gradient(135deg,#0a1a0a,#102d10)')}
        ${imgCard('nivelSuplementacion','avanzado','/assets/advisor/card_supp_advanced.png','ADVANCED','Full stack. Gels, isotonic electrolytes & magnesium.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    } else if (discipline === 'mixta') {
      container.innerHTML = `
        ${imgCard('nivelSuplementacion','nada',    '/assets/advisor/card_supp_none.png','NONE','Food only. No performance supplements.','linear-gradient(135deg,#111,#1f1f1f)')}
        ${imgCard('nivelSuplementacion','esencial','/assets/advisor/card_supp_essential.png','ESSENTIAL','Whey protein & basic electrolyte hydration.','linear-gradient(135deg,#0a1a0a,#102d10)')}
        ${imgCard('nivelSuplementacion','avanzado','/assets/advisor/card_supp_advanced.png','ADVANCED','Full stack. Whey, Creatina & Hydration/Intra gels.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    } else {
      container.innerHTML = `
        ${imgCard('nivelSuplementacion','nada',    '/assets/advisor/card_supp_none.png','NONE','Food only. No performance supplements.','linear-gradient(135deg,#111,#1f1f1f)')}
        ${imgCard('nivelSuplementacion','esencial','/assets/advisor/card_supp_essential.png','ESSENTIAL','Whey protein & recovery fundamentals.','linear-gradient(135deg,#0a1a0a,#102d10)')}
        ${imgCard('nivelSuplementacion','avanzado','/assets/advisor/card_supp_advanced.png','ADVANCED','Full stack. Whey, Creatine & Pre-workout edge.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    }
  };

  // ── Render Meals options dynamically based on training style ──
  const renderMealsOptions = (discipline) => {
    const container = document.getElementById('meals-cards-container');
    if (!container) return;

    if (discipline === 'aerobico') {
      container.innerHTML = `
        ${imgCard('comidasAlDia','3','/assets/advisor/card_meals3.png','3 MEALS/DAY','Classic baseline breakfast, lunch & dinner.','linear-gradient(135deg,#111,#1a1a1a)')}
        ${imgCard('comidasAlDia','4','/assets/advisor/card_meals4.png','4 MEALS/DAY','Fueling before & after major rodajes.','linear-gradient(135deg,#1e0a0a,#321010)')}
        ${imgCard('comidasAlDia','5','/assets/advisor/card_meals5.png','5 MEALS/DAY','Constant energy replenishment for high volume.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    } else if (discipline === 'mixta') {
      container.innerHTML = `
        ${imgCard('comidasAlDia','3','/assets/advisor/card_meals3.png','3 MEALS/DAY','Classic breakfast, lunch & dinner balance.','linear-gradient(135deg,#111,#1a1a1a)')}
        ${imgCard('comidasAlDia','4','/assets/advisor/card_meals4.png','4 MEALS/DAY','Adding strategic fuel before weight / run sessions.','linear-gradient(135deg,#1e0a0a,#321010)')}
        ${imgCard('comidasAlDia','5','/assets/advisor/card_meals5.png','5 MEALS/DAY','Max athletic recovery. Nutrient timing for two domains.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    } else {
      container.innerHTML = `
        ${imgCard('comidasAlDia','3','/assets/advisor/card_meals3.png','3 MEALS/DAY','Classic breakfast, lunch & dinner structure.','linear-gradient(135deg,#111,#1a1a1a)')}
        ${imgCard('comidasAlDia','4','/assets/advisor/card_meals4.png','4 MEALS/DAY','Add a strategic mid-day snack.','linear-gradient(135deg,#1e0a0a,#321010)')}
        ${imgCard('comidasAlDia','5','/assets/advisor/card_meals5.png','5 MEALS/DAY','Maximum anabolism. Constant protein synthesis.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
      `;
    }
  };
};