// src/components/Navbar.js
export const Navbar = () => {
  return `
    <nav class="navbar fixed top-0 left-0 right-0 z-[100] bg-white border-b border-black/5 px-4 lg:px-12">
      <div class="navbar-start">
        <a href="/" class="btn btn-ghost text-2xl font-black uppercase tracking-tighter">
          <span class="text-black">BIT</span><span class="text-red-600">IRON</span>
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-4 text-[11px] font-bold uppercase tracking-widest text-black/60">
          <li><a href="#catalog" class="hover:text-black">Catalog</a></li>
          <li><a href="#philosophy" class="hover:text-black">Philosophy</a></li>
          <li><a href="#lab" class="hover:text-black">The Lab</a></li>
        </ul>
      </div>
      <div class="navbar-end">
        <button class="btn btn-ghost btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="text-black">
            <path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6L5 2H2" /></svg>
        </button>
      </div>
    </nav>
  `;
};