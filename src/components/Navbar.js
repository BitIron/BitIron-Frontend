// src/components/Navbar.js
// Navbar fija con blur — Versión Blanca (Premium/Brutalist)

export const Navbar = () => `
  <nav class="navbar fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 px-4 md:px-8">

    <!-- Logo -->
    <div class="navbar-start">
      <a href="/" class="btn btn-ghost text-2xl font-black uppercase tracking-tighter px-0 hover:bg-transparent">
        <span class="text-black">BIT</span>
        <span class="text-[#e62429]">IRON</span>
      </a>
    </div>

    <!-- Links de navegación -->
    <div class="navbar-center hidden md:flex">
      <ul class="menu menu-horizontal gap-2 px-1">
        <li>
          <a href="#catalog" class="text-[11px] font-black tracking-[0.2em] uppercase text-black/40 hover:text-black hover:bg-transparent transition-colors">
            Catalog
          </a>
        </li>
        <li>
          <a href="#philosophy" class="text-[11px] font-black tracking-[0.2em] uppercase text-black/40 hover:text-black hover:bg-transparent transition-colors">
            Philosophy
          </a>
        </li>
        <li>
          <a href="/advisor.html" class="text-[11px] font-black tracking-[0.2em] uppercase text-black/40 hover:text-black hover:bg-transparent transition-colors">
            Lab
          </a>
        </li>
        <li>
          <a href="/login.html" class="text-[11px] font-black tracking-[0.2em] uppercase text-black/40 hover:text-black hover:bg-transparent transition-colors">
            Account
          </a>
        </li>
      </ul>
    </div>

    <!-- Carrito -->
    <div class="navbar-end">
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
          class="text-black/60"
        >
          <path d="M6 6h15l-1.5 9h-12z" />
          <path d="M6 6L5 2H2" />
          <circle cx="9" cy="20" r="1" fill="currentColor" />
          <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
      </button>
    </div>

  </nav>
`;
