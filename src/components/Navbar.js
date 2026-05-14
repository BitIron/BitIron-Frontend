// src/components/Navbar.js
export const Navbar = () => {
  return `
    <nav class="navbar fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-black/5 px-6 lg:px-16 transition-all duration-300">
      <div class="navbar-start">
        <!-- Hamburger Menu (Mobile) -->
        <div class="dropdown lg:hidden">
          <label tabindex="0" class="btn btn-ghost btn-square text-black">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-6 shadow-2xl bg-white border border-black/10 w-72 uppercase font-black italic tracking-tighter text-black">
            <li class="mb-2"><a href="#catalog" class="text-lg hover:text-red-600 transition-colors">Catalog</a></li>
            <li class="mb-2"><a href="#philosophy" class="text-lg hover:text-red-600 transition-colors">Philosophy</a></li>
            <li class="mb-2"><a href="#lab" class="text-lg hover:text-red-600 transition-colors">The Lab</a></li>
            <li class="mt-4 border-t border-black/5 pt-4">
               <a href="#account" class="text-sm font-bold opacity-50">My Account</a>
            </li>
          </ul>
        </div>
        
        <!-- BIT-IRON Branding -->
        <a href="/" class="group flex items-center gap-1 btn btn-ghost px-0 hover:bg-transparent transition-transform active:scale-95">
          <span class="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-black">BIT</span>
          <span class="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-red-600 group-hover:italic transition-all">IRON</span>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
          <li>
            <a href="#catalog" class="hover:text-black hover:bg-transparent relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300">Catalog</a>
          </li>
          <li>
            <a href="#philosophy" class="hover:text-black hover:bg-transparent relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300">Philosophy</a>
          </li>
          <li>
            <a href="#lab" class="hover:text-black hover:bg-transparent relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300">The Lab</a>
          </li>
        </ul>
      </div>

      <!-- Actions (Right) -->
      <div class="navbar-end gap-2">
        <button class="btn btn-ghost btn-square text-black hover:bg-black hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>
      </div>
    </nav>
  `;
};