// src/components/Navbar.js
// Optimized version: Mobile-first, improved accessibility, and scroll effects.

export const Navbar = () => `
  <nav class="navbar fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-12 transition-all duration-300" id="main-nav">

    <!-- Hamburger Menu (Mobile Only) -->
    <div class="navbar-start">
      <div class="dropdown md:hidden">
        <label tabindex="0" class="btn btn-ghost btn-square text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 8h16M4 16h16" />
          </svg>
        </label>

        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-2xl bg-black border border-white/10 w-64 uppercase font-black italic tracking-tighter">
          <li><a href="#catalog" class="py-4 hover:text-red-600">Catalog</a></li>
          <li><a href="#philosophy" class="py-4 hover:text-red-600">Philosophy</a></li>
          <li><a href="#lab" class="py-4 hover:text-red-600">The Lab</a></li>
          <li><a href="#athletes" class="py-4 hover:text-red-600">Athletes</a></li>
        </ul>
      </div>

      <!-- Logo -->
      <a href="/" class="btn btn-ghost text-2xl lg:text-3xl font-black uppercase tracking-tighter px-0 hover:bg-transparent transition-transform hover:scale-105 active:scale-95">
        <span class="text-white">BIT</span><span class="text-[#e62429]">IRON</span>
      </a>
    </div>

    <!-- Desktop Navigation -->
    <div class="navbar-center hidden md:flex">
      <ul class="menu menu-horizontal px-1">
        ${['Catalog', 'Philosophy', 'Lab', 'Athletes'].map(item => `
          <li>
            <a href="#${item.toLowerCase()}" 
               class="relative text-[10px] font-black tracking-[0.3em] uppercase text-white/50 hover:text-white transition-all duration-300 hover:bg-transparent group">
               ${item}
               <span class="absolute bottom-0 left-1/2 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- Search & Cart -->
    <div class="navbar-end gap-4">
      
      <!-- SEARCH BAR -->
      <div class="relative hidden sm:block">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          id="search-input" 
          type="text" 
          placeholder="SEARCH PRODUCT..." 
          class="bg-white/5 border border-white/10 text-[10px] font-black tracking-widest rounded-none w-40 lg:w-64 py-2 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all"
        />
      </div>

      <!-- Shopping Cart -->
      <div class="indicator">
        <span class="indicator-item badge bg-[#e62429] border-none text-[8px] font-black text-white h-4 min-w-[16px] animate-pulse">0</span>
        <button id="cart-btn" class="btn btn-ghost btn-square hover:bg-white/5 group">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-white/80 group-hover:text-red-600 transition-colors">
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