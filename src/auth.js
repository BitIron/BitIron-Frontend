// src/auth.js
// Punto de entrada para la página de Autenticación (Login/Registro)
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';

const initAuthPage = () => {
  const app = document.querySelector('#app');

  const content = `
    <section class="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-white">
      <div class="max-w-md w-full border border-black/10 p-12 shadow-2xl bg-white">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-black uppercase tracking-tighter mb-2">Access <span class="text-[#e62429]">Elite</span></h1>
          <p class="text-black/40 text-[10px] font-black uppercase tracking-[0.3em]">BitIron Authentication Forge</p>
        </div>
        
        <div class="space-y-8">
          <div class="p-16 border-2 border-dashed border-black/5 text-center">
             <p class="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">
               Login / Signup Form <br/> [Under Construction]
             </p>
          </div>
          <button class="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-[#e62429] transition-colors">
            Return Home
          </button>
        </div>
      </div>
    </section>
  `;

  app.innerHTML = MainLayout(content);
};

document.addEventListener('DOMContentLoaded', initAuthPage);
