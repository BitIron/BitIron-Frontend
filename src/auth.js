// src/auth.js
import './styles/global.css';
import { initTheme } from './lib/theme.js';

// Inicializar tema inmediatamente
initTheme();

import { MainLayout } from './layouts/MainLayout.js';
import { login, register, setToken } from './lib/api.js';

const initAuthPage = () => {
  const app = document.querySelector('#app');

  // The HTML structure with toggleable forms
  const content = `
    <section class="min-h-[85vh] flex items-center justify-center px-4 py-24 bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      
      <!-- Decoraciones Brutalistas: Silueta de Mancuerna -->
      <div class="absolute top-10 left-[-4rem] w-[400px] h-[400px] pointer-events-none select-none">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-black dark:text-white opacity-[0.03] dark:opacity-[0.015] -rotate-45">
          <!-- Center bar -->
          <rect x="7" y="10.5" width="10" height="3" />
          <!-- Left plates -->
          <rect x="4" y="4" width="3" height="16" rx="0.5" />
          <rect x="1" y="7" width="3" height="10" rx="0.5" />
          <!-- Right plates -->
          <rect x="17" y="4" width="3" height="16" rx="0.5" />
          <rect x="20" y="7" width="3" height="10" rx="0.5" />
        </svg>
      </div>
      
      <!-- Cuadrados Rojos Estéticos Intersectados (Fuera uno del otro) -->
      <div class="absolute bottom-10 right-10 w-64 h-64 border-4 border-[#e62429] opacity-20 rotate-12 pointer-events-none"></div>
      <div class="absolute bottom-52 right-48 w-32 h-32 border-4 border-[#e62429] opacity-30 rotate-12 pointer-events-none"></div>

      <div class="max-w-lg w-full border border-black/10 dark:border-white/10 p-10 sm:p-14 shadow-2xl bg-white dark:bg-black relative z-10 transition-colors duration-300">
        
        <div class="text-center mb-10">
          <h1 class="text-5xl font-black uppercase tracking-tighter mb-2 leading-none">Access <span class="text-[#e62429]">Elite</span></h1>
          <p class="text-black/40 dark:text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">BitIron Authentication Forge</p>
        </div>

        <!-- Toggle Tabs -->
        <div class="flex border-b-2 border-black/10 dark:border-white/10 mb-8">
          <button id="tab-login" class="flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 border-black dark:border-white transition-colors">Login</button>
          <button id="tab-register" class="flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">Register</button>
        </div>
        
        <!-- Error Alert -->
        <div id="auth-error" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-xs font-bold uppercase tracking-wider text-center"></div>

        <!-- Forms Container -->
        <div class="relative min-h-[300px]">
          
          <!-- LOGIN FORM -->
          <form id="form-login" class="absolute inset-0 transition-opacity duration-300 opacity-100 z-10 flex flex-col gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Email Protocol</label>
              <input type="email" id="login-email" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-sm font-bold outline-none focus:border-[#e62429] focus:bg-white dark:focus:bg-black transition-all uppercase text-black dark:text-white" placeholder="ATHLETE@DOMAIN.COM" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Access Code</label>
              <input type="password" id="login-password" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-sm font-bold outline-none focus:border-[#e62429] focus:bg-white dark:focus:bg-black transition-all text-black dark:text-white" placeholder="••••••••" />
            </div>
            <button type="submit" id="btn-login" class="w-full bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white py-5 mt-4 text-sm font-black uppercase tracking-[0.3em] hover:bg-[#e62429] dark:hover:bg-[#e62429] dark:hover:text-white transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none flex justify-center items-center gap-2">
              <span>Initiate Link</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>

          <!-- REGISTER FORM -->
          <form id="form-register" class="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none flex flex-col gap-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Full Designation</label>
              <input type="text" id="reg-name" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-sm font-bold outline-none focus:border-[#e62429] focus:bg-white dark:focus:bg-black transition-all uppercase text-black dark:text-white" placeholder="JOHN DOE" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Email Protocol</label>
              <input type="email" id="reg-email" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-sm font-bold outline-none focus:border-[#e62429] focus:bg-white dark:focus:bg-black transition-all uppercase text-black dark:text-white" placeholder="ATHLETE@DOMAIN.COM" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Create Access Code</label>
              <input type="password" id="reg-password" required minlength="6" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-sm font-bold outline-none focus:border-[#e62429] focus:bg-white dark:focus:bg-black transition-all text-black dark:text-white" placeholder="••••••••" />
            </div>
            <button type="submit" id="btn-register" class="w-full bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white py-5 mt-2 text-sm font-black uppercase tracking-[0.3em] hover:bg-[#e62429] dark:hover:bg-[#e62429] dark:hover:text-white transition-all flex justify-center items-center gap-2">
              <span>Forge Account</span>
            </button>
          </form>

        </div>
      </div>
    </section>
  `;

  app.innerHTML = MainLayout(content);

  // LÓGICA DE INTERFAZ --------------------------------------------------------
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const errorAlert = document.getElementById('auth-error');

  const showError = (msg) => {
    errorAlert.textContent = msg;
    errorAlert.classList.remove('hidden');
  };
  const hideError = () => errorAlert.classList.add('hidden');

  // Toggle Tabs Logic
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.remove('border-transparent', 'text-black/40', 'dark:text-white/40');
    tabLogin.classList.add('border-black', 'dark:border-white');
    
    tabRegister.classList.remove('border-black', 'dark:border-white');
    tabRegister.classList.add('border-transparent', 'text-black/40', 'dark:text-white/40');

    formLogin.classList.replace('opacity-0', 'opacity-100');
    formLogin.classList.remove('pointer-events-none', 'z-0');
    formLogin.classList.add('z-10');

    formRegister.classList.replace('opacity-100', 'opacity-0');
    formRegister.classList.add('pointer-events-none', 'z-0');
    formRegister.classList.remove('z-10');
    hideError();
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.remove('border-transparent', 'text-black/40', 'dark:text-white/40');
    tabRegister.classList.add('border-black', 'dark:border-white');
    
    tabLogin.classList.remove('border-black', 'dark:border-white');
    tabLogin.classList.add('border-transparent', 'text-black/40', 'dark:text-white/40');

    formRegister.classList.replace('opacity-0', 'opacity-100');
    formRegister.classList.remove('pointer-events-none', 'z-0');
    formRegister.classList.add('z-10');

    formLogin.classList.replace('opacity-100', 'opacity-0');
    formLogin.classList.add('pointer-events-none', 'z-0');
    formLogin.classList.remove('z-10');
    hideError();
  });

  // LÓGICA DE API -------------------------------------------------------------
  
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const btn = document.getElementById('btn-login');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Verifying...</span>';
    btn.disabled = true;

    try {
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      
      const data = await login(email, pass);
      setToken(data.token);
      
      // Redirect to home
      window.location.href = '/';
    } catch (err) {
      showError(err.response?.data?.error || 'Authentication Failed');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const btn = document.getElementById('btn-register');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Forging...</span>';
    btn.disabled = true;

    try {
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const pass = document.getElementById('reg-password').value;
      
      await register(name, email, pass);
      
      const loginData = await login(email, pass);
      setToken(loginData.token);
      
      window.location.href = '/';
    } catch (err) {
      showError(err.response?.data?.error || 'Registration Failed');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

};

document.addEventListener('DOMContentLoaded', initAuthPage);
