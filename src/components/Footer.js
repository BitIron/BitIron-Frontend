// src/components/Footer.js
// Este componente gestionará el pie de página del sitio con la estética BitIron.
export const Footer = () => {
  return `
    <footer class="bg-black text-white border-t border-white/5 py-12 px-6 mt-auto">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <!-- SECCIÓN DE MARCA -->
        <div class="col-span-1 md:col-span-1">
          <h2 class="text-2xl font-black italic tracking-tighter mb-4">
            BIT<span class="text-red-600">IRON</span>
          </h2>
          <p class="text-gray-500 text-[10px] leading-relaxed uppercase tracking-widest">
            Iron forged nutrition. <br/>
            Clinical doses. Maximum power.
          </p>
        </div>

        <!-- EXPLORAR -->
        <div>
          <h3 class="text-[10px] font-black tracking-[0.3em] uppercase mb-6 text-gray-400">Explore</h3>
          <ul class="space-y-3 text-xs font-bold uppercase tracking-tighter">
            <li><a href="#catalog" class="hover:text-red-600 transition-colors">Catalog</a></li>
            <li><a href="#philosophy" class="hover:text-red-600 transition-colors">Philosophy</a></li>
            <li><a href="#lab" class="hover:text-red-600 transition-colors">The Lab</a></li>
            <li><a href="#athletes" class="hover:text-red-600 transition-colors">Athletes</a></li>
          </ul>
        </div>

        <!-- SOPORTE -->
        <div>
          <h3 class="text-[10px] font-black tracking-[0.3em] uppercase mb-6 text-gray-400">Support</h3>
          <ul class="space-y-3 text-xs font-bold uppercase tracking-tighter">
            <li><a href="#" class="hover:text-red-600 transition-colors">Shipping</a></li>
            <li><a href="#" class="hover:text-red-600 transition-colors">Returns</a></li>
            <li><a href="#" class="hover:text-red-600 transition-colors">Contact</a></li>
          </ul>
        </div>

        <!-- NEWSLETTER -->
        <div>
          <h3 class="text-[10px] font-black tracking-[0.3em] uppercase mb-6 text-gray-400">Join the Legacy</h3>
          <div class="relative">
            <input type="email" placeholder="EMAIL ADDRESS" 
                   class="w-full bg-transparent border-b border-white/20 py-2 text-[10px] focus:border-red-600 outline-none transition-colors italic"/>
            <button class="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black text-red-600 hover:text-white transition-colors">
                JOIN
            </button>
          </div>
        </div>

      </div>

      <!-- BARRA INFERIOR -->
      <div class="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[8px] text-gray-600 tracking-[0.2em] uppercase">
          © 2026 BITIRON ARSENAL. ALL RIGHTS RESERVED.
        </p>
        <div class="flex gap-6 text-gray-600">
            <i class="fa-brands fa-instagram hover:text-white cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-x-twitter hover:text-white cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-youtube hover:text-white cursor-pointer transition-colors"></i>
        </div>
      </div>
    </footer>
  `;
};