// src/components/Navbar.js

export const Navbar = () => `
  <nav class="navbar fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-black/5 px-4 lg:px-12 transition-all duration-300" id="main-nav">

    <!-- Start: Logo & Mobile Menu -->
    <div class="navbar-start">
      <div class="dropdown lg:hidden">
        <label tabindex="0" class="btn btn-ghost btn-square text-black">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 8h16M4 16h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-2xl bg-white border border-black/10 w-64 uppercase font-black italic tracking-tighter text-black">
          <li><a href="#catalog" class="py-4 hover:text-red-600">Catalog</a></li>
          <li><a href="#philosophy" class="py-4 hover:text-red-600">Philosophy</a></li>
          <li><a href="#lab" class="py-4 hover:text-red-600">The Lab</a></li>
          <li><a href="#account" class="py-4 hover:text-red-600">Account</a></li>
        </ul>
      </div>

      <a href="/" class="btn btn-ghost text-2xl lg:text-3xl font-black uppercase tracking-tighter px-0 hover:bg-transparent transition-transform hover:scale-105 active:scale-95">
        <span class="text-black">BIT</span><span class="text-[#e62429]">IRON</span>
      </a>
    </div>

    <!-- Center: Navigation Links -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 gap-4">
        ${['Catalog', 'Philosophy', 'Lab', 'Account'].map(item => `
          <li>
            <a href="#${item.toLowerCase()}" 
               class="relative text-[11px] font-bold tracking-[0.2em] uppercase text-black/60 hover:text-black transition-all duration-300 hover:bg-transparent group">
               ${item}
               <span class="absolute bottom-0 left-1/2 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- End: Search & Cart -->
    <div class="navbar-end gap-4">
      
      

      <!-- Cart Icon -->
      <button class="btn btn-ghost btn-square btn-sm hover:bg-black/5 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-black group-hover:text-red-600 transition-colors">
          <path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6L5 2H2" /><circle cx="9" cy="20" r="1" fill="currentColor" /><circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  </nav>
`;