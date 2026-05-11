// src/components/Navbar.js
// Navbar fija con blur — traducción exacta del diseño v0.dev a Vanilla JS + DaisyUI

export const Navbar = () => `
  <nav class="navbar fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8">

    <!-- Logo -->
    <div class="navbar-start">
      <a href="/" class="btn btn-ghost text-2xl font-black uppercase tracking-tighter px-0 hover:bg-transparent">
        <span class="text-white">BIT</span>
        <span class="text-[#e62429]">IRON</span>
      </a>
    </div>

    <!-- Links de navegación (ocultos en móvil) -->
    <div class="navbar-center hidden md:flex">
      <ul class="menu menu-horizontal gap-2 px-1">
        <li>
          <a href="#catalog" class="text-[11px] font-black tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-transparent">
            Catalog
          </a>
        </li>
        <li>
          <a href="#philosophy" class="text-[11px] font-black tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-transparent">
            Philosophy
          </a>
        </li>
        <li>
          <a href="#lab" class="text-[11px] font-black tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-transparent">
            Lab
          </a>
        </li>
        <li>
          <a href="#athletes" class="text-[11px] font-black tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-transparent">
            Athletes
          </a>
        </li>
      </ul>
    </div>

    <!-- Carrito -->
    <div class="navbar-end">
      <div class="indicator">
        <span class="indicator-item badge bg-[#e62429] border-[#e62429] text-white badge-sm text-[10px] font-black">0</span>
        <button id="cart-btn" class="btn btn-ghost btn-square" aria-label="Shopping cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="miter"
            class="text-white/70"
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6L5 2H2" />
            <circle cx="9" cy="20" r="1" fill="currentColor" />
            <circle cx="18" cy="20" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

  </nav>
`;
