// src/components/Hero.js
// bg-cover garantiza que no haya barras negras nunca.
// El fundido lateral se aplica encima mediante un div con gradiente.

const BG_URL = `/hero-bg.jpg`;

export const Hero = () => `
  <header id="hero-section" class="relative w-full overflow-hidden bg-black" style="height: 100dvh; min-height: 100vh;">

    <!-- Imagen de fondo: cubre SIEMPRE todo el viewport, sin barras negras -->
    <div
      id="hero-bg"
      class="absolute inset-0 z-0"
      style="
        background-image: url('${BG_URL}');
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
      "
      aria-hidden="true"
    ></div>

    <!-- Fundido lateral: negro que se desvanece MUY poco a poco hacia el centro -->
    <!-- Empieza en negro sólido en el borde y tarda el 38% del ancho en desaparecer -->
    <div
      class="absolute inset-0 z-[1] pointer-events-none"
      style="background: linear-gradient(to right,
        rgba(0,0,0,1)   0%,
        rgba(0,0,0,0.7) 10%,
        rgba(0,0,0,0.3) 22%,
        rgba(0,0,0,0)   38%,
        rgba(0,0,0,0)   62%,
        rgba(0,0,0,0.3) 78%,
        rgba(0,0,0,0.7) 90%,
        rgba(0,0,0,1)   100%);"
      aria-hidden="true"
    ></div>

    <!-- Fundido inferior suave -->
    <div
      class="absolute inset-0 z-[1] pointer-events-none"
      style="background: linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.85) 100%);"
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
          class="font-black tracking-tighter leading-[0.85] text-white drop-shadow-2xl opacity-0"
          style="font-size: clamp(4.5rem, 13vw, 220px);"
        >
          LEGACY
        </h1>

        <p id="hero-subtitle" class="text-white/60 text-[10px] sm:text-sm font-bold uppercase tracking-[0.3em] mt-8 opacity-0">
          No Excuses. Clinical Doses. Maximum Power.
        </p>

        <div id="hero-cta" class="mt-12 opacity-0">
          <a
            href="#catalog"
            class="btn btn-lg bg-[#e62429] border-2 border-[#e62429] text-white hover:bg-transparent hover:border-white hover:text-white font-black uppercase tracking-widest text-xs px-12 transition-all duration-300"
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
      <span class="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
      <div class="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
    </div>

  </header>
`;
