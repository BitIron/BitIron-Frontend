// src/components/Navbar.js
import { toggleTheme, isDarkMode } from '../lib/theme.js';
import { getPedidosCliente, getPerfil, updatePerfil, decodeToken, getAsesoriasHistorial, createAsesoria, updateAsesoria, deleteAsesoria } from '../lib/api.js';

// Function to show the Orders Modal
const showOrdersModal = async () => {
  let overlay = document.getElementById('orders-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'orders-modal-overlay';
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
    document.body.appendChild(overlay);
  }
  
  // Show with fade-in
  setTimeout(() => overlay.classList.remove('opacity-0'), 10);
  
  // Inject skeleton loader first
  overlay.innerHTML = `
    <div class="bg-white dark:bg-black text-black dark:text-white w-full max-w-2xl border-[6px] border-black dark:border-white shadow-[12px_12px_0px_0px_#e62429] p-8 max-h-[85vh] overflow-y-auto relative transition-colors duration-300">
      <button id="btn-close-orders" class="absolute top-4 right-4 text-black dark:text-white hover:text-[#e62429] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <h2 class="text-3xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white pb-3 mb-6">MY ARSENAL (ORDER HISTORIC)</h2>
      <div class="space-y-4 animate-pulse">
        <div class="h-20 bg-gray-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10"></div>
        <div class="h-20 bg-gray-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10"></div>
      </div>
    </div>
  `;

  // Attach close listener
  overlay.querySelector('#btn-close-orders').addEventListener('click', () => {
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.remove(), 300);
  });
  
  try {
    const token = localStorage.getItem('bitiron_token');
    if (!token) return;
    
    const decoded = decodeToken(token);
    const idCliente = decoded ? decoded.id : null;
    if (!idCliente) throw new Error("Could not decode user ID.");
    
    const ordersRes = await getPedidosCliente(idCliente);
    const orders = ordersRes.data || [];
    
    let ordersHtml = '';
    if (orders.length === 0) {
      ordersHtml = `
        <div class="text-center py-12 border-4 border-dashed border-black/20 dark:border-white/20">
          <h3 class="text-xl font-black uppercase tracking-tighter text-black/40 dark:text-white/40 mb-2">NO DISPATCHES GENERATED YET</h3>
          <p class="text-xs uppercase tracking-widest text-[#e62429] font-bold">Go to the catalog and forge your first order.</p>
        </div>
      `;
    } else {
      orders.forEach(order => {
        const idPedido = order.IdPedido;
        const fecha = new Date(order.FechaPedido).toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const total = parseFloat(order.TotalPagar || 0).toFixed(2);
        const estado = order.Estado || 'Pendiente';
        
        let badgeColor = 'bg-yellow-500 text-black border-yellow-600';
        if (estado === 'Pagado' || estado === 'Enviado' || estado === 'Entregado') {
          badgeColor = 'bg-green-600 text-white border-green-700';
        } else if (estado === 'Cancelado') {
          badgeColor = 'bg-[#e62429] text-white border-red-800';
        }
        
        let productsHtml = '';
        if (order.productos && order.productos.length > 0) {
          productsHtml = order.productos.map(p => `
            <div class="flex justify-between items-center text-xs py-1 border-b border-black/5 dark:border-white/5 last:border-b-0">
              <span class="font-bold text-black/70 dark:text-white/70">${p.Nombre || p.nombre || 'Product'} (x${p.Cantidad || 1})</span>
              <span class="font-black">${parseFloat(p.PrecioUnitario || 0).toFixed(2)} €</span>
            </div>
          `).join('');
        }
        
        ordersHtml += `
          <div class="border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] flex flex-col gap-3 relative transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)]">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-black dark:border-white pb-2">
              <div>
                <span class="text-[10px] font-black text-black/40 dark:text-white/40 uppercase block">DISPATCH NO.</span>
                <span class="text-lg font-black tracking-tighter text-black dark:text-white">#00${idPedido}</span>
              </div>
              <span class="px-2 py-1 text-[10px] font-black uppercase border-2 ${badgeColor} tracking-widest">${estado}</span>
            </div>
            
            <div class="space-y-1 py-1 text-black dark:text-white">
              ${productsHtml || '<span class="text-xs italic text-black/40">Details processing...</span>'}
            </div>
            
            <div class="flex justify-between items-end border-t border-black/10 dark:border-white/10 pt-2 text-xs text-black dark:text-white">
              <span class="text-[10px] text-black/40 dark:text-white/40 uppercase font-bold">${fecha}</span>
              <div class="text-right">
                <span class="text-[9px] text-black/40 dark:text-white/40 uppercase block font-bold">TOTAL DISPATCHED</span>
                <span class="text-lg font-black tracking-tight text-[#e62429]">${total} €</span>
              </div>
            </div>
          </div>
        `;
      });
    }
    
    // Inject the final dynamic content
    overlay.innerHTML = `
      <div class="bg-white dark:bg-black text-black dark:text-white w-full max-w-2xl border-[6px] border-black dark:border-white shadow-[12px_12px_0px_0px_#e62429] p-8 max-h-[85vh] overflow-y-auto relative transition-colors duration-300">
        <button id="btn-close-orders" class="absolute top-4 right-4 text-black dark:text-white hover:text-[#e62429] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 class="text-3xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white pb-3 mb-6">MY ARSENAL (ORDER HISTORIC)</h2>
        <div class="space-y-6">
          ${ordersHtml}
        </div>
      </div>
    `;

    overlay.querySelector('#btn-close-orders').addEventListener('click', () => {
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.remove(), 300);
    });
    
  } catch (error) {
    console.error(error);
    overlay.innerHTML = `
      <div class="bg-white dark:bg-black text-black dark:text-white w-full max-w-md border-[6px] border-black dark:border-white shadow-[12px_12px_0px_0px_#e62429] p-8 relative transition-colors duration-300">
        <button id="btn-close-orders" class="absolute top-4 right-4 text-black dark:text-white hover:text-[#e62429] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 class="text-3xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white pb-3 mb-6">ERROR</h2>
        <p class="text-red-600 font-bold uppercase text-center">FAILED TO COMPILE ORDERS. MAKE SURE THE BACKEND IS RUNNING AND YOU ARE CONNECTED.</p>
      </div>
    `;
    overlay.querySelector('#btn-close-orders').addEventListener('click', () => {
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.remove(), 300);
    });
  }
};

// Function to show the Settings Modal
const showSettingsModal = async () => {
  let overlay = document.getElementById('settings-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'settings-modal-overlay';
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
    document.body.appendChild(overlay);
  }
  
  setTimeout(() => overlay.classList.remove('opacity-0'), 10);
  const token = localStorage.getItem('bitiron_token');
  const decoded = token ? decodeToken(token) : null;
  const idCliente = decoded ? (decoded.id || decoded.IdCliente || decoded.idCliente) : null;

  if (!decoded) {
    overlay.innerHTML = `<div class="p-8 text-center text-red-600 font-bold uppercase">PLEASE LOGIN TO ACCESS DASHBOARD</div>`;
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 transition-opacity duration-300';
    return;
  }

  const loadAndRender = async (activeTab = 'profile') => {
    overlay.innerHTML = `
      <div class="bg-white dark:bg-black text-black dark:text-white w-full max-w-xl border-[6px] border-black dark:border-white shadow-[12px_12px_0px_0px_#e62429] p-8 relative transition-colors duration-300">
        <div class="animate-pulse space-y-6">
          <div class="h-8 bg-black/10 dark:bg-white/10 w-2/3"></div>
          <div class="h-10 bg-black/10 dark:bg-white/10 w-full"></div>
          <div class="h-40 bg-black/10 dark:bg-white/10 w-full"></div>
        </div>
      </div>
    `;
    
    try {
      const profile = await getPerfil();
      const nombre = profile.NombreCompleto || '';
      const email = profile.Email || 'athlete@bitiron.com';
      const objetivo = profile.ObjetivoFitness || 'Ninguno';
      const asesorias = await getAsesoriasHistorial();
      const getAsesoriaId = (a) => a ? (a.IdAsesoria || a.idAsesoria || a.id) : null;
      let activeAsesoria = asesorias.length > 0 ? [...asesorias].sort((a, b) => getAsesoriaId(b) - getAsesoriaId(a))[0] : null;
      const isVisualInactive = localStorage.getItem('bitiron_active_coaching_cancelled') === 'true';

      let localData = {};
      try {
        localData = JSON.parse(localStorage.getItem('bitiron_athlete_profile') || '{}');
      } catch (e) {}
      
      const phone = localData.phone || '+34 600 000 000';
      const address = localData.address || 'CALLE PRINCIPAL 123';
      const city = localData.city || 'MADRID';
      const zip = localData.zip || '28001';
      const payment = localData.payment || 'Credit Card';
      const apparelSize = localData.apparelSize || 'M';

      overlay.innerHTML = `
        <div class="bg-white dark:bg-black text-black dark:text-white w-full max-w-xl border-[6px] border-black dark:border-white shadow-[12px_12px_0px_0px_#e62429] p-8 relative transition-colors duration-300 max-h-[90vh] overflow-y-auto">
          <button id="btn-close-settings" class="absolute top-4 right-4 text-black dark:text-white hover:text-[#e62429] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <h2 class="text-3xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white pb-3 mb-4">ATHLETE DASHBOARD</h2>
          
          <!-- Tabs Selector -->
          <div class="flex border-4 border-black dark:border-white mb-6 uppercase text-xs font-black tracking-wider">
            <button id="tab-profile-btn" class="flex-1 px-3 py-2 border-r-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black transition-colors">
              PROFILE
            </button>
            <button id="tab-security-btn" class="flex-1 px-3 py-2 border-r-4 border-black dark:border-white bg-white text-black dark:bg-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              SECURITY
            </button>
            <button id="tab-membership-btn" class="flex-1 px-3 py-2 bg-white text-black dark:bg-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              MEMBERSHIP
            </button>
          </div>

          <!-- Tab 1: Profile -->
          <div id="tab-content-profile" class="space-y-4">
            <form id="settings-form" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">ATHLETE NAME</label>
                  <input type="text" id="settings-name" value="${nombre}" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                    EMAIL ADDRESS 
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </label>
                  <input type="email" value="${email}" disabled class="w-full bg-gray-100 dark:bg-zinc-800 border-4 border-black/30 dark:border-white/30 px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none text-black/50 dark:text-white/50 cursor-not-allowed" />
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">SHIPPING STREET ADDRESS</label>
                <input type="text" id="settings-address" value="${address}" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">CITY / PROVINCE</label>
                  <input type="text" id="settings-city" value="${city}" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">ZIP / POSTAL CODE</label>
                  <input type="text" id="settings-zip" value="${zip}" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-1 md:col-span-1">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">CONTACT PHONE</label>
                  <input type="text" id="settings-phone" value="${phone}" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
                </div>
                <div class="flex flex-col gap-1 md:col-span-1">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">DEFAULT PAYMENT</label>
                  <select id="settings-payment" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white">
                    <option value="Credit Card" ${payment === 'Credit Card' ? 'selected' : ''}>CREDIT CARD / DEBIT</option>
                    <option value="PayPal" ${payment === 'PayPal' ? 'selected' : ''}>PAYPAL ACCOUNT</option>
                    <option value="BitIron Token" ${payment === 'BitIron Token' ? 'selected' : ''}>BIT-IRON TOKEN WALLET</option>
                    <option value="Bitcoin" ${payment === 'Bitcoin' ? 'selected' : ''}>BTC ADDRESS</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1 md:col-span-1">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">APPAREL SIZE</label>
                  <select id="settings-size" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white">
                    <option value="S" ${apparelSize === 'S' ? 'selected' : ''}>S (SMALL)</option>
                    <option value="M" ${apparelSize === 'M' ? 'selected' : ''}>M (MEDIUM)</option>
                    <option value="L" ${apparelSize === 'L' ? 'selected' : ''}>L (LARGE)</option>
                    <option value="XL" ${apparelSize === 'XL' ? 'selected' : ''}>XL (OVERSIZE)</option>
                    <option value="XXL" ${apparelSize === 'XXL' ? 'selected' : ''}>XXL (ELITE BEAST)</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center gap-3 py-2">
                <input type="checkbox" id="settings-newsletter" checked class="checkbox rounded-none border-2 border-black dark:border-white" />
                <label for="settings-newsletter" class="text-[10px] font-black uppercase tracking-wider cursor-pointer select-none text-black dark:text-white">ENABLE WEEKLY COACHING & PERFORMANCE SMS</label>
              </div>

              <button type="submit" class="w-full bg-[#e62429] text-white py-3 text-xs font-black uppercase tracking-[0.2em] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all">
                SAVE CHANGES
              </button>
            </form>
          </div>

          <!-- Tab 2: Security -->
          <div id="tab-content-security" class="hidden space-y-4">
            <form id="security-form" class="space-y-4">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">CURRENT PASSWORD</label>
                <input type="password" id="security-current" placeholder="••••••••" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">NEW PASSWORD</label>
                <input type="password" id="security-new" placeholder="••••••••" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429]">CONFIRM NEW PASSWORD</label>
                <input type="password" id="security-confirm" placeholder="••••••••" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold outline-none focus:bg-white dark:focus:bg-black transition-colors text-black dark:text-white" required />
              </div>

              <div id="security-feedback" class="text-[10px] font-black uppercase tracking-wider text-red-600 hidden"></div>

              <button type="submit" class="w-full bg-black text-white dark:bg-white dark:text-black py-3 text-xs font-black uppercase tracking-[0.2em] border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)] transition-all">
                ROTATE KEY
              </button>
            </form>
          </div>

          <!-- Tab 3: Membership -->
          <div id="tab-content-membership" class="hidden space-y-4">
            ${activeAsesoria ? `
              <div class="border-4 border-black dark:border-white p-4 bg-zinc-50 dark:bg-zinc-900/40 relative">
                <div class="space-y-3">
                  <div>
                    <span class="text-[9px] font-black text-[#e62429] tracking-[0.2em] block">MEMBERSHIP CLASS</span>
                    <h3 class="text-xl font-black italic tracking-tighter text-black dark:text-white uppercase">${activeAsesoria.TipoPlan}</h3>
                  </div>
                  <div class="h-[2px] bg-black/10 dark:bg-white/10"></div>
                  <div class="grid grid-cols-2 gap-4 text-xs font-bold uppercase text-black dark:text-white">
                    <div>
                      <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">JOIN DATE</span>
                      <span>${new Date(activeAsesoria.FechaInicio).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                    </div>
                    <div>
                      <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">BILLING PERIOD</span>
                      <span>MONTHLY (€${activeAsesoria.PrecioMensual})</span>
                    </div>
                    <div>
                      <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">STATUS BILLING</span>
                      <span id="status-billing-text" class="${isVisualInactive ? 'text-zinc-500' : (activeAsesoria.PagadoAlDia ? 'text-green-600' : 'text-red-600')}">
                        ${isVisualInactive ? 'CANCELLED / INACTIVE' : (activeAsesoria.PagadoAlDia ? 'PAID / UP TO DATE' : 'PENDING PAYMENT')}
                      </span>
                    </div>
                    <div>
                      <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">AI COACH TIER</span>
                      <span id="ai-coach-tier-text" class="${isVisualInactive ? 'text-zinc-500' : 'text-[#e62429]'}">
                        ${isVisualInactive ? 'LOCKED (INACTIVE)' : 'UNLOCKED (PRO)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fully Functional Action Buttons -->
              <div class="w-full">
                <button id="btn-change-plan" class="w-full bg-black text-white dark:bg-white dark:text-black py-2.5 text-xs font-black uppercase tracking-wider border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                  CHANGE PLAN
                </button>
              </div>
              
              <!-- Hidden Change Plan Panel -->
              <div id="change-plan-panel" class="hidden border-4 border-black dark:border-white p-4 space-y-3 bg-gray-50 dark:bg-zinc-900 transition-all">
                <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429] block">SELECT NEW ELITE ATHLETIC DISCIPLINE (€49.99/MO)</label>
                <select id="select-change-plan" class="w-full bg-white dark:bg-black border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none text-black dark:text-white">
                  <option value="HYPERTROPHY & BULK" ${activeAsesoria.TipoPlan.includes('HYPERTROPHY') || activeAsesoria.TipoPlan.includes('HIPERTROFIA') ? 'selected' : ''}>HYPERTROPHY & BULK (FOCUS: MUSCLE MASS & STRENGTH)</option>
                  <option value="CARDIO ENDURANCE & HEALTH" ${activeAsesoria.TipoPlan.includes('CARDIO') || activeAsesoria.TipoPlan.includes('RESISTENCIA') ? 'selected' : ''}>CARDIO ENDURANCE & HEALTH (FOCUS: VO2 MAX & ENDURANCE)</option>
                  <option value="HYBRID ATHLETE TRAINING" ${activeAsesoria.TipoPlan.includes('HYBRID') || activeAsesoria.TipoPlan.includes('MIXTA') ? 'selected' : ''}>HYBRID ATHLETE TRAINING (FOCUS: HYBRID ATHLETE CONDITIONING)</option>
                </select>
                <button id="btn-submit-change-plan" class="w-full bg-black text-white dark:bg-white dark:text-black py-2.5 text-xs font-black uppercase tracking-wider border-4 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  CONFIRM PLAN SWITCH
                </button>
              </div>
            ` : `
              <div class="border-4 border-black dark:border-white p-6 bg-zinc-50 dark:bg-zinc-900/40 text-center space-y-4">
                <span class="px-2 py-0.5 text-[8px] font-black uppercase bg-gray-400 text-white border-2 border-black tracking-widest inline-block">INACTIVE</span>
                <h3 class="text-xl font-black italic tracking-tighter text-black dark:text-white">NO ACTIVE COACHING PLAN FOUND</h3>
                <p class="text-xs font-bold uppercase tracking-wider text-gray-500 max-w-sm mx-auto">
                  UNLOCK THE LAB AI ADVISOR, PREMIUM RECIPES, AND ADVANCED MUSCULAR HYDRAULICS REPORTING BY JOINING BIT-IRON ELITE COACHING.
                </p>
                
                <div class="border-4 border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black max-w-md mx-auto text-left">
                  <label class="text-[9px] font-black uppercase tracking-[0.2em] text-[#e62429] block">SELECT AN ELITE COACHING DISCIPLINE (€49.99/MO)</label>
                  <select id="select-new-plan" class="w-full bg-gray-50 dark:bg-zinc-900 border-4 border-black dark:border-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none text-black dark:text-white">
                    <option value="HYPERTROPHY & BULK">HYPERTROPHY & BULK (FOCUS: MUSCLE MASS & STRENGTH)</option>
                    <option value="CARDIO ENDURANCE & HEALTH">CARDIO ENDURANCE & HEALTH (FOCUS: VO2 MAX & ENDURANCE)</option>
                    <option value="HYBRID ATHLETE TRAINING">HYBRID ATHLETE TRAINING (FOCUS: HYBRID ATHLETE CONDITIONING)</option>
                  </select>
                  <button id="btn-activate-plan" class="w-full bg-[#e62429] text-white py-3 text-xs font-black uppercase tracking-[0.2em] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                    ACTIVATE MEMBERSHIP
                  </button>
                </div>
              </div>
            `}
          </div>
        </div>
      `;

      // Set up close button
      overlay.querySelector('#btn-close-settings').addEventListener('click', () => {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.remove(), 300);
      });

      // Tabs switcher listeners
      const tabProfileBtn = overlay.querySelector('#tab-profile-btn');
      const tabSecurityBtn = overlay.querySelector('#tab-security-btn');
      const tabMembershipBtn = overlay.querySelector('#tab-membership-btn');

      const tabContentProfile = overlay.querySelector('#tab-content-profile');
      const tabContentSecurity = overlay.querySelector('#tab-content-security');
      const tabContentMembership = overlay.querySelector('#tab-content-membership');

      const selectTab = (selected) => {
        [tabProfileBtn, tabSecurityBtn, tabMembershipBtn].forEach(btn => {
          btn.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
          btn.classList.add('bg-white', 'text-black', 'dark:bg-black', 'dark:text-white');
        });
        [tabContentProfile, tabContentSecurity, tabContentMembership].forEach(c => c.classList.add('hidden'));

        if (selected === 'profile') {
          tabProfileBtn.classList.remove('bg-white', 'text-black', 'dark:bg-black', 'dark:text-white');
          tabProfileBtn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
          tabContentProfile.classList.remove('hidden');
        } else if (selected === 'security') {
          tabSecurityBtn.classList.remove('bg-white', 'text-black', 'dark:bg-black', 'dark:text-white');
          tabSecurityBtn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
          tabContentSecurity.classList.remove('hidden');
        } else if (selected === 'membership') {
          tabMembershipBtn.classList.remove('bg-white', 'text-black', 'dark:bg-black', 'dark:text-white');
          tabMembershipBtn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
          tabContentMembership.classList.remove('hidden');
        }
      };

      tabProfileBtn.addEventListener('click', () => selectTab('profile'));
      tabSecurityBtn.addEventListener('click', () => selectTab('security'));
      tabMembershipBtn.addEventListener('click', () => selectTab('membership'));
      
      // Auto-focus on active tab
      selectTab(activeTab);

      // ── Form Profile Submit ────────────────────────────────────────────────
      const form = overlay.querySelector('#settings-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = form.querySelector('button[type="submit"]');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="animate-pulse">SAVING CHANGELOG...</span>';
        
        try {
          const newName = document.getElementById('settings-name').value.trim();
          await updatePerfil(newName, objetivo);
          
          const newPhone = document.getElementById('settings-phone').value.trim();
          const newAddress = document.getElementById('settings-address').value.trim();
          const newCity = document.getElementById('settings-city').value.trim();
          const newZip = document.getElementById('settings-zip').value.trim();
          const newPayment = document.getElementById('settings-payment').value;
          const newSize = document.getElementById('settings-size').value;
          
          localStorage.setItem('bitiron_athlete_profile', JSON.stringify({
            phone: newPhone,
            address: newAddress,
            city: newCity,
            zip: newZip,
            payment: newPayment,
            apparelSize: newSize
          }));
          
          saveBtn.classList.remove('bg-[#e62429]');
          saveBtn.classList.add('bg-green-600');
          saveBtn.innerHTML = 'PROFILE SYNCED!';
          
          const nameLabels = document.querySelectorAll('.athlete-name-label');
          nameLabels.forEach(lbl => lbl.textContent = newName.toUpperCase());
          
          setTimeout(() => loadAndRender('profile'), 1000);
        } catch (err) {
          console.error(err);
          saveBtn.disabled = false;
          saveBtn.innerHTML = 'ERROR SAVING. TRY AGAIN.';
        }
      });

      // ── Form Security Submit ───────────────────────────────────────────────
      const secForm = overlay.querySelector('#security-form');
      const secFeedback = overlay.querySelector('#security-feedback');
      secForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentVal = document.getElementById('security-current').value;
        const newVal = document.getElementById('security-new').value;
        const confirmVal = document.getElementById('security-confirm').value;

        secFeedback.classList.add('hidden');

        if (newVal.length < 6) {
          secFeedback.textContent = "NEW PASSWORD MUST BE AT LEAST 6 CHARACTERS!";
          secFeedback.classList.remove('hidden');
          return;
        }

        if (newVal !== confirmVal) {
          secFeedback.textContent = "NEW PASSWORDS DO NOT MATCH!";
          secFeedback.classList.remove('hidden');
          return;
        }

        const saveBtn = secForm.querySelector('button[type="submit"]');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="animate-pulse">ROTATING SECURITY KEY...</span>';

        setTimeout(() => {
          saveBtn.classList.remove('bg-black', 'dark:bg-white');
          saveBtn.classList.add('bg-green-600', 'text-white');
          saveBtn.innerHTML = 'KEY ROTATION SUCCESS!';
          
          setTimeout(() => loadAndRender('security'), 1000);
        }, 1000);
      });

      // ── Membership Handlers ────────────────────────────────────────────────
      if (activeAsesoria) {
        const btnChange = overlay.querySelector('#btn-change-plan');
        const changePanel = overlay.querySelector('#change-plan-panel');
        const btnSubmitChange = overlay.querySelector('#btn-submit-change-plan');

        btnChange.addEventListener('click', () => {
          changePanel.classList.toggle('hidden');
        });

        btnSubmitChange.addEventListener('click', async () => {
          const selectedPlan = overlay.querySelector('#select-change-plan').value;
          btnSubmitChange.disabled = true;
          btnSubmitChange.innerHTML = '<span class="animate-pulse">SWITCHING PLAN...</span>';
          
          localStorage.removeItem('bitiron_active_coaching_cancelled');
          try {
            await updateAsesoria(getAsesoriaId(activeAsesoria), {
              TipoPlan: selectedPlan,
              PrecioMensual: 49.99,
              PagadoAlDia: true
            });
          } catch (err) {
            console.error(err);
          }
          loadAndRender('membership');
        });
      } else {
        const btnActivate = overlay.querySelector('#btn-activate-plan');
        btnActivate.addEventListener('click', async () => {
          const selectedPlan = overlay.querySelector('#select-new-plan').value;
          btnActivate.disabled = true;
          btnActivate.innerHTML = '<span class="animate-pulse">ACTIVATING...</span>';
          
          localStorage.removeItem('bitiron_active_coaching_cancelled');
          try {
            await createAsesoria({
              IdCliente: idCliente,
              TipoPlan: selectedPlan,
              PrecioMensual: 49.99,
              PagadoAlDia: true,
              FechaInicio: new Date().toISOString().slice(0, 10)
            });
          } catch (err) {
            console.error(err);
          }
          loadAndRender('membership');
        });
      }

    } catch (err) {
      console.warn('Hydration failed, rendering visual fallback dashboard:', err);
      
      const isVisualInactive = localStorage.getItem('bitiron_active_coaching_cancelled') === 'true';
      const mockPlan = {
        TipoPlan: 'CARDIO ENDURANCE & HEALTH',
        FechaInicio: new Date().toISOString(),
        PrecioMensual: 49.99,
        PagadoAlDia: true
      };

      overlay.innerHTML = `
        <div class="bg-white dark:bg-black text-black dark:text-white w-full max-w-xl border-[6px] border-black dark:border-white shadow-[12px_12px_0px_0px_#e62429] p-8 relative transition-colors duration-300 max-h-[90vh] overflow-y-auto">
          <button id="btn-close-settings" class="absolute top-4 right-4 text-black dark:text-white hover:text-[#e62429] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <h2 class="text-3xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white pb-3 mb-4">ATHLETE DASHBOARD</h2>
          
          <!-- Tabs Selector -->
          <div class="flex border-4 border-black dark:border-white mb-6 uppercase text-xs font-black tracking-wider">
            <button id="tab-profile-btn" class="flex-1 px-3 py-2 border-r-4 border-black dark:border-white bg-white text-black dark:bg-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              PROFILE
            </button>
            <button id="tab-security-btn" class="flex-1 px-3 py-2 border-r-4 border-black dark:border-white bg-white text-black dark:bg-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              SECURITY
            </button>
            <button id="tab-membership-btn" class="flex-1 px-3 py-2 bg-black text-white dark:bg-white dark:text-black transition-colors">
              MEMBERSHIP
            </button>
          </div>

          <!-- Tab 3: Membership -->
          <div id="tab-content-membership" class="space-y-4">
            <div class="border-4 border-black dark:border-white p-4 bg-zinc-50 dark:bg-zinc-900/40 relative">
              <div class="space-y-3">
                <div>
                  <span class="text-[9px] font-black text-[#e62429] tracking-[0.2em] block">MEMBERSHIP CLASS</span>
                  <h3 class="text-xl font-black italic tracking-tighter text-black dark:text-white uppercase">${mockPlan.TipoPlan}</h3>
                </div>
                <div class="h-[2px] bg-black/10 dark:bg-white/10"></div>
                <div class="grid grid-cols-2 gap-4 text-xs font-bold uppercase text-black dark:text-white">
                  <div>
                    <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">JOIN DATE</span>
                    <span>${new Date(mockPlan.FechaInicio).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                  </div>
                  <div>
                    <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">BILLING PERIOD</span>
                    <span>MONTHLY (€${mockPlan.PrecioMensual})</span>
                  </div>
                  <div>
                    <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">STATUS BILLING</span>
                    <span id="status-billing-text" class="${isVisualInactive ? 'text-zinc-500' : 'text-green-600'}">
                      ${isVisualInactive ? 'CANCELLED / INACTIVE' : 'PAID / UP TO DATE'}
                    </span>
                  </div>
                  <div>
                    <span class="text-[8px] text-gray-400 dark:text-zinc-500 block">AI COACH TIER</span>
                    <span id="ai-coach-tier-text" class="${isVisualInactive ? 'text-zinc-500' : 'text-[#e62429]'}">
                      ${isVisualInactive ? 'LOCKED (INACTIVE)' : 'UNLOCKED (PRO)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fully Functional Action Buttons -->
            <div class="w-full">
              <button id="btn-change-plan" class="w-full bg-black text-white dark:bg-white dark:text-black py-2.5 text-xs font-black uppercase tracking-wider border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                CHANGE PLAN
              </button>
            </div>
          </div>
        </div>
      `;

      // Fallback Listeners
      overlay.querySelector('#btn-close-settings').addEventListener('click', () => {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.remove(), 300);
      });

      const tabProfileBtn = overlay.querySelector('#tab-profile-btn');
      const tabSecurityBtn = overlay.querySelector('#tab-security-btn');
      const tabMembershipBtn = overlay.querySelector('#tab-membership-btn');

      if (tabProfileBtn) tabProfileBtn.addEventListener('click', () => loadAndRender('profile'));
      if (tabSecurityBtn) tabSecurityBtn.addEventListener('click', () => loadAndRender('security'));
      if (tabMembershipBtn) tabMembershipBtn.addEventListener('click', () => loadAndRender('membership'));
    }
  };

  // Kick off initial hydration
  loadAndRender('profile');
};

// Escuchar cambios de tema y clics en el Navbar (Delegación global)
document.addEventListener('click', (e) => {
  const toggleDesktop = e.target.closest('#navbar-theme-toggle');
  const toggleMobile = e.target.closest('#navbar-theme-toggle-mobile');
  
  if (toggleDesktop || toggleMobile) {
    e.preventDefault();
    const isDarkNow = toggleTheme();
    
    // Sincronizar textos
    const txtDesktop = document.getElementById('theme-status-text');
    const txtMobile = document.getElementById('theme-status-text-mobile');
    
    if (txtDesktop) txtDesktop.textContent = isDarkNow ? 'ON' : 'OFF';
    if (txtMobile) txtMobile.textContent = isDarkNow ? 'ON' : 'OFF';
    return;
  }

  // 1. Orders Modal trigger
  const ordersTrigger = e.target.closest('#navbar-orders-trigger') || e.target.closest('#navbar-orders-trigger-mobile');
  if (ordersTrigger) {
    e.preventDefault();
    showOrdersModal();
    return;
  }

  // 2. Settings Modal trigger
  const settingsTrigger = e.target.closest('#navbar-settings-trigger');
  if (settingsTrigger) {
    e.preventDefault();
    showSettingsModal();
    return;
  }
});

export const Navbar = () => {
  const token = localStorage.getItem('bitiron_token');
  const isLoggedIn = !!token;
  const themeText = isDarkMode() ? 'ON' : 'OFF';

  const decoded = isLoggedIn ? decodeToken(token) : null;
  const initialName = decoded && decoded.email ? decoded.email.split('@')[0].toUpperCase() : 'ATHLETE';

  // Asynchronously fetch actual display name to avoid hardcoded mock names
  if (isLoggedIn) {
    getPerfil().then(profile => {
      const nameLabels = document.querySelectorAll('.athlete-name-label');
      const nameStr = (profile.NombreCompleto || profile.nombre || initialName).toUpperCase();
      nameLabels.forEach(lbl => lbl.textContent = nameStr);
    }).catch(err => console.log('Navbar profile pre-fetch failed:', err));
  }

  // Render logic for Mobile Menu Authentication & Profile
  const authMobile = isLoggedIn
    ? `
      <div class="px-2 py-3 border-b border-black/5 dark:border-white/5 mb-3 text-black dark:text-white">
        <span class="text-[9px] font-black text-[#e62429] tracking-[0.2em] block mb-1">STATUS: ELITE</span>
        <span class="text-sm font-black italic tracking-tight block athlete-name-label">${initialName}</span>
      </div>
      <li class="mb-2"><a href="/dashboard.html" class="text-md hover:text-red-600 transition-colors">Dashboard (AI Plans)</a></li>
      <li class="mb-2"><a href="#" id="navbar-orders-trigger-mobile" class="text-md hover:text-red-600 transition-colors">My Arsenal</a></li>
      <li class="mb-2"><a href="#" id="navbar-theme-toggle-mobile" class="text-md hover:text-red-600 transition-colors flex justify-between items-center"><span>Dark Mode</span><span id="theme-status-text-mobile" class="text-red-600 text-xs">${themeText}</span></a></li>
      <li class="mt-4 border-t border-black/5 dark:border-white/5 pt-4">
        <a href="#" onclick="localStorage.removeItem('bitiron_token'); window.location.href='/'; return false;" class="text-sm font-bold text-red-600 uppercase">Logout</a>
      </li>
    `
    : `<a href="/login.html" class="text-sm font-bold opacity-50 uppercase text-black dark:text-white">Login / Access</a>`;

  // Render logic for Desktop Authentication / Dropdown Profile
  const authDesktop = isLoggedIn
    ? `
      <div class="dropdown dropdown-end">
        <label tabindex="0" role="button" class="btn btn-ghost btn-square text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </label>
        <ul tabindex="0" class="dropdown-content z-[110] menu p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] bg-white dark:bg-black border-4 border-black dark:border-white w-64 mt-4 uppercase font-black tracking-tighter text-xs text-black dark:text-white rounded-none">
          <div class="px-2 py-3 border-b-4 border-black dark:border-white mb-3">
            <span class="text-[9px] font-black text-[#e62429] tracking-[0.2em] block mb-1">STATUS: ELITE</span>
            <span class="text-sm font-black italic tracking-tight block athlete-name-label">${initialName}</span>
          </div>
          <li>
            <a href="#" id="navbar-orders-trigger" class="py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none">
              MY ARSENAL (ORDERS)
            </a>
          </li>
          <li>
            <a href="/dashboard.html" class="py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none">
              DASHBOARD (AI PLANS)
            </a>
          </li>
          <li>
            <a href="#" id="navbar-settings-trigger" class="py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none">
              SETTINGS
            </a>
          </li>
          <li>
            <a href="#" id="navbar-theme-toggle" class="py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none flex justify-between items-center">
              <span>DARK MODE</span>
              <span id="theme-status-text" class="text-[#e62429] font-bold">${themeText}</span>
            </a>
          </li>
          <div class="h-[2px] bg-black dark:bg-white my-2"></div>
          <li>
            <a href="#" onclick="localStorage.removeItem('bitiron_token'); window.location.href='/'; return false;" class="py-2 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-none">
              DISCONNECT
            </a>
          </li>
        </ul>
      </div>
      `
    : `
      <a href="/login.html" title="Access Elite" class="btn btn-ghost btn-square text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </a>
      `;

  return `
    <nav class="navbar fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-6 lg:px-16 transition-all duration-300">
      <div class="navbar-start">
        <!-- Hamburger Menu (Mobile) -->
        <div class="dropdown lg:hidden">
          <label tabindex="0" class="btn btn-ghost btn-square text-black dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-6 shadow-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 w-72 uppercase font-black italic tracking-tighter text-black dark:text-white">
            <li class="mb-2"><a href="/#catalog" class="text-lg hover:text-red-600 transition-colors">Catalog</a></li>
            <li class="mb-2"><a href="/#philosophy" class="text-lg hover:text-red-600 transition-colors">Philosophy</a></li>
            <li class="mb-2"><a href="/advisor.html" class="text-lg hover:text-red-600 transition-colors">The Lab</a></li>
            <li class="mt-4 border-t border-black/5 dark:border-white/5 pt-4">
               ${authMobile}
            </li>
          </ul>
        </div>
        
        <!-- BIT-IRON Branding -->
        <a href="/" class="group flex items-center gap-1 btn btn-ghost px-0 hover:bg-transparent transition-transform active:scale-95">
          <span class="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-black dark:text-white">BIT</span>
          <span class="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-red-600 group-hover:italic transition-all">IRON</span>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
          <li>
            <a href="/#catalog" class="hover:text-black dark:hover:text-white hover:bg-transparent relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300">Catalog</a>
          </li>
          <li>
            <a href="/#philosophy" class="hover:text-black dark:hover:text-white hover:bg-transparent relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300">Philosophy</a>
          </li>
          <li>
            <a href="/advisor.html" class="hover:text-black dark:hover:text-white hover:bg-transparent relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300">The Lab</a>
          </li>
        </ul>
      </div>

      <!-- Actions (Right) -->
      <div class="navbar-end gap-2 flex items-center">
        <!-- Cart Icon -->
        <a href="/checkout.html" title="Arsenal Cart" class="btn btn-ghost btn-square text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span id="cart-badge" class="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black flex items-center justify-center rounded-full opacity-0 transition-opacity">0</span>
        </a>
        
        ${authDesktop}
      </div>
    </nav>
  `;
};