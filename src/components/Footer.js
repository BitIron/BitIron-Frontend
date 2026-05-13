// src/components/Footer.js

export const Footer = () => {
  return `
    <footer class="bg-white text-black border-t border-black/5 py-16 px-6 mt-auto transition-colors duration-300">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <!-- BRAND SECTION -->
        <div class="col-span-1">
          <h2 class="text-2xl font-black italic tracking-tighter mb-4">
            BIT<span class="text-red-600">IRON</span>
          </h2>
          <p class="text-black/40 text-[10px] leading-relaxed uppercase tracking-[0.2em] font-bold">
            Iron forged nutrition. <br/>
            Clinical doses. Maximum power.
          </p>
        </div>

        <!-- EXPLORER -->
        <div>
          <h3 class="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-black/30">Arsenal</h3>
          <ul class="space-y-4 text-[11px] font-bold uppercase tracking-widest">
            <li><a href="#catalog" class="hover:text-red-600 transition-colors">Catalog</a></li>
            <li><a href="#philosophy" class="hover:text-red-600 transition-colors">Philosophy</a></li>
            <li><a href="#lab" class="hover:text-red-600 transition-colors">The Lab</a></li>
            <li><a href="#athletes" class="hover:text-red-600 transition-colors">Athletes</a></li>
          </ul>
        </div>

        <!-- SUPPORT -->
        <div>
          <h3 class="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-black/30">Support</h3>
          <ul class="space-y-4 text-[11px] font-bold uppercase tracking-widest">
            <li><a href="#" class="hover:text-red-600 transition-colors">Shipping</a></li>
            <li><a href="#" class="hover:text-red-600 transition-colors">Returns</a></li>
            <li><a href="#" class="hover:text-red-600 transition-colors">Contact</a></li>
          </ul>
        </div>

        <!-- NEWSLETTER -->
        <div>
          <h3 class="text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-black/30">Join the Legacy</h3>
          <div class="relative group">
            <input type="email" placeholder="EMAIL ADDRESS" 
                   class="w-full bg-transparent border-b border-black/10 py-2 text-[10px] font-bold focus:border-red-600 outline-none transition-colors italic placeholder:text-black/20 text-black"/>
            <button class="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black text-red-600 hover:tracking-[0.2em] transition-all">
                JOIN →
            </button>
          </div>
        </div>

      </div>

      <!-- BOTTOM BAR -->
      <div class="max-w-7xl mx-auto mt-20 pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[9px] text-black/30 tracking-[0.3em] font-black uppercase">
          © 2026 BITIRON ARSENAL. BUILT FOR PERFORMANCE.
        </p>
        <div class="flex gap-8 text-black/40">
            <i class="fa-brands fa-instagram hover:text-red-600 cursor-pointer transition-colors text-sm"></i>
            <i class="fa-brands fa-x-twitter hover:text-red-600 cursor-pointer transition-colors text-sm"></i>
            <i class="fa-brands fa-youtube hover:text-red-600 cursor-pointer transition-colors text-sm"></i>
        </div>
      </div>
    </footer>
  `;
};