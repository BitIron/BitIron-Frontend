// src/pages/AIchat.js — Fully Immersive Slide Quiz with Perfect Gradient Fallback Support for custom assets

const SLIDE_BG = [
  '/assets/advisor/slide1.png', // discipline
  '/assets/advisor/slide2.png', // goal
  '/assets/advisor/slide3.png', // level
  '/assets/advisor/slide4.png', // days
  '/assets/advisor/slide5.png', // diet
  '/assets/advisor/slide6.png', // supplements
  '/assets/advisor/slide7.png', // meals
  '/assets/advisor/slide8.png', // time
];

/**
 * Image card: massive immersive photo, dark gradient bottom, text overlay.
 * Fail-safe system: Renders the premium background gradient first, then overlays the image when generated.
 */
export const imgCard = (field, value, imgSrc, label, desc, fallbackGradient = 'linear-gradient(135deg, #111, #222)') => {
  return `
    <button
      class="option-card group relative overflow-hidden cursor-pointer text-left w-full h-[58vh] min-h-[380px] max-h-[580px]"
      data-field="${field}" data-value="${value}"
      style="
        border-radius: 4px;
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 20px 50px rgba(0,0,0,0.65);
        transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s ease, border-color 0.25s ease;
      ">
      <!-- Photo background with inline CSS fallback -->
      <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
           style="background: ${fallbackGradient}; background-image: url('${imgSrc}'); background-size: cover; background-position: center;"></div>

      <!-- Bottom gradient overlay -->
      <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)"></div>

      <!-- Glossy top edge -->
      <div class="absolute top-0 left-0 right-0 h-px opacity-75"
           style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)"></div>

      <!-- Hover red border glow -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style="border: 2px solid rgba(230,36,41,0.9); border-radius:4px; box-shadow: inset 0 0 30px rgba(230,36,41,0.25); pointer-events:none"></div>

      <!-- Selected indicator -->
      <div class="card-selected-indicator absolute inset-0 opacity-0 transition-opacity duration-200"
           style="border: 2px solid #e62429; box-shadow: inset 0 0 45px rgba(230,36,41,0.35); border-radius:4px; pointer-events:none"></div>

      <!-- Text at bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-6 z-20">
        <!-- Glassmorphism pill -->
        <div style="
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 3px;
          padding: 18px 20px;
        ">
          <p class="font-black uppercase tracking-widest text-white group-hover:text-[#e62429] transition-colors duration-300"
             style="font-size: 14px; letter-spacing:.22em; line-height:1.1">${label}</p>
          <p class="text-white/50 font-semibold mt-2.5 leading-relaxed" style="font-size:11px">${desc}</p>
        </div>
      </div>
    </button>`;
};

/** Slide wrapper with top-aligned text and breathing room at the bottom */
const slide = (step, bgIdx, stepLabel, headline, redPart, cardsHtml) => `
  <div class="advisor-slide ${step === 1 ? 'active-slide' : 'hidden'} absolute inset-0 overflow-hidden" data-step="${step}">
    <!-- Full-screen BG -->
    <div class="slide-bg absolute inset-0 bg-cover bg-center"
         style="background-image: url('${SLIDE_BG[bgIdx]}'); transform: scale(1.06)"></div>
    <div class="absolute inset-0" style="background: linear-gradient(110deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.6) 100%)"></div>
    <!-- Noise grain -->
    <div class="absolute inset-0 opacity-[0.08]"
         style="background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E');background-size:180px"></div>

    <div class="relative z-10 h-full flex flex-col justify-start px-8 md:px-16 lg:px-24 pt-20 pb-12">
      <div class="w-full max-w-7xl mx-auto flex flex-col h-full justify-between">
        <div>
          <p class="slide-label text-[#e62429] font-black uppercase tracking-[0.4em] mb-3"
             style="font-size:11px; opacity:0; transform:translateY(14px)">${stepLabel}</p>
          <h2 class="slide-headline font-black uppercase text-white leading-none tracking-tighter mb-6"
              style="font-size:clamp(2.6rem,4.4vw,4.4rem); opacity:0; transform:translateY(24px); text-shadow:0 4px 40px rgba(0,0,0,0.5)">
            ${headline}<br><span class="text-[#e62429]">${redPart}</span>
          </h2>
        </div>
        
        <!-- Large option cards container -->
        <div class="w-full flex-grow flex items-center justify-center mb-4">
          ${cardsHtml}
        </div>
        
        <!-- Spacer for breathing room at the bottom -->
        <div class="h-6"></div>
      </div>
    </div>
  </div>`;

export const AIchatPage = () => `
  <div id="advisor-app" class="relative w-full overflow-hidden bg-black" style="min-height:100vh">

    <!-- Intro Loader -->
    <div id="intro-loader" class="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e62429" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-8" style="animation:spin-intro 1.2s linear infinite">
        <path d="M6 5v14M18 5v14"/>
        <rect x="2" y="7" width="4" height="10" rx="1" fill="#e62429" stroke="#000" stroke-width="1.5"/>
        <rect x="18" y="7" width="4" height="10" rx="1" fill="#e62429" stroke="#000" stroke-width="1.5"/>
        <line x1="6" y1="12" x2="18" y2="12" stroke-width="4"/>
      </svg>
      <style>@keyframes spin-intro{to{transform:rotate(360deg)}}</style>
      <h2 class="font-black uppercase text-white tracking-tighter mb-3 text-center" style="font-size:clamp(1.5rem,3vw,2.5rem);">
        INITIALIZING<br><span class="text-[#e62429]">AI ADVISOR</span>
      </h2>
      <p class="text-white/35 font-bold uppercase tracking-widest mt-2" style="font-size:11px">Loading Elite Protocols...</p>
    </div>

    <!-- Progress bar -->
    <div class="fixed top-0 left-0 w-full h-[2px] z-50" style="background:rgba(255,255,255,0.07)">
      <div id="progress-bar" class="h-full transition-all duration-600"
           style="width:0%;background:linear-gradient(90deg,#e62429,#ff6060);box-shadow:0 0 14px rgba(230,36,41,0.9)"></div>
    </div>

    <!-- Top-right counter + exit -->
    <div class="fixed top-5 right-6 z-50 flex items-center gap-5">
      <span id="step-counter" class="font-black text-white/25 uppercase tracking-[.35em]" style="font-size:11px">01 / 08</span>
      <a href="/" class="font-black text-white/20 hover:text-[#e62429] transition-colors uppercase" style="font-size:11px">✕</a>
    </div>

    <!-- Slides -->
    <div id="slides-container" class="relative" style="min-height:100vh">

      <!-- ① DISCIPLINE -->
      ${slide(1, 0, 'STEP 01 — DISCIPLINE', "What's your", 'training style?', `
        <div class="grid grid-cols-3 gap-6 w-full max-w-7xl">
          ${imgCard('disciplina','musculacion','/assets/advisor/card_strength.png','STRENGTH','Hypertrophy & powerlifting. Maximum muscle.')}
          ${imgCard('disciplina','aerobico',   '/assets/advisor/card_cardio.png',  'CARDIO',   'VO2 max & endurance. Engine calibration.')}
          ${imgCard('disciplina','mixta',      '/assets/advisor/card_hybrid.png',  'HYBRID',   'Strength meets conditioning. Peak functional.')}
        </div>`)}

      <!-- ② GOAL -->
      ${slide(2, 1, 'STEP 02 — GOAL', 'Define your', 'objective.', `
        <div id="goal-cards-container" class="grid grid-cols-3 gap-6 w-full max-w-7xl">
          ${imgCard('objetivo','volumen',      '/assets/advisor/card_bulk.png',   'BULK',          'Caloric surplus. Maximum athletic mass.')}
          ${imgCard('objetivo','definicion',   '/assets/advisor/card_cut.png',    'CUT',           'Lean and shredded. Fat loss optimization.')}
          ${imgCard('objetivo','recomposicion','/assets/advisor/card_recomp.png', 'RECOMPOSITION', 'Lose fat. Build muscle. Simultaneous transition.')}
        </div>`)}

      <!-- ③ LEVEL -->
      ${slide(3, 2, 'STEP 03 — EXPERIENCE', 'Your training', 'level.', `
        <div class="grid grid-cols-3 gap-6 w-full max-w-7xl">
          ${imgCard('nivel','principiante','/assets/advisor/card_beginner.png','BEGINNER','Less than 1 year of consistent training.','linear-gradient(135deg,#10101e,#1a1a2e)')}
          ${imgCard('nivel','intermedio',  '/assets/advisor/card_intermediate.png','INTERMEDIATE','1–3 years. Solid athletic base.','linear-gradient(135deg,#0a1525,#10223a)')}
          ${imgCard('nivel','avanzado',    '/assets/advisor/card_advanced.png','ADVANCED','3+ years. Elite performance and CNS capacity.','linear-gradient(135deg,#250808,#3a0d0d)')}
        </div>`)}

      <!-- ④ DAYS -->
      ${slide(4, 3, 'STEP 04 — FREQUENCY', 'Days per week', 'you can train.', `
        <div id="days-cards-container" class="grid grid-cols-4 gap-6 w-full max-w-7xl">
          ${imgCard('diasEntreno','3','/assets/advisor/card_days3.png','3 DAYS','Full Body split. Optimal recovery.','linear-gradient(135deg,#111,#1a1a1a)')}
          ${imgCard('diasEntreno','4','/assets/advisor/card_days4.png','4 DAYS','Upper / Lower split. Balanced volume.','linear-gradient(135deg,#141414,#202020)')}
          ${imgCard('diasEntreno','5','/assets/advisor/card_days5.png','5 DAYS','PPL + Upper/Lower. High frequency.','linear-gradient(135deg,#1e0a0a,#321010)')}
          ${imgCard('diasEntreno','6','/assets/advisor/card_days6.png','6 DAYS','Max frequency. Elite dedication.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
        </div>`)}

      <!-- ⑤ DIET -->
      ${slide(5, 4, 'STEP 05 — DIET TYPE', 'Your dietary', 'preference.', `
        <div class="grid grid-cols-3 gap-6 w-full max-w-7xl">
          ${imgCard('tipoDieta','omnivoro','/assets/advisor/card_omnivore.png','OMNIVORE','Meat, fish, eggs, dairy. Maximum versatility.')}
          ${imgCard('tipoDieta','vegano',  '/assets/advisor/card_vegan.png',  'VEGAN',   'Plant-based only. Complete vegan protocols.')}
          ${imgCard('tipoDieta','flexible','/assets/advisor/card_flexible.png','FLEXIBLE','IIFYM. Hit macros, absolute dynamic choices.','linear-gradient(135deg,#1a140a,#2d2210)')}
        </div>`)}

      <!-- ⑥ SUPPLEMENTS -->
      ${slide(6, 5, 'STEP 06 — SUPPLEMENTATION', 'Supplement', 'stack level.', `
        <div id="supp-cards-container" class="grid grid-cols-3 gap-6 w-full max-w-7xl">
          ${imgCard('nivelSuplementacion','nada',    '/assets/advisor/card_supp_none.png','NONE','Food only. No performance supplements.','linear-gradient(135deg,#111,#1f1f1f)')}
          ${imgCard('nivelSuplementacion','esencial','/assets/advisor/card_supp_essential.png','ESSENTIAL','Whey protein & recovery fundamentals.','linear-gradient(135deg,#0a1a0a,#102d10)')}
          ${imgCard('nivelSuplementacion','avanzado','/assets/advisor/card_supp_advanced.png','ADVANCED','Full stack. Maximum performance and edge.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
        </div>`)}

      <!-- ⑦ MEALS -->
      ${slide(7, 6, 'STEP 07 — MEAL FREQUENCY', 'Meals per', 'day.', `
        <div id="meals-cards-container" class="grid grid-cols-3 gap-6 w-full max-w-7xl">
          ${imgCard('comidasAlDia','3','/assets/advisor/card_meals3.png','3 MEALS/DAY','Classic breakfast, lunch & dinner structure.','linear-gradient(135deg,#111,#1a1a1a)')}
          ${imgCard('comidasAlDia','4','/assets/advisor/card_meals4.png','4 MEALS/DAY','Add a strategic mid-day snack.','linear-gradient(135deg,#1e0a0a,#321010)')}
          ${imgCard('comidasAlDia','5','/assets/advisor/card_meals5.png','5 MEALS/DAY','Maximum anabolism. Constant protein synthesis.','linear-gradient(135deg,#2d0505,#4a0a0a)')}
        </div>`)}

      <!-- ⑧ TIME -->
      ${slide(8, 7, 'STEP 08 — TRAINING TIME', 'When do you', 'train?', `
        <div class="grid grid-cols-4 gap-6 w-full max-w-7xl">
          ${imgCard('horaEntreno','08:00','/assets/advisor/card_time_morning.png','MORNING','6am – 11am. Early rising morning gains.','linear-gradient(135deg,#1a1205,#30220a)')}
          ${imgCard('horaEntreno','13:00','/assets/advisor/card_time_midday.png','MIDDAY','11am – 3pm. Peak CNS window.','linear-gradient(135deg,#0a0f1a,#101a30)')}
          ${imgCard('horaEntreno','17:00','/assets/advisor/card_time_afternoon.png','AFTERNOON','3pm – 7pm. Perfect strength window.','linear-gradient(135deg,#1a0f05,#301a0a)')}
          ${imgCard('horaEntreno','20:00','/assets/advisor/card_time_night.png','NIGHT','7pm – 11pm. Late warrior mode.','linear-gradient(135deg,#080814,#10102d)')}
        </div>`)}

      <!-- ⑨ SUMMARY -->
      <div class="advisor-slide hidden absolute inset-0 overflow-hidden" data-step="9">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image:url('/assets/advisor/slide2.png');filter:brightness(.35)"></div>
        <div class="absolute inset-0" style="background:rgba(0,0,0,0.7)"></div>
        <div class="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 py-20">
          <div class="w-full max-w-7xl mx-auto">
            <p class="slide-label text-[#e62429] font-black uppercase tracking-[.4em] mb-5" style="font-size:11px;opacity:0;transform:translateY(14px)">REVIEW — YOUR PROFILE</p>
            <h2 class="slide-headline font-black uppercase text-white tracking-tighter mb-10" style="font-size:clamp(2.5rem,5vw,4.5rem);opacity:0;transform:translateY(24px)">
              Ready to forge<br><span class="text-[#e62429]">your plan?</span>
            </h2>
            <div id="summary-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"></div>
            <div class="flex gap-3 max-w-xl">
              <button id="btn-generate" class="flex-1 font-black uppercase tracking-[.3em] py-5 text-sm text-white transition-all duration-300"
                style="background:#e62429;border:1px solid rgba(230,36,41,.8);box-shadow:0 0 32px rgba(230,36,41,.35)">
                FORGE MY PLAN →
              </button>
              <button id="btn-back-summary" class="font-black uppercase tracking-widest text-white/25 hover:text-white text-xs transition-colors py-3 px-5"
                style="backdrop-filter:blur(8px);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1)">
                ← EDIT
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ⑩ LOADING -->
      <div class="advisor-slide hidden absolute inset-0 overflow-hidden" data-step="10">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image:url('/assets/advisor/slide1.png');filter:brightness(.2)"></div>
        <div class="absolute inset-0" style="background:rgba(0,0,0,.75)"></div>
        <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
          <div class="text-6xl mb-8" style="animation:spin 3s linear infinite">⚙️</div>
          <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
          <h2 class="font-black uppercase text-white tracking-tighter mb-3" style="font-size:clamp(2rem,4vw,3.5rem);opacity:0;transform:translateY(14px)">
            FORGING YOUR<br><span class="text-[#e62429]">ELITE PLAN</span>
          </h2>
          <p id="loading-msg" class="text-white/35 font-bold uppercase tracking-widest mt-2 mb-10" style="font-size:11px">Analysing your athlete profile...</p>
          <div class="w-full max-w-sm h-[2px]" style="background:rgba(255,255,255,.08)">
            <div id="loading-bar" class="h-full transition-all duration-700" style="width:0%;background:linear-gradient(90deg,#e62429,#ff6060);box-shadow:0 0 8px rgba(230,36,41,.7)"></div>
          </div>
        </div>
      </div>

      <!-- ⑪ RESULT -->
      <div class="advisor-slide hidden absolute inset-0 overflow-y-auto" data-step="11">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image:url('/assets/advisor/slide1.png');filter:brightness(.18)"></div>
        <div class="absolute inset-0" style="background:rgba(0,0,0,.82)"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-24" style="opacity:0;transform:translateY(24px)">
          <p class="text-[#e62429] font-black uppercase tracking-[.4em] mb-3" style="font-size:11px">PLAN GENERATED</p>
          <h2 class="font-black uppercase text-white tracking-tighter mb-10" style="font-size:clamp(2.2rem,5vw,4rem)">
            YOUR ARSENAL<br><span class="text-[#e62429]">IS READY.</span>
          </h2>
          <div class="flex gap-1 mb-8" style="border-bottom:1px solid rgba(255,255,255,.08)">
            <button class="result-tab font-black uppercase tracking-widest px-6 py-3 transition-all text-[#e62429]" style="font-size:11px;border-bottom:2px solid #e62429" data-tab="workout">MY WORKOUT</button>
            <button class="result-tab font-black uppercase tracking-widest px-6 py-3 transition-all text-white/30" style="font-size:11px;border-bottom:2px solid transparent" data-tab="nutrition">MY NUTRITION</button>
            <button class="result-tab font-black uppercase tracking-widest px-6 py-3 transition-all text-white/30" style="font-size:11px;border-bottom:2px solid transparent" data-tab="supplements">SUPPLEMENTS</button>
          </div>
          <div id="tab-workout"     class="result-tab-content text-sm text-white/75 leading-relaxed"></div>
          <div id="tab-nutrition"   class="result-tab-content hidden text-sm text-white/75 leading-relaxed"></div>
          <div id="tab-supplements" class="result-tab-content hidden"></div>
          <div class="mt-14 flex flex-col sm:flex-row gap-4">
            <a href="/" class="flex-1 text-center font-black uppercase tracking-[.25em] py-4 text-xs text-black bg-white hover:bg-[#e62429] hover:text-white transition-all">← BACK TO ARSENAL</a>
            <a href="/dashboard.html" class="flex-1 text-center font-black uppercase tracking-[.25em] py-4 text-xs text-white transition-all"
               style="background:#e62429;box-shadow:0 0 20px rgba(230,36,41,.3)">VIEW DASHBOARD →</a>
          </div>
        </div>
      </div>

    </div><!-- /slides-container -->

    <!-- Back button -->
    <button id="btn-prev" class="fixed bottom-8 left-8 z-50 hidden font-black uppercase tracking-widest text-white/25 hover:text-white transition-colors py-3 px-5"
      style="font-size:11px;backdrop-filter:blur(8px);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)">
      <!-- Back button -->
      ← BACK
    </button>
  </div>
`;