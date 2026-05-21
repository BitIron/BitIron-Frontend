// src/components/Hero.js
// Hero Version Blanca (Premium/Brutalist) - Imagen más clara y nítida

const BG_URL = `/hero-bg.jpg`;

export const Hero = () => `
  <header id="hero-section" class="relative w-full overflow-hidden bg-white dark:bg-black transition-colors duration-300" style="height: 100dvh; min-height: 100vh;">

    <!-- Imagen de fondo -->
    <div
      id="hero-bg"
      class="absolute inset-0 z-0 opacity-80 dark:opacity-40 transition-opacity duration-300"
      style="
        background-image: url('${BG_URL}');
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
      "
      aria-hidden="true"
    ></div>

    <!-- Fundido lateral blanco intermedio (Claro) -->
    <div
      class="absolute inset-0 z-[1] pointer-events-none dark:hidden"
      style="background: linear-gradient(to right,
        rgba(255,255,255,1)   0%,
        rgba(255,255,255,0.8) 10%,
        rgba(255,255,255,0)   35%,
        rgba(255,255,255,0)   65%,
        rgba(255,255,255,0.8) 90%,
        rgba(255,255,255,1)   100%);"
      aria-hidden="true"
    ></div>

    <!-- Fundido lateral negro intermedio (Oscuro) -->
    <div
      class="absolute inset-0 z-[1] pointer-events-none hidden dark:block"
      style="background: linear-gradient(to right,
        rgba(0,0,0,1)   0%,
        rgba(0,0,0,0.8) 10%,
        rgba(0,0,0,0)   35%,
        rgba(0,0,0,0)   65%,
        rgba(0,0,0,0.8) 90%,
        rgba(0,0,0,1)   100%);"
      aria-hidden="true"
    ></div>

    <!-- Fundido inferior blanco suave (Claro) -->
    <div
      class="absolute inset-0 z-[1] pointer-events-none dark:hidden"
      style="background: linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.95) 100%);"
      aria-hidden="true"
    ></div>

    <!-- Fundido inferior negro suave (Oscuro) -->
    <div
      class="absolute inset-0 z-[1] pointer-events-none hidden dark:block"
      style="background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.95) 100%);"
      aria-hidden="true"
    ></div>

    <!-- Contenido central -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-16">
      <div class="max-w-4xl">

        <p id="hero-label" class="text-[#e62429] font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-6 opacity-0">
          Iron Forged Nutrition
        </p>

        <h1
          id="hero-title"
          class="font-black tracking-tighter leading-[0.85] text-black dark:text-white opacity-0"
          style="font-size: clamp(4.5rem, 13vw, 220px);"
        >
          LEGACY
        </h1>

        <p id="hero-subtitle" class="text-black/50 dark:text-white/50 text-[10px] sm:text-sm font-bold uppercase tracking-[0.3em] mt-8 opacity-0">
          No Excuses. Clinical Doses. Maximum Power.
        </p>

        <div id="hero-cta" class="mt-12 opacity-0">
          <a
            href="#catalog"
            class="btn btn-lg bg-[#e62429] border-2 border-[#e62429] text-white hover:bg-black hover:border-black dark:hover:bg-white dark:hover:border-white hover:text-white dark:hover:text-black font-black uppercase tracking-widest text-xs px-12 transition-all duration-300 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </div>

    <!-- Scroll Indicator -->
    <div id="hero-scroll" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0">
      <span class="text-black/30 dark:text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
      <div class="w-[1px] h-12 bg-gradient-to-b from-black/20 dark:from-white/20 to-transparent"></div>
    </div>

  </header>
`;
