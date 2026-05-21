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

  // ── Transition between slides ────────────────────────────────
  const goTo = (targetStep, direction = 'forward') => {
    if (transitioning) return Promise.resolve(false);
    if (targetStep === currentStep) return Promise.resolve(false);

    const current = getSlide(currentStep);
    const target  = getSlide(targetStep);
    if (!current || !target) return Promise.resolve(false);

    transitioning = true;

    // Dynamically render steps based on chosen discipline
    if (targetStep === 2) {
      renderGoalOptions(answers.disciplina);
    } else if (targetStep === 4) {
      renderDaysOptions(answers.disciplina);
    } else if (targetStep === 6) {
      renderSuppOptions(answers.disciplina);
    } else if (targetStep === 7) {
      renderMealsOptions(answers.disciplina);
    }

    const exitX   = direction === 'forward' ? -50 : 50;
    const enterX  = direction === 'forward' ? 50 : -50;

    // Exit current: smooth slide + scale down + fade
    animate(current, 
      { x: [0, exitX], scale: [1, 0.97], opacity: [1, 0] }, 
      { duration: 0.35, easing: 'ease-in-out' }
    ).then(() => { 
      current.classList.add('hidden'); 
      current.style.transform = ''; 
    });

    // Enter target: smooth slide in + scale up + fade
    target.classList.remove('hidden');
    target.style.opacity = '0';
    target.style.transform = `translateX(${enterX}px) scale(1.03)`;

    // Immediately trigger the content cascade concurrently with the slide transition
    animateIn(target);

    currentStep = targetStep;
    updateUI();

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        animate(target, 
          { x: [enterX, 0], scale: [1.03, 1], opacity: [0, 1] }, 
          { duration: 0.5, easing: [0.16, 1, 0.3, 1] }
        ).then(() => { 
          target.style.transform = ''; 
          transitioning = false;
          resolve(true);
        });
      });
    });
  };

  // ── Update progress bar & counter ───────────────────────────
  const updateUI = () => {
    const pct = currentStep > TOTAL_STEPS ? 100 : Math.round((currentStep - 1) / TOTAL_STEPS * 100);
    if (progress) progress.style.width = pct + '%';
    if (counter) {
      const display = Math.min(currentStep, TOTAL_STEPS);
      counter.textContent = `${String(display).padStart(2,'0')} / ${String(TOTAL_STEPS).padStart(2,'0')}`;
    }
    if (prevBtn) {
      if (currentStep > 1 && currentStep <= TOTAL_STEPS) prevBtn.classList.remove('hidden');
      else prevBtn.classList.add('hidden');
    }
    // Mark selected cards on current slide
    highlightSelected();
  };

  // ── Highlight previously chosen option on re-visit ──────────
  const highlightSelected = () => {
    const slide = getSlide(currentStep);
    if (!slide) return;
    slide.querySelectorAll('.option-card').forEach(card => {
      const isChosen = answers[card.dataset.field] === card.dataset.value;
      card.classList.toggle('border-[#e62429]', isChosen);
      card.classList.toggle('bg-[#e62429]/20', isChosen);
    });
  };

  // ── Option card click ────────────────────────────────────────
  app.addEventListener('click', e => {
    const card = e.target.closest('.option-card');
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    if (transitioning) return;

    const { field, value } = card.dataset;
    answers[field] = value;

    // Flash selected state
    card.classList.add('border-[#e62429]', 'bg-[#e62429]/20');

    // Auto-advance after brief pause
    setTimeout(() => {
      if (currentStep < TOTAL_STEPS) {
        goTo(currentStep + 1, 'forward');
      } else {
        // Step 8 done → show summary
        buildSummary();
        goTo(9, 'forward');
      }
    }, 280);
  });

  // ── Prev button ──────────────────────────────────────────────
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (transitioning) return;
      if (currentStep > 1) goTo(currentStep - 1, 'backward');
    });
  }

  // ── Summary back button ──────────────────────────────────────
  app.addEventListener('click', e => {
    if (e.target.id === 'btn-back-summary') {
      e.preventDefault();
      e.stopPropagation();
      if (transitioning) return;
      goTo(TOTAL_STEPS, 'backward');
    }
  });

  // ── Build review summary ─────────────────────────────────────
  const buildSummary = () => {
    const grid = document.getElementById('summary-grid');
    if (!grid) return;
    grid.innerHTML = Object.entries(answers).map(([field, value]) => {
      const meta  = LABELS[field] || { title: field, map: {} };
      let label = meta.map[value] || value;
      
      // Override goal text in summary if cardio was chosen
      if (field === 'objetivo' && answers.disciplina === 'aerobico') {
        if (value === 'volumen') label = 'Stamina / Base';
        if (value === 'definicion') label = 'Fat Loss';
        if (value === 'recomposicion') label = 'VO2 Max';
      }

      return `
        <div class="border border-white/10 p-4">
          <p class="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">${meta.title}</p>
          <p class="text-white font-black uppercase tracking-tight">${label}</p>
        </div>`;
    }).join('');
  };

  // ── Generate plan ────────────────────────────────────────────
  app.addEventListener('click', async e => {
    if (e.target.id !== 'btn-generate') return;
    e.preventDefault();
    e.stopPropagation();
    if (transitioning) return;

    // Await the completion of the loading slide transition before fetching the plan!
    await goTo(10, 'forward');
    runLoadingAnimation();

    try {
      const payload = {
        disciplina:          answers.disciplina,
        objetivo:            answers.objetivo,
        nivel:               answers.nivel,
        diasEntreno:         parseInt(answers.diasEntreno),
        tipoDieta:           answers.tipoDieta,
        nivelSuplementacion: answers.nivelSuplementacion,
        comidasAlDia:        parseInt(answers.comidasAlDia),
        horaEntreno:         answers.horaEntreno,
      };

      const { data } = await api.post('/planes/generar', payload);
      showResult(data);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Connection error. Please try again.';
      // Go back to summary with error
      goTo(9, 'backward');
      const btn = document.getElementById('btn-generate');
      if (btn) {
        btn.textContent = '⚠ ' + msg.toUpperCase();
        btn.classList.add('bg-black', 'text-[#e62429]');
        setTimeout(() => {
          btn.textContent = 'FORGE MY PLAN →';
          btn.classList.remove('bg-black', 'text-[#e62429]');
        }, 4000);
      }
    }
  });

  // ── Loading animation ─────────────────────────────────────────
  const runLoadingAnimation = () => {
    const msgs = [
      'Analysing your athlete profile...',
      'Computing optimal training split...',
      'Calibrating nutritional macros...',
      'Matching supplements to your goal...',
      'Finalising your elite plan...',
    ];
    const msgEl = document.getElementById('loading-msg');
    const bar   = document.getElementById('loading-bar');
    let i = 0;
    if (bar) bar.style.width = '0%';
    const interval = setInterval(() => {
      if (i >= msgs.length) { clearInterval(interval); return; }
      if (msgEl) msgEl.textContent = msgs[i];
      if (bar)   bar.style.width = `${((i + 1) / msgs.length) * 100}%`;
      i++;
    }, 900);
  };

  // ── Show result ───────────────────────────────────────────────
  const showResult = (data) => {
    goTo(11, 'forward');

    const workout    = document.getElementById('tab-workout');
    const nutrition  = document.getElementById('tab-nutrition');
    const supps      = document.getElementById('tab-supplements');

    if (workout)   workout.innerHTML   = parseWorkout(data.rutina);
    if (nutrition) nutrition.innerHTML = parseDiet(data.dieta);

    // Direct, highly robust real catalog product recommendation system
    const level = (answers.nivelSuplementacion || 'esencial').toLowerCase();
    
    // Exact matching products from seed_25_productos.sql matching active database IDs
    const whey = {
      IdProducto: 6,
      Nombre: 'Whey Protein Concentrate 2kg',
      Marca: 'MyProtein',
      Precio: 49.99,
      Imagen_Url: '/assets/products/myprotein_whey.png',
      Descripcion: 'Concentrado de suero sabor chocolate de máxima pureza para favorecer la recuperación muscular y síntesis proteica.'
    };
    
    const creatina = {
      IdProducto: 8,
      Nombre: 'Creatina Monohidrato Creapure 500g',
      Marca: 'Optimum Nutrition',
      Precio: 29.90,
      Imagen_Url: '/assets/products/lifepro_creapure.png',
      Descripcion: 'Creatina con sello Creapure. Aumenta drásticamente la fuerza, potencia explosiva y resíntesis de ATP.'
    };

    const zma = {
      IdProducto: 17,
      Nombre: 'ZMA (Zinc, Magnesio y B6)',
      Marca: 'Optimum Nutrition',
      Precio: 19.99,
      Imagen_Url: '/assets/products/lifepro_zma.png',
      Descripcion: 'Complejo de zinc y magnesio de alta absorción. Optimiza la contracción, el descanso y el perfil hormonal.'
    };

    let recomendados = [];
    if ((answers.disciplina || '').toLowerCase() === 'aerobico') {
      if (level === 'nada') {
        recomendados = [creatina];
      } else if (level === 'esencial') {
        recomendados = [creatina, zma];
      } else {
        recomendados = [creatina, zma, whey];
      }
    } else {
      if (level === 'nada') {
        recomendados = [creatina];
      } else if (level === 'esencial') {
        recomendados = [creatina, whey];
      } else {
        // avanzado
        recomendados = [creatina, whey, zma];
      }
    }

    if (supps) {
      supps.innerHTML = `
        <p class="text-white/30 text-xs font-black uppercase tracking-widest mb-6">RECOMMENDED FOR YOUR PROFILE</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${recomendados.map(s => `
            <div class="border border-white/10 p-5 bg-white/[0.01] backdrop-blur-md hover:border-[#e62429]/50 transition-colors flex flex-col justify-between h-full group" style="box-shadow: 0 10px 30px rgba(0,0,0,0.5)">
              <div>
                ${s.Imagen_Url ? `
                  <div class="relative w-full h-44 overflow-hidden mb-4 bg-black/40 border border-white/5 flex items-center justify-center rounded p-3">
                    <img src="${s.Imagen_Url}" alt="${s.Nombre}" class="h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105">
                  </div>` : ''}
                <div class="flex justify-between items-start gap-2">
                  <p class="font-black uppercase text-white text-sm tracking-tight leading-snug">${s.Nombre}</p>
                  <span class="text-[9px] font-black border border-[#e62429]/20 px-2 py-0.5 rounded text-[#e62429] bg-[#e62429]/5 uppercase tracking-wider font-sans">${s.Marca}</span>
                </div>
                <p class="text-white/40 text-[11px] mt-2.5 leading-relaxed font-sans">${s.Descripcion}</p>
              </div>
              <div class="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                <p class="text-[#e62429] font-black text-sm tracking-tight">${s.Precio.toFixed(2)} €</p>
                <button 
                  class="bg-white/5 hover:bg-[#e62429] text-white font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded transition-all duration-300 add-to-cart-btn border border-white/10 hover:border-[#e62429] shadow-lg cursor-pointer" 
                  data-id="${s.IdProducto}">
                  ADD TO ARSENAL
                </button>
              </div>
            </div>`).join('')}
        </div>`;

      // Event listener for dynamic Cart additions
      supps.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const productId = btn.dataset.id;
          const originalText = btn.textContent;
          btn.textContent = 'ADDING...';
          btn.disabled = true;

          const success = await addItemToCart(productId);

          if (success) {
            btn.textContent = 'ADDED TO ARSENAL!';
            btn.classList.add('bg-green-600', 'text-white');
            btn.classList.remove('bg-white/5', 'hover:bg-[#e62429]');

            setTimeout(() => {
              btn.textContent = originalText;
              btn.disabled = false;
              btn.classList.remove('bg-green-600');
              btn.classList.add('bg-white/5', 'hover:bg-[#e62429]');
            }, 2000);
          } else {
            btn.textContent = 'FAILED';
            btn.classList.add('bg-red-600', 'text-white');
            btn.classList.remove('bg-white/5', 'hover:bg-[#e62429]');

            setTimeout(() => {
              btn.textContent = originalText;
              btn.disabled = false;
              btn.classList.remove('bg-red-600');
              btn.classList.add('bg-white/5', 'hover:bg-[#e62429]');
            }, 2000);
          }
        });
      });
    }

    // Tab switching
    document.querySelectorAll('.result-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.result-tab').forEach(t => {
          t.classList.remove('active-tab', 'text-[#e62429]', 'border-[#e62429]');
          t.classList.add('text-white/30', 'border-transparent');
        });
        tab.classList.add('active-tab', 'text-[#e62429]', 'border-[#e62429]');
        tab.classList.remove('text-white/30', 'border-transparent');
        document.querySelectorAll('.result-tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById('tab-' + tab.dataset.tab)?.classList.remove('hidden');
      });
    });
  };

  // ── Boot: animate first slide ─────────────────────────────────
  updateUI();
  const first = getSlide(1);
  const introLoader = document.getElementById('intro-loader');
  
  if (introLoader) {
    if (first) {
      first.classList.remove('hidden');
      first.style.opacity = '0';
    }
    // Let the cartoon dumbbell spin for a moment, then fade out the loader
    setTimeout(() => {
      introLoader.style.opacity = '0';
      setTimeout(() => {
        introLoader.remove();
        if (first) {
          first.style.opacity = '1';
          animateIn(first);
        }
      }, 1000);
    }, 1500);
  } else {
    if (first) animateIn(first);
  }
};

// ── Workout Parser: 100% Robust Regex-based fail-safe decorator ──
const parseWorkout = (text) => {
  if (!text) return '<p class="text-white/30">No workout data.</p>';
  try {
    const lines = text.split('\n');
    let html = '';
    let inCard = false;
    let inList = false;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Section Headings (=== Title ===)
      if (line.startsWith('===') && line.endsWith('===')) {
        const title = line.replace(/===/g, '').trim();
        if (inList) { html += '</ul>'; inList = false; }
        if (inCard) { html += '</div>'; inCard = false; }
        
        html += `
          <h3 class="font-black text-white text-base uppercase tracking-wider border-b border-white/10 pb-3 mt-8 mb-4 flex justify-between items-center">
            <span>${title}</span>
            <svg class="text-[#e62429]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </h3>`;
        continue;
      }

      // Group headers ([ Group Title ])
      if (line.startsWith('[') && line.endsWith(']')) {
        const title = line.replace(/\[|\]/g, '').trim();
        if (inList) { html += '</ul>'; inList = false; }
        if (inCard) { html += '</div>'; inCard = false; }

        html += `
          <div class="mt-6 mb-4 bg-black/30 border border-white/5 p-4 rounded">
            <p class="text-[#e62429] font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span>⚡</span> ${title}
            </p>
          </div>
          <div class="space-y-2.5">
        `;
        inCard = true;
        continue;
      }

      // List bullet points starting with * or ▪
      if (line.startsWith('*') || line.startsWith('▪')) {
        const content = line.replace(/^[*▪]\s*/, '').trim();
        if (!inList) {
          html += '<ul class="space-y-2 text-xs text-white/60 font-sans pl-4 mb-4">';
          inList = true;
        }
        html += `<li class="flex gap-2.5 items-start"><span class="text-[#e62429] font-black">•</span> <span>${content}</span></li>`;
        continue;
      }

      if (inList) { html += '</ul>'; inList = false; }

      // Exercise rows starting with -
      if (line.startsWith('-')) {
        const content = line.substring(1).trim();
        // Stylize TS and BO tags with glowing neon badges
        let formattedEx = content;
        formattedEx = formattedEx.replace(/(\d+\s*TS\s*\([^)]+\))/gi, '<span class="inline-block bg-[#e62429]/15 text-[#e62429] border border-[#e62429]/30 text-[9px] font-black px-2 py-0.5 rounded tracking-wide font-sans">$1</span>');
        formattedEx = formattedEx.replace(/(\d+\s*BO\s*\([^)]+\))/gi, '<span class="inline-block bg-white/10 text-white/80 border border-white/15 text-[9px] font-black px-2 py-0.5 rounded tracking-wide font-sans">$1</span>');
        formattedEx = formattedEx.replace(/(\d+\s*series\s*\([^)]+\))/gi, '<span class="inline-block bg-white/5 text-white/60 border border-white/10 text-[9px] font-black px-2 py-0.5 rounded font-sans">$1</span>');

        html += `
          <div class="flex items-center gap-3 p-3.5 bg-black/35 border border-white/5 hover:bg-black/55 transition-colors rounded mb-2">
            <span class="text-[#e62429] font-black text-base">›</span>
            <span class="text-[13px] font-medium text-white/90 leading-relaxed font-sans">${formattedEx}</span>
          </div>
        `;
        continue;
      }

      // General text lines
      html += `<p class="text-xs text-white/50 leading-relaxed mb-2 font-sans">${line}</p>`;
    }

    if (inList) html += '</ul>';
    if (inCard) html += '</div>';

    return html;
  } catch (err) {
    console.error("Fail-safe workout parse failed:", err);
    return `<pre class="text-white/70 font-mono whitespace-pre-wrap">${text}</pre>`;
  }
};

// ── Diet Parser: 100% Robust Regex-based fail-safe decorator ──
const parseDiet = (text) => {
  if (!text) return '<p class="text-white/30">No diet data.</p>';
  try {
    const lines = text.split('\n');
    let kcal = 2500, prot = 160, carb = 300, fat = 70;
    
    // Quick scan to extract macros (plan is generated in English)
    for (let line of lines) {
      if (line.toLowerCase().includes('daily kcal')) {
        const kcalMatch = line.match(/daily kcal:\s*~?(\d+)/i);
        const protMatch = line.match(/proteins:\s*(\d+)g/i);
        const carbMatch = line.match(/carbs:\s*(\d+)g/i);
        const grasMatch = line.match(/fats:\s*(\d+)g/i);

        kcal = kcalMatch ? parseInt(kcalMatch[1]) : 2500;
        prot = protMatch ? parseInt(protMatch[1]) : 160;
        carb = carbMatch ? parseInt(carbMatch[1]) : 300;
        fat = grasMatch ? parseInt(grasMatch[1]) : 70;
        break;
      }
    }

    let html = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="border border-[#e62429]/20 bg-black/40 p-4 rounded text-center backdrop-blur-md relative overflow-hidden" style="box-shadow: 0 10px 30px rgba(230,36,41,0.06)">
          <div class="absolute top-0 left-0 w-full h-[2px] bg-[#e62429]"></div>
          <p class="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1.5 font-sans">DAILY ENERGY</p>
          <p class="text-white font-black text-2xl tracking-tight">${kcal}<span class="text-xs text-[#e62429] font-normal ml-0.5">KCAL</span></p>
        </div>
        <div class="border border-cyan-500/20 bg-black/40 p-4 rounded text-center backdrop-blur-md relative overflow-hidden" style="box-shadow: 0 10px 30px rgba(6,182,212,0.06)">
          <div class="absolute top-0 left-0 w-full h-[2px] bg-cyan-500"></div>
          <p class="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1.5 font-sans">PROTEIN</p>
          <p class="text-white font-black text-2xl tracking-tight">${prot}<span class="text-xs text-cyan-400 font-normal ml-0.5">G</span></p>
        </div>
        <div class="border border-amber-500/20 bg-black/40 p-4 rounded text-center backdrop-blur-md relative overflow-hidden" style="box-shadow: 0 10px 30px rgba(245,158,11,0.06)">
          <div class="absolute top-0 left-0 w-full h-[2px] bg-amber-500"></div>
          <p class="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1.5 font-sans">CARBOHYDRATES</p>
          <p class="text-white font-black text-2xl tracking-tight">${carb}<span class="text-xs text-amber-400 font-normal ml-0.5">G</span></p>
        </div>
        <div class="border border-slate-500/20 bg-black/40 p-4 rounded text-center backdrop-blur-md relative overflow-hidden" style="box-shadow: 0 10px 30px rgba(100,116,139,0.06)">
          <div class="absolute top-0 left-0 w-full h-[2px] bg-slate-400"></div>
          <p class="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1.5 font-sans">DIETARY FAT</p>
          <p class="text-white font-black text-2xl tracking-tight">${fat}<span class="text-xs text-slate-400 font-normal ml-0.5">G</span></p>
        </div>
      </div>
    `;

    let inCard = false;
    let inList = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.toLowerCase().includes('kcal diarias') || line.toLowerCase().includes('distribución elegida')) continue;

      // Section Headings (=== Title ===)
      if (line.startsWith('===') && line.endsWith('===')) {
        const title = line.replace(/===/g, '').trim();
        if (inList) { html += '</ul>'; inList = false; }
        if (inCard) { html += '</div>'; inCard = false; }
        
        html += `
          <h3 class="font-black text-white text-base uppercase tracking-wider border-b border-white/10 pb-3 mt-8 mb-4 flex justify-between items-center">
            <span>${title}</span>
            <span class="text-[9px] text-cyan-400 tracking-widest font-black border border-cyan-500/20 px-2 py-0.5 rounded">DIET DATA</span>
          </h3>
        `;
        continue;
      }

      // Meals or Block headers ([ Meal Title ])
      if (line.startsWith('[') && line.endsWith(']')) {
        const title = line.replace(/\[|\]/g, '').trim();
        if (inList) { html += '</ul>'; inList = false; }
        if (inCard) { html += '</div>'; inCard = false; }

        let tag = 'MEAL';
        let colorClass = 'border-white/10 text-white/50 bg-white/5';
        
        if (title.includes('PRE-ENTRENO')) {
          tag = '🔥 PRE-WORKOUT FUEL';
          colorClass = 'border-[#e62429]/30 text-[#e62429] bg-[#e62429]/10 shadow-[0_0_15px_rgba(230,36,41,0.05)]';
        } else if (title.includes('POST-ENTRENO')) {
          tag = '🔨 POST-WORKOUT RECOVERY';
          colorClass = 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.05)]';
        } else if (title.includes('CENA')) {
          tag = '🌙 ANABOLIC REPAIR';
          colorClass = 'border-purple-500/30 text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.05)]';
        }

        let cleanTitle = title.replace(/COMIDA\s*\d+\s*-?\s*/i, '')
                             .replace(/🔥\s*PRE-ENTRENO\s*🔥/i, '')
                             .replace(/🔨\s*POST-ENTRENO\s*🔨/i, '')
                             .replace(/🌙\s*CENA REPARADORA\s*🌙/i, '').trim();

        if (!cleanTitle) cleanTitle = title;

        html += `
          <div class="mb-6 border border-white/10 bg-white/[0.01] backdrop-blur-md p-6 rounded shadow-2xl hover:border-white/20 transition-all duration-300">
            <div class="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-4 mb-4">
              <h4 class="font-black text-white text-sm uppercase tracking-wider">${cleanTitle}</h4>
              <span class="border text-[8px] font-black px-2.5 py-1 rounded-sm tracking-widest ${colorClass}">${tag}</span>
            </div>
            <div class="space-y-3 font-sans text-xs">
        `;
        inCard = true;
        continue;
      }

      // Meal options starting with -
      if (line.startsWith('-')) {
        let formattedOpt = line.replace(/^-\s*/, '');
        let labelMatch = line.match(/^-\s*(Opción\s*[A-C])/i);
        let badge = labelMatch ? labelMatch[1] : 'OPTION';
        formattedOpt = formattedOpt.replace(/^(Opción\s*[A-C]\s*:\s*)/i, '');

        html += `
          <div class="p-3 bg-black/40 border border-white/5 rounded hover:bg-black/60 transition-colors">
            <p class="text-white/30 font-black text-[8px] uppercase tracking-widest mb-1">${badge}</p>
            <p class="leading-relaxed font-sans text-[13px] text-white/90">${formattedOpt}</p>
          </div>
        `;
        continue;
      }

      // Tips starting with *
      if (line.startsWith('*')) {
        const content = line.replace(/^\*\s*/, '').trim();
        if (content.toLowerCase().includes('tip')) {
          html += `
            <div class="p-3 bg-amber-500/5 border border-amber-500/10 text-amber-300/80 rounded leading-relaxed mt-4">
              <p class="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1">💡 PHYSIOLOGICAL TIP</p>
              <p class="text-[11px] leading-relaxed font-sans">${content.replace(/^(tip\s*fisiológico\s*:\s*)/i, '')}</p>
            </div>
          `;
        } else {
          if (!inList) {
            html += '<ul class="space-y-2 text-xs text-white/60 font-sans pl-4 mb-4">';
            inList = true;
          }
          html += `<li class="flex gap-2.5 items-start"><span class="text-cyan-400 font-black">•</span> <span>${content}</span></li>`;
        }
        continue;
      }

      if (inList) { html += '</ul>'; inList = false; }

      // General text lines
      html += `<p class="text-xs text-white/50 leading-relaxed mb-2 font-sans">${line}</p>`;
    }

    if (inList) html += '</ul>';
    if (inCard) html += '</div>';

    return html;
  } catch (err) {
    console.error("Fail-safe diet parse failed:", err);
    return `<pre class="text-white/70 font-mono whitespace-pre-wrap">${text}</pre>`;
  }
};