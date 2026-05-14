// src/advisor.js
// Punto de entrada para la página del AI Advisor (Lab)
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';

const initAdvisorPage = () => {
  const app = document.querySelector('#app');

  const content = `
    <section class="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-white">
      <div class="max-w-5xl w-full border border-black/10 p-12 shadow-2xl bg-white">
        <div class="flex flex-col md:flex-row gap-16 items-center">
          <div class="flex-1">
            <h1 class="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">The <br/><span class="text-[#e62429]">AI</span> Lab</h1>
            <p class="text-black/50 text-sm leading-relaxed mb-10 max-w-md">
              Generate elite-level training and nutrition plans powered by clinical data and neural-forged logic. Built for results.
            </p>
            <div class="p-20 border-2 border-dashed border-black/5 text-center">
              <p class="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">
                Advisor Form Logic <br/> [Initializing Neural Links]
              </p>
            </div>
          </div>
          <div class="w-full md:w-1/3 aspect-[3/4] bg-black/5 border border-black/5 flex items-center justify-center">
             <span class="text-[10px] font-black text-black/20 uppercase tracking-widest">Static Athlete Render</span>
          </div>
        </div>
      </div>
    </section>
  `;

  app.innerHTML = MainLayout(content);
};

document.addEventListener('DOMContentLoaded', initAdvisorPage);
