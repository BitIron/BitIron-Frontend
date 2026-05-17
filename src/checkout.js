import './styles/global.css';
import { initTheme } from './lib/theme.js';

// Inicializar tema inmediatamente
initTheme();

import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { getCartData, updateItemQuantity, removeItemFromCart, initCart } from './lib/cart.js';
import { getToken } from './lib/api.js';

let appliedDiscount = 0; // 0.20 para 20% de descuento

// Prevenir FOUC
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("fouc-prevent");
});

const initCheckout = async () => {
  // 1. Verificar autenticación
  if (!getToken()) {
    window.location.href = '/login.html';
    return;
  }

  // 2. Renderizar componentes comunes
  document.getElementById('navbar-container').innerHTML = Navbar();
  document.getElementById('footer-container').innerHTML = Footer();

  // 3. Inicializar carrito y renderizar
  await initCart();
  renderCart();

  // 4.5 Configurar código promocional
  const promoInput = document.getElementById('promo-input');
  const promoBtn = document.getElementById('btn-promo');
  
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'ATHLETE20') {
        if (appliedDiscount > 0) {
          alert('PROMO CODE ALREADY APPLIED.');
          return;
        }
        appliedDiscount = 0.20;
        
        // Recalcular el summary
        const items = getCartData();
        let subtotal = 0;
        items.forEach(item => {
          const precio = parseFloat(item.Precio || item.precio || 0);
          const cantidad = parseInt(item.Cantidad || item.cantidad || 1);
          subtotal += precio * cantidad;
        });
        updateSummary(subtotal);
        
        // Desactivar el input/btn
        promoInput.disabled = true;
        promoBtn.disabled = true;
        promoBtn.textContent = 'APPLIED';
        promoBtn.classList.remove('bg-[#e62429]');
        promoBtn.classList.add('bg-green-600');
        
        alert('PROMO CODE APPLIED! 20% DISCOUNT GRANTED.');
      } else {
        alert('INVALID PROMO CODE.');
      }
    });
  }

  // 4. Configurar botón final de pago
  document.getElementById('btn-checkout').addEventListener('click', async () => {
    const items = getCartData();
    if (items.length === 0) {
      alert("YOUR ARSENAL IS EMPTY.");
      return;
    }
    
    // UI Feedback: Simular procesamiento
    const btn = document.getElementById('btn-checkout');
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-pulse">PROCESSING SECURE PAYMENT...</span>';
    
    // Esperar 2.5 segundos para dar sensación de procesamiento real
    setTimeout(async () => {
      // Limpiar el carrito (borrar item por item para sincronizar DB)
      for (const item of items) {
        const idCarrito = item.IdCarrito || item.idCarrito;
        await removeItemFromCart(idCarrito);
      }
      
      // UI Feedback: Éxito
      btn.classList.remove('bg-[#e62429]');
      btn.classList.add('bg-green-600');
      btn.innerHTML = 'ORDER CONFIRMED! WELCOME TO THE ELITE.';
      
      // Redirigir al inicio después de 3 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    }, 2500);
  });
};

const renderCart = () => {
  const container = document.getElementById('cart-items-container');
  const items = getCartData();
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="border-4 border-black dark:border-white p-12 text-center text-black dark:text-white transition-colors duration-300">
        <h2 class="text-3xl font-black uppercase tracking-tighter mb-4 text-black/20 dark:text-white/20">NO WEAPONS IN YOUR ARSENAL</h2>
        <a href="/#catalog" class="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-sm font-black uppercase tracking-[0.2em] hover:bg-[#e62429] dark:hover:bg-[#e62429] dark:hover:text-white transition-all">GO TO CATALOG</a>
      </div>
    `;
    updateSummary(0);
    return;
  }

  let html = '';
  let subtotal = 0;

  items.forEach(item => {
    // Manejar variaciones de capitalización entre API y DB
    const idCarrito = item.IdCarrito || item.idCarrito;
    const nombre = item.Nombre || item.nombre;
    const precio = parseFloat(item.Precio || item.precio || 0);
    const cantidad = parseInt(item.Cantidad || item.cantidad || 1);
    
    const itemTotal = precio * cantidad;
    subtotal += itemTotal;

    html += `
      <div class="flex flex-col sm:flex-row gap-6 lg:gap-10 border-b border-black/10 dark:border-white/10 pb-8 group text-black dark:text-white" data-id="${idCarrito}">
        <!-- Image Placeholder -->
        <div class="w-full sm:w-40 h-40 bg-gray-50 dark:bg-zinc-900 flex-shrink-0 flex items-center justify-center border border-black/5 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
           <div class="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           <span class="text-7xl font-black text-black/10 dark:text-white/10 group-hover:text-[#e62429] transition-colors duration-500 font-display relative z-10">${nombre.charAt(0)}</span>
        </div>
        
        <!-- Details -->
        <div class="flex flex-col flex-grow justify-between py-2">
          <div class="flex justify-between items-start gap-4">
            <div>
              <h3 class="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none group-hover:text-[#e62429] transition-colors">${nombre}</h3>
              <p class="text-[12px] font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mt-3">${precio.toFixed(2)} €</p>
            </div>
            <button class="btn-remove text-black/20 dark:text-white/20 hover:text-[#e62429] hover:bg-red-50 dark:hover:bg-red-950/20 p-3 rounded-full transition-all" data-id="${idCarrito}" title="Remove Item">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-6 lg:mt-0 gap-4">
            <!-- Quantity Control -->
            <div class="flex flex-col gap-2">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">QUANTITY</span>
              <div class="flex items-center border border-black dark:border-white w-fit">
                <button class="btn-minus px-4 py-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-black dark:text-white transition-colors" data-id="${idCarrito}" data-qty="${cantidad}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <span class="w-12 text-center font-black text-lg">${cantidad}</span>
                <button class="btn-plus px-4 py-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-black dark:text-white transition-colors" data-id="${idCarrito}" data-qty="${cantidad}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>
            
            <!-- Item Total -->
            <div class="text-right">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30 block mb-1">TOTAL</span>
              <div class="text-2xl font-black tracking-tighter">
                ${itemTotal.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateSummary(subtotal);
  setupItemEvents();
};

const updateSummary = (subtotal) => {
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  document.getElementById('summary-subtotal').textContent = `${subtotal.toFixed(2)} €`;
  
  // Mostrar fila de descuento si está aplicado
  const discountRow = document.getElementById('summary-discount-row');
  if (appliedDiscount > 0) {
    if (!discountRow) {
      // Inyectar fila de descuento dinámicamente antes del total
      const totalRow = document.getElementById('summary-total').parentElement;
      const row = document.createElement('div');
      row.id = 'summary-discount-row';
      row.className = 'flex justify-between items-center text-red-600 font-black';
      row.innerHTML = `
        <span>PROMO DISCOUNT (20%)</span>
        <span>-${discountAmount.toFixed(2)} €</span>
      `;
      totalRow.parentNode.insertBefore(row, totalRow);
    } else {
      discountRow.innerHTML = `
        <span>PROMO DISCOUNT (20%)</span>
        <span>-${discountAmount.toFixed(2)} €</span>
      `;
      discountRow.classList.remove('hidden');
    }
  } else if (discountRow) {
    discountRow.classList.add('hidden');
  }

  document.getElementById('summary-total').textContent = `${total.toFixed(2)} €`;
};

const setupItemEvents = () => {
  const container = document.getElementById('cart-items-container');
  
  // Event Delegation para los botones
  container.addEventListener('click', async (e) => {
    // 1. Eliminar
    const removeBtn = e.target.closest('.btn-remove');
    if (removeBtn) {
      const id = removeBtn.dataset.id;
      removeBtn.innerHTML = '<span class="animate-pulse">...</span>'; // feedback visual
      await removeItemFromCart(id);
      renderCart();
      return;
    }

    // 2. Bajar cantidad (-)
    const minusBtn = e.target.closest('.btn-minus');
    if (minusBtn) {
      const id = minusBtn.dataset.id;
      const currentQty = parseInt(minusBtn.dataset.qty);
      if (currentQty > 1) {
        minusBtn.disabled = true;
        await updateItemQuantity(id, currentQty - 1);
        renderCart();
      }
      return;
    }

    // 3. Subir cantidad (+)
    const plusBtn = e.target.closest('.btn-plus');
    if (plusBtn) {
      const id = plusBtn.dataset.id;
      const currentQty = parseInt(plusBtn.dataset.qty);
      plusBtn.disabled = true;
      await updateItemQuantity(id, currentQty + 1);
      renderCart();
      return;
    }
  });
};

initCheckout();
