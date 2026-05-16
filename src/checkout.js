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
      <div class="flex flex-col sm:flex-row gap-6 border-b border-black/10 pb-6 group" data-id="${idCarrito}">
        <!-- Image -->
        <div class="w-full sm:w-32 h-32 bg-gray-100 flex-shrink-0 border border-black/5 flex items-center justify-center p-2">
           <!-- Placeholder brutalista si no hay imagen real -->
           <span class="text-6xl font-black text-black/10 group-hover:text-red-600 transition-colors">${nombre.charAt(0)}</span>
        </div>
        
        <!-- Details -->
        <div class="flex flex-col flex-grow justify-between">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-black uppercase tracking-tight">${nombre}</h3>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mt-1">${precio.toFixed(2)} €</p>
            </div>
            <button class="btn-remove text-black/20 hover:text-[#e62429] transition-colors" data-id="${idCarrito}" title="Remove Item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
          
          <div class="flex justify-between items-center mt-4">
            <!-- Quantity Control -->
            <div class="flex items-center border-2 border-black">
              <button class="btn-minus px-3 py-1 hover:bg-black hover:text-white transition-colors" data-id="${idCarrito}" data-qty="${cantidad}">-</button>
              <span class="w-10 text-center font-bold text-sm">${cantidad}</span>
              <button class="btn-plus px-3 py-1 hover:bg-black hover:text-white transition-colors" data-id="${idCarrito}" data-qty="${cantidad}">+</button>
            </div>
            <!-- Item Total -->
            <div class="text-lg font-black tracking-tight text-red-600">
              ${itemTotal.toFixed(2)} €
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
