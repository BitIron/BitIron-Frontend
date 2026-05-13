// src/components/Navbar.js
export const Navbar = () => {
  return `
    <nav class="navbar fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-black/5 px-4 lg:px-12">
      <!-- Menú Hamburguesa para Móviles -->
      <div class="navbar-start">
        <div class="dropdown lg:hidden">
          <label tabindex="0" class="btn btn-ghost btn-square text-black">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-2xl bg-white border border-black/10 w-64 uppercase font-black italic tracking-tighter text-black">
            <li><a href="#catalog" class="py-4 hover:text-red-600">Catalog</a></li>
            <li><a href="#philosophy" class="py-4 hover:text-red-600">Philosophy</a></li>
            <li><a href="#lab" class="py-4 hover:text-red-600">The Lab</a></li>
            <li><a href="#account" class="py-4 hover:text-red-600">Account</a></li>
          </ul>
        </div>
        
        <!-- Logo BIT-IRON -->
        <a href="/" class="btn btn-ghost text-2xl lg:text-3xl font-black uppercase tracking-tighter px-0 hover:bg-transparent">
          <span class="text-black">BIT</span><span class="text-red-600">IRON</span>
        </a>
      </div>

      <!-- Menú Desktop (Centro) -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-black/60">
          <li><a href="#catalog" class="hover:text-black transition-colors">Catalog</a></li>
          <li><a href="#philosophy" class="hover:text-black transition-colors">Philosophy</a></li>
          <li><a href="#lab" class="hover:text-black transition-colors">The Lab</a></li>
        </ul>
      </div>

      <!-- Icono de Carrito/Cuenta (Derecha) -->
      <div class="navbar-end">
        <button class="btn btn-ghost btn-square text-black">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>
      </div>
    </nav>
  `;
};