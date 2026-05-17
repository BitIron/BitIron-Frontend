// src/components/Footer.js

export const Footer = () => {
  return `
    <footer class="bg-white dark:bg-black text-black dark:text-white border-t-4 border-black dark:border-white py-12 px-6 mt-auto transition-colors duration-300">
      <div class="max-w-7xl mx-auto">
        
        <!-- TOP SECTION: GRID -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-black/10 dark:border-white/10">
          
          <!-- BRAND & SLOGAN (5 cols) -->
          <div class="md:col-span-5 space-y-6">
            <h2 class="text-4xl font-black italic tracking-tighter leading-none">
              BIT<span class="text-red-600">IRON</span><span class="text-[10px] align-top ml-1">®</span>
            </h2>
            <p class="max-w-xs text-[11px] font-bold uppercase tracking-wider leading-tight text-black/60 dark:text-white/60">
              High-performance equipment and nutrition for those who treat the gym like a battlefield. No excuses. Only results.
            </p>
          </div>

          <!-- QUICK LINKS (3 cols) -->
          <div class="md:col-span-3">
            <h3 class="text-xs font-black uppercase tracking-[0.3em] mb-6 underline decoration-red-600 decoration-2 underline-offset-8">Equipment</h3>
            <ul class="space-y-3 text-[10px] font-bold uppercase tracking-widest">
              <li><a href="#" class="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-1 transition-all">Barbells & Plates</a></li>
              <li><a href="#" class="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-1 transition-all">Rack Systems</a></li>
              <li><a href="#" class="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-1 transition-all">Apparel</a></li>
              <li><a href="#" class="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-1 transition-all">Supplements</a></li>
            </ul>
          </div>

          <!-- CONNECT (4 cols) - CAJA CIRCULAR -->
          <div class="md:col-span-4 bg-black text-white p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
            <h3 class="text-xs font-black uppercase tracking-[.3em] mb-4 text-red-600">Intel Dispatch</h3>
            <p class="text-[9px] uppercase font-bold mb-6 tracking-tighter">Join the elite list for early drops.</p>
            
            <div class="flex items-center bg-white/10 rounded-full px-5 py-3 border border-white/10 focus-within:border-red-600 transition-colors">
              <input type="email" placeholder="YOUR EMAIL" 
                     class="bg-transparent w-full text-[10px] font-black outline-none placeholder:text-white/20 uppercase text-white" />
              <button class="text-red-600 font-black text-[10px] hover:scale-110 transition-transform ml-2">
                  GO →
              </button>
            </div>
          </div>

        </div>

        <!-- BOTTOM SECTION -->
        <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex gap-6">
             <span class="text-[9px] font-black uppercase border border-black dark:border-white px-2 py-1">24.5085° N, 54.3773° E</span>
             <span class="text-[9px] font-black uppercase border border-black dark:border-white px-2 py-1">Est. 2026</span>
          </div>
          
          <div class="flex gap-8 text-lg">
            <i class="fa-brands fa-instagram hover:text-red-600 cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-x-twitter hover:text-red-600 cursor-pointer transition-colors"></i>
            <i class="fa-brands fa-youtube hover:text-red-600 cursor-pointer transition-colors"></i>
          </div>

          <p class="text-[9px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
            © BITIRON. Zero shortcuts.
          </p>
        </div>
      </div>
    </footer>
  `;
};