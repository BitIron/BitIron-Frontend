import { getPerfil, getAsesoriasHistorial, clearToken } from './lib/api.js';
import { Navbar } from './components/Navbar.js';
import { Footer, initFooter } from './components/Footer.js';
import { initTheme } from './lib/theme.js';

const renderPlans = (plans) => {
  const container = document.getElementById('plans-container');
  const loader = document.getElementById('plans-loader');
  if (loader) loader.remove();

  if (!plans || plans.length === 0) {
    container.innerHTML = `
      <div class="border-2 border-dashed border-black/20 dark:border-white/20 p-12 text-center flex flex-col items-center justify-center bg-white/5">
        <i class="fa-solid fa-robot text-4xl mb-4 opacity-30"></i>
        <h3 class="font-black uppercase text-xl tracking-tight mb-2">No Plans Generated</h3>
        <p class="font-bold text-sm opacity-60 mb-6 max-w-md">You haven't initialized the AI Advisor yet. Forge your first elite protocol now.</p>
        <a href="/advisor.html" class="bg-[#e62429] text-white px-8 py-4 font-black uppercase text-sm tracking-widest hover:bg-black transition-colors shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] border-2 border-black">
          Forge My Plan →
        </a>
      </div>
    `;
    return;
  }

  // Sort plans by date descending
  plans.sort((a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion));

  container.innerHTML = plans.map((plan, index) => {
    const isLatest = index === 0;
    const date = new Date(plan.FechaCreacion).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
    });

    return `
      <div class="border-2 border-black dark:border-white bg-white dark:bg-[#111] relative ${isLatest ? 'shadow-[8px_8px_0px_#e62429]' : 'shadow-[8px_8px_0px_rgba(0,0,0,0.2)] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.1)]'} transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_#e62429] mb-4">
        ${isLatest ? '<div class="absolute top-0 right-0 bg-[#e62429] text-white font-black text-[9px] uppercase tracking-widest px-3 py-1">LATEST</div>' : ''}
        
        <div class="p-6 border-b-2 border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p class="text-[#e62429] font-black text-[10px] uppercase tracking-widest mb-1">Protocol #${plan.IdAsesoria}</p>
            <h3 class="font-black uppercase text-2xl tracking-tighter">${plan.Disciplina} Focus</h3>
            <p class="font-mono text-xs font-bold opacity-60 mt-1"><i class="fa-regular fa-clock"></i> ${date}</p>
          </div>
          <button class="toggle-plan-btn border-2 border-black dark:border-white px-6 py-2 font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" data-id="${plan.IdAsesoria}">
            View Details <i class="fa-solid fa-chevron-down ml-2 transition-transform duration-300"></i>
          </button>
        </div>

        <!-- Plan Content (Hidden by default) -->
        <div id="plan-content-${plan.IdAsesoria}" class="hidden flex flex-col md:flex-row border-t-2 border-black dark:border-white divide-y-2 md:divide-y-0 md:divide-x-2 divide-black dark:divide-white">
          
          <!-- Workout -->
          <div class="p-6 flex-1 bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white">
            <h4 class="font-black uppercase text-lg tracking-tight mb-4 flex items-center gap-2"><i class="fa-solid fa-dumbbell text-[#e62429]"></i> Training</h4>
            <div class="text-sm leading-relaxed space-y-2">
              ${parseWorkout(plan.RutinaGenerada)}
            </div>
          </div>

          <!-- Nutrition -->
          <div class="p-6 flex-1 bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white">
            <h4 class="font-black uppercase text-lg tracking-tight mb-4 flex items-center gap-2"><i class="fa-solid fa-utensils text-[#e62429]"></i> Nutrition</h4>
            <div class="text-sm leading-relaxed space-y-2">
              ${parseDiet(plan.DietaGenerada)}
            </div>
          </div>

        </div>
      </div>
    `;
  }).join('');

  // Add event listeners for toggle buttons
  document.querySelectorAll('.toggle-plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const content = document.getElementById(`plan-content-${id}`);
      const icon = e.currentTarget.querySelector('i');
      
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.classList.add('flex');
        icon.classList.add('rotate-180');
      } else {
        content.classList.add('hidden');
        content.classList.remove('flex');
        icon.classList.remove('rotate-180');
      }
    });
  });
};

// ── Reusing parsers from aichat.js for dashboard rendering ──
const parseWorkout = (text) => {
  if (!text) return '<p class="text-black dark:text-white">No workout data.</p>';
  try {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('===') && line.endsWith('===')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h5 class="font-black uppercase tracking-widest text-[#e62429] mt-6 mb-2 text-xs">${line.replace(/===/g, '').trim()}</h5>`;
      } else if (line.startsWith('[') && line.endsWith(']')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p class="font-black bg-black text-white dark:bg-white dark:text-black inline-block px-2 py-1 text-[10px] uppercase tracking-widest mt-4 mb-2">${line.replace(/\[|\]/g, '').trim()}</p><br>`;
      } else if (line.startsWith('*') || line.startsWith('▪')) {
        if (!inList) { html += '<ul class="list-disc pl-4 mb-4 space-y-1 text-black dark:text-white">'; inList = true; }
        html += `<li>${line.replace(/^[*▪]\s*/, '').trim()}</li>`;
      } else if (line.startsWith('-')) {
        if (inList) { html += '</ul>'; inList = false; }
        let content = line.substring(1).trim();
        content = content.replace(/(\d+\s*TS\s*\([^)]+\))/gi, '<strong class="text-[#e62429]">$1</strong>');
        content = content.replace(/(\d+\s*BO\s*\([^)]+\))/gi, '<strong>$1</strong>');
        html += `<p class="border-l-2 border-[#e62429] pl-3 py-1 mb-2 bg-black/5 dark:bg-white/5 text-black dark:text-white">${content}</p>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p class="mb-2 opacity-80 text-black dark:text-white">${line}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html;
  } catch (err) {
    return `<pre class="whitespace-pre-wrap font-sans text-black dark:text-white">${text}</pre>`;
  }
};

const parseDiet = (text) => {
  if (!text) return '<p class="text-black dark:text-white">No diet data.</p>';
  try {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.toLowerCase().includes('daily kcal') || line.toLowerCase().includes('chosen distribution')) continue;
      
      if (line.startsWith('===') && line.endsWith('===')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h5 class="font-black uppercase tracking-widest text-[#e62429] mt-6 mb-2 text-xs">${line.replace(/===/g, '').trim()}</h5>`;
      } else if (line.startsWith('[') && line.endsWith(']')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p class="font-black bg-black text-white dark:bg-white dark:text-black inline-block px-2 py-1 text-[10px] uppercase tracking-widest mt-4 mb-2">${line.replace(/\[|\]/g, '').trim()}</p><br>`;
      } else if (line.startsWith('-')) {
        if (line.includes('Opción')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<div class="border border-black/10 dark:border-white/10 p-3 mb-2 bg-white dark:bg-black/50 shadow-sm text-black dark:text-white"><p class="text-xs">${line.replace(/^-\s*/, '')}</p></div>`;
        } else {
          if (!inList) { html += '<ul class="list-disc pl-4 mb-4 space-y-1 text-black dark:text-white">'; inList = true; }
          html += `<li>${line.replace(/^-\s*/, '')}</li>`;
        }
      } else if (line.startsWith('*')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<div class="border-l-4 border-amber-500 bg-amber-500/10 p-3 my-4 text-black dark:text-white"><p class="text-xs font-bold">${line.replace(/^\*\s*/, '')}</p></div>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p class="mb-2 opacity-80 text-black dark:text-white">${line}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html;
  } catch (err) {
    return `<pre class="whitespace-pre-wrap font-sans text-black dark:text-white">${text}</pre>`;
  }
};


const initDashboard = async () => {
  initTheme();
  document.getElementById('navbar-root').innerHTML = Navbar();
  document.getElementById('footer-root').innerHTML = Footer();
  initFooter();

  try {
    const user = await getPerfil();
    if (!user) {
      window.location.href = '/login.html';
      return;
    }

    document.getElementById('user-name').textContent = user.NombreCompleto || 'Athlete';
    document.getElementById('user-email').textContent = user.Email || '';
    document.getElementById('user-goal').textContent = user.ObjetivoFitness || 'Unspecified';
    document.getElementById('user-date').textContent = new Date(user.FechaRegistro).toLocaleDateString();

    const plans = await getAsesoriasHistorial();
    renderPlans(plans);

  } catch (error) {
    console.error("Dashboard init error:", error);
    if (error?.response?.status === 401) {
      window.location.href = '/login.html';
    } else {
      const loader = document.getElementById('plans-loader');
      if (loader) loader.innerHTML = `<p class="text-[#e62429] font-black uppercase tracking-widest text-sm">Failed to load data. System error.</p>`;
    }
  }
};

document.addEventListener('DOMContentLoaded', initDashboard);
