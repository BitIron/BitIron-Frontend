export const AdvisorCTA = () => {
  return `
    <section id="advisor-cta-section" class="relative w-full min-h-screen overflow-hidden flex items-center justify-center" style="background:#000;">

      <!-- DARK MODE SLIDES -->
      <div class="advisor-slide-dark absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_advanced.png'); filter:brightness(0.45); opacity:1; z-index:1;"></div>
      <div class="advisor-slide-dark absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_vo2max.png'); filter:brightness(0.45); opacity:0; z-index:1;"></div>
      <div class="advisor-slide-dark absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_days6.png'); filter:brightness(0.45); opacity:0; z-index:1;"></div>
      <div class="advisor-slide-dark absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_strength.png'); filter:brightness(0.45); opacity:0; z-index:1;"></div>

      <!-- LIGHT MODE SLIDES (brighter, more colorful) -->
      <div class="advisor-slide-light absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_days4.png'); filter:brightness(0.55) saturate(1.3); opacity:0; z-index:1;"></div>
      <div class="advisor-slide-light absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_metabolic.png'); filter:brightness(0.5) saturate(1.2); opacity:0; z-index:1;"></div>
      <div class="advisor-slide-light absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_intermediate.png'); filter:brightness(0.5); opacity:0; z-index:1;"></div>
      <div class="advisor-slide-light absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url('/assets/advisor/card_stamina.png'); filter:brightness(0.5) saturate(1.2); opacity:0; z-index:1;"></div>

      <!-- OVERLAYS -->
      <div class="absolute inset-0 pointer-events-none" style="z-index:2; background: linear-gradient(to top, #000 0%, transparent 35%, transparent 65%, #000 100%);"></div>
      <div class="absolute inset-0 pointer-events-none" style="z-index:2; background: linear-gradient(to right, rgba(0,0,0,0.65) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.65) 100%);"></div>

      <!-- CONTENT -->
      <div class="relative w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-10 py-24" style="z-index:10;">

        <!-- EYEBROW BADGE -->
        <div style="display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(230,36,41,0.6); padding:5px 18px; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);">
          <span style="width:6px; height:6px; background:#e62429; display:inline-block; border-radius:50%; animation: pulse-dot 2s infinite;"></span>
          <span style="color:#e62429; font-weight:900; font-size:10px; letter-spacing:0.45em; text-transform:uppercase;">BitIron Intelligence</span>
        </div>

        <!-- HEADLINE -->
        <div style="line-height:0.88; letter-spacing:-0.04em;">
          <div style="font-size:clamp(3.5rem,11vw,8rem); font-weight:900; text-transform:uppercase; color:#fff;">Stop</div>
          <div style="font-size:clamp(3.5rem,11vw,8rem); font-weight:900; text-transform:uppercase; color:#e62429; text-shadow:0 0 50px rgba(230,36,41,0.4);">Guessing.</div>
          <div style="font-size:clamp(3.5rem,11vw,8rem); font-weight:900; text-transform:uppercase; color:#fff; margin-top:0.05em;">Start</div>
          <div style="font-size:clamp(3.5rem,11vw,8rem); font-weight:900; text-transform:uppercase; color:transparent; -webkit-text-stroke:3px rgba(255,255,255,0.75);">Winning.</div>
        </div>

        <!-- SUBTEXT -->
        <p style="max-width:480px; color:rgba(255,255,255,0.55); font-weight:700; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; line-height:2.2; margin:0;">
          8 questions &nbsp;·&nbsp; 1 elite blueprint &nbsp;·&nbsp; zero guesswork
        </p>

        <!-- CARTOON BUTTON — comic book style -->
        <div style="position:relative; display:inline-block; margin-top:16px;">

          <!-- Spinning stars -->
          <span class="cta-star" style="position:absolute; top:-18px; right:-14px; font-size:22px; color:#e62429; line-height:1; animation: spin-star 4s linear infinite; display:block;">✦</span>
          <span class="cta-star" style="position:absolute; bottom:-14px; left:-12px; font-size:15px; color:#fff; line-height:1; animation: spin-star 2.5s linear infinite reverse; display:block;">✦</span>
          <span class="cta-star" style="position:absolute; top:-10px; left:-18px; font-size:12px; color:#e62429; line-height:1; animation: spin-star 3.5s linear infinite; display:block;">★</span>

          <!-- FREE badge -->
          <div style="
            position:absolute; top:-20px; right:-28px;
            background:#e62429; color:#fff;
            font-size:8px; font-weight:900; letter-spacing:0.15em; text-transform:uppercase;
            padding:3px 7px; border:2px solid #000;
            transform: rotate(12deg);
            box-shadow: 2px 2px 0 #000;
            z-index:2;
          ">FREE</div>

          <a href="/advisor.html" id="advisor-cta-btn"
             style="
               display: inline-block;
               padding: 18px 52px;
               background: #e62429;
               color: #fff;
               font-weight: 900;
               font-size: 16px;
               text-transform: uppercase;
               letter-spacing: 0.1em;
               text-decoration: none;
               border: 5px solid #000;
               box-shadow: 8px 8px 0px #000;
               transition: transform 0.12s ease, box-shadow 0.12s ease;
               cursor: pointer;
               white-space: nowrap;
               transform: rotate(-1.2deg);
               position: relative;
               animation: btn-breathe 3s ease-in-out infinite;
             "
             onmouseenter="this.style.transform='rotate(1deg) scale(1.05)'; this.style.boxShadow='4px 4px 0px #000'; this.style.animation='none';"
             onmouseleave="this.style.transform='rotate(-1.2deg) scale(1)'; this.style.boxShadow='8px 8px 0px #000'; this.style.animation='btn-breathe 3s ease-in-out infinite';"
             onmousedown="this.style.transform='rotate(0deg) scale(0.96)'; this.style.boxShadow='2px 2px 0px #000'; this.style.animation='none';"
             onmouseup="this.style.transform='rotate(1deg) scale(1.05)'; this.style.boxShadow='4px 4px 0px #000';"
          >
            Forge My Plan &nbsp;&nbsp;→
          </a>
        </div>

      </div>

    </section>

    <style>
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes spin-star {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes btn-breathe {
        0%, 100% { transform: rotate(-1.2deg) scale(1); }
        50%       { transform: rotate(-1.2deg) scale(1.02); }
      }
    </style>
  `;
};

export const initAdvisorCTA = () => {
  const isDark = () =>
    document.documentElement.classList.contains('dark') ||
    localStorage.getItem('bitiron_theme') === 'dark';

  const darkSlides  = [...document.querySelectorAll('.advisor-slide-dark')];
  const lightSlides = [...document.querySelectorAll('.advisor-slide-light')];

  if (!darkSlides.length) return;

  // Initial state: show correct set
  const activate = (slides, index) => {
    slides.forEach((s, i) => { s.style.opacity = i === index ? '1' : '0'; });
  };

  let idx = 0;

  const applyTheme = () => {
    if (isDark()) {
      lightSlides.forEach(s => { s.style.opacity = '0'; });
      activate(darkSlides, idx % darkSlides.length);
    } else {
      darkSlides.forEach(s => { s.style.opacity = '0'; });
      activate(lightSlides, idx % lightSlides.length);
    }
  };

  applyTheme();

  setInterval(() => {
    idx++;
    applyTheme();
  }, 4500);

  // React to theme toggle button clicks
  document.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle, [data-theme-toggle]')) {
      setTimeout(applyTheme, 100);
    }
  });
};
