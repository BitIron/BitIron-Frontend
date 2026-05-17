import './styles/global.css';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { getCartData, updateItemQuantity, removeItemFromCart, initCart } from './lib/cart.js';
import { getToken } from './lib/api.js';

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

  // 4. Configurar botón final de pago
  document.getElementById('btn-checkout').addEventListener('click', () => {
    const items = getCartData();
    if (items.length === 0) {
      alert("YOUR ARSENAL IS EMPTY.");
      return;
    }
    // Placeholder para la pasarela de pago / creación de pedido
    alert("PAYMENT GATEWAY COMING SOON... \nProceeding to dummy payment.");
    // Aquí iría la redirección a Stripe o la llamada a POST /api/pedidos
  });
};

const renderCart = () => {
  const container = document.getElementById('cart-items-container');
  const items = getCartData();
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="border-4 border-black p-12 text-center">
        <h2 class="text-3xl font-black uppercase tracking-tighter mb-4 text-black/20">NO WEAPONS IN YOUR ARSENAL</h2>
        <a href="/#catalog" class="inline-block bg-black text-white px-8 py-3 text-sm font-black uppercase tracking-[0.2em] hover:bg-[#e62429] transition-colors">GO TO CATALOG</a>
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
    const imagenUrl = item.Imagen_Url || item.imagen_url || 'https://via.placeholder.com/150';
    
    const itemTotal = precio * cantidad;
    subtotal += itemTotal;

    html += `
      <div class="flex flex-col sm:flex-row gap-6 lg:gap-10 border-b border-black/10 pb-8 group" data-id="${idCarrito}">
        <!-- Image Placeholder -->
        <div class="w-full sm:w-40 h-40 bg-gray-50 flex-shrink-0 flex items-center justify-center border border-black/5 relative overflow-hidden">
           <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           <span class="text-7xl font-black text-black/10 group-hover:text-[#e62429] transition-colors duration-500 font-display relative z-10">${nombre.charAt(0)}</span>
        </div>
        
        <!-- Details -->
        <div class="flex flex-col flex-grow justify-between py-2">
          <div class="flex justify-between items-start gap-4">
            <div>
              <h3 class="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none group-hover:text-[#e62429] transition-colors">${nombre}</h3>
              <p class="text-[12px] font-bold uppercase tracking-[0.2em] text-black/40 mt-3">${precio.toFixed(2)} €</p>
            </div>
            <button class="btn-remove text-black/20 hover:text-[#e62429] hover:bg-red-50 p-3 rounded-full transition-all" data-id="${idCarrito}" title="Remove Item">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-6 lg:mt-0 gap-4">
            <!-- Quantity Control -->
            <div class="flex flex-col gap-2">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">QUANTITY</span>
              <div class="flex items-center border border-black w-fit">
                <button class="btn-minus px-4 py-2 hover:bg-black hover:text-white transition-colors" data-id="${idCarrito}" data-qty="${cantidad}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <span class="w-12 text-center font-black text-lg">${cantidad}</span>
                <button class="btn-plus px-4 py-2 hover:bg-black hover:text-white transition-colors" data-id="${idCarrito}" data-qty="${cantidad}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>
            
            <!-- Item Total -->
            <div class="text-right">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 block mb-1">TOTAL</span>
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
  document.getElementById('summary-subtotal').textContent = `${subtotal.toFixed(2)} €`;
  document.getElementById('summary-total').textContent = `${subtotal.toFixed(2)} €`;
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
