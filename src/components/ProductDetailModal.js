// src/components/ProductDetailModal.js
// Modal de detalles del producto con diseño brutalista premium.

import { addItemToCart } from '../lib/cart.js';

/**
 * Abre el modal de detalles del producto.
 * @param {Object} product - El producto seleccionado.
 * @param {Array} allProducts - Lista completa de productos para la sección de cross-selling.
 */
export const openProductDetailModal = (product, allProducts = []) => {
  // Normalizar propiedades del producto
  const id          = product.id          || product.ID          || product.IdProducto;
  const nombre      = product.nombre      || product.Nombre;
  const precio      = product.precio      || product.Precio;
  const categoria   = product.categoria   || product.Categoria || '';
  const imagen_url  = product.imagen_url  || product.Imagen_URL || product.Imagen_Url;
  const descripcion = product.descripcion || product.Descripcion || 'No description available for this elite item.';
  const marca       = product.marca       || product.Marca || 'BITIRON';
  const objetivo    = product.objetivorecomendado || product.ObjetivoRecomendado || 'Performance';
  const stock       = product.stock       || product.Stock || 10;

  const formattedPrice = parseFloat(precio || 0).toFixed(2);
  const imgSrc = imagen_url || `https://placehold.co/500x500/111111/e62429?text=${encodeURIComponent(nombre?.charAt(0) || 'B')}`;

  // 1. Eliminar cualquier modal abierto previamente
  const oldModal = document.getElementById('product-detail-modal-root');
  if (oldModal) {
    oldModal.remove();
  }

  // 2. Crear el contenedor principal del modal
  const modalRoot = document.createElement('div');
  modalRoot.id = 'product-detail-modal-root';
  modalRoot.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 transition-all duration-300 animate-fadeIn';
  
  // 3. Generar contenido detallado y dinámico basado en la categoría
  const isSupplement = ['protein', 'creatine', 'pre-workout', 'recovery', 'suplementación'].includes(categoria.toLowerCase());
  const isApparel = ['apparel', 'ropa'].includes(categoria.toLowerCase());
  const isEquipment = ['equipment', 'equipamiento'].includes(categoria.toLowerCase());

  let specsHTML = '';
  let usageHTML = '';

  if (isSupplement) {
    specsHTML = `
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b-2 border-black dark:border-white font-black uppercase text-black/40 dark:text-white/40">
            <th class="py-1">NUTRITIONAL INFO</th>
            <th class="py-1 text-right">PER SERVING (100g)</th>
          </tr>
        </thead>
        <tbody class="font-bold">
          <tr class="border-b border-black/10 dark:border-white/10"><td class="py-1">ENERGY</td><td class="py-1 text-right">370 kcal</td></tr>
          <tr class="border-b border-black/10 dark:border-white/10"><td class="py-1">PROTEIN</td><td class="py-1 text-right">${categoria.toLowerCase().includes('protein') ? '80 g' : '15 g'}</td></tr>
          <tr class="border-b border-black/10 dark:border-white/10"><td class="py-1">FAT</td><td class="py-1 text-right">2.1 g</td></tr>
          <tr class="border-b border-black/10 dark:border-white/10"><td class="py-1">CARBOHYDRATES</td><td class="py-1 text-right">4.5 g</td></tr>
          <tr class="border-b border-black/10 dark:border-white/10"><td class="py-1">SALT</td><td class="py-1 text-right">0.3 g</td></tr>
        </tbody>
      </table>
    `;
    usageHTML = `
      <p class="text-xs font-bold leading-relaxed">
        <span class="text-[#e62429]">RECOMMENDED DOSAGE:</span> Mix 1 scoop (approx. 30g) with 250-300ml of ice-cold water or skimmed milk. Consume 1-2 times daily, ideally immediately post-workout or in the morning.
      </p>
    `;
  } else if (isApparel) {
    specsHTML = `
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <span class="text-xs font-black uppercase text-black/40 dark:text-white/40">MATERIAL:</span>
          <span class="text-xs font-bold">100% Premium Organic Cotton (Pump Cover) / Ultra-Flex Tech-Poly</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="text-xs font-black uppercase text-black/40 dark:text-white/40">FIT:</span>
          <span class="text-xs font-bold uppercase">${product.genero || 'Unisex'} - Athletic / Oversized fit</span>
        </div>
        <div class="flex gap-1 mt-2">
          <span class="text-[10px] font-black border-2 border-black dark:border-white px-2 py-1 bg-black text-white dark:bg-white dark:text-black">S</span>
          <span class="text-[10px] font-black border-2 border-black dark:border-white px-2 py-1">M</span>
          <span class="text-[10px] font-black border-2 border-black dark:border-white px-2 py-1">L</span>
          <span class="text-[10px] font-black border-2 border-black dark:border-white px-2 py-1">XL</span>
        </div>
      </div>
    `;
    usageHTML = `
      <p class="text-xs font-bold leading-relaxed">
        <span class="text-[#e62429]">CARE INSTRUCTIONS:</span> Machine wash cold (30°C) inside out. Do not tumble dry. Do not iron directly on high-density prints or embroidery. Wear with pride.
      </p>
    `;
  } else {
    // Equipamiento u otros
    specsHTML = `
      <div class="flex flex-col gap-1 text-xs font-bold">
        <div class="flex justify-between border-b border-black/10 dark:border-white/10 py-1">
          <span class="text-black/40 dark:text-white/40 uppercase">IPF APPROVED:</span>
          <span>YES</span>
        </div>
        <div class="flex justify-between border-b border-black/10 dark:border-white/10 py-1">
          <span class="text-black/40 dark:text-white/40 uppercase">MATERIAL:</span>
          <span>Genuine Leather & Reinforced Steel buckle</span>
        </div>
        <div class="flex justify-between border-b border-black/10 dark:border-white/10 py-1">
          <span class="text-black/40 dark:text-white/40 uppercase">WARRANTY:</span>
          <span>Lifetime Iron Guarantee</span>
        </div>
      </div>
    `;
    usageHTML = `
      <p class="text-xs font-bold leading-relaxed">
        <span class="text-[#e62429]">USAGE GUIDE:</span> Designed for heavy lifting. Adjust to the desired tightness before set and release immediately after. Maintain leather surface clean and dry.
      </p>
    `;
  }

  // 4. Cross-selling: Seleccionar 2 productos alternativos del catálogo
  const crossProducts = allProducts
    .filter(p => (p.id || p.ID || p.IdProducto) !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  let crossHTML = '';
  if (crossProducts.length > 0) {
    crossHTML = `
      <div class="border-t border-black/10 dark:border-white/10 pt-4 mt-6">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#e62429] mb-3">FREQUENTLY BOUGHT WITH</h4>
        <div class="grid grid-cols-2 gap-3">
          ${crossProducts.map(cp => {
            const cpId = cp.id || cp.ID || cp.IdProducto;
            const cpNombre = cp.nombre || cp.Nombre;
            const cpPrecio = parseFloat(cp.precio || cp.Precio).toFixed(2);
            const cpImg = cp.imagen_url || cp.Imagen_URL || cp.Imagen_Url || `https://placehold.co/100x100/111111/e62429?text=${encodeURIComponent(cpNombre?.charAt(0) || 'B')}`;
            return `
              <div class="flex items-center gap-3 border border-black/10 dark:border-white/10 p-2 bg-[#f9f9f9] dark:bg-zinc-800 transition-colors">
                <img src="${cpImg}" alt="${cpNombre}" class="w-10 h-10 object-cover border border-black/10" />
                <div class="flex-grow min-w-0">
                  <h5 class="text-[10px] font-black uppercase tracking-tight truncate text-black dark:text-white">${cpNombre}</h5>
                  <span class="text-[10px] font-bold text-[#e62429]">${cpPrecio} €</span>
                </div>
                <button 
                  class="btn-quick-add text-[9px] font-black uppercase border border-black dark:border-white px-2 py-1 bg-black text-white hover:bg-[#e62429] hover:text-white transition-colors duration-200" 
                  data-id="${cpId}"
                >
                  ADD
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 5. Inyectar estructura completa HTML
  modalRoot.innerHTML = `
    <!-- Fondo Blur Oscuro -->
    <div id="product-detail-modal-overlay" class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"></div>

    <!-- Tarjeta del Modal -->
    <div class="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(230,36,41,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden z-10 animate-scaleUp">
      
      <!-- Botón de Cerrar (Brutalist style) -->
      <button 
        id="product-detail-modal-close" 
        class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center font-black text-lg bg-white dark:bg-zinc-900 text-black dark:text-white border-2 border-black dark:border-white hover:bg-[#e62429] hover:text-white transition-colors duration-200 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        aria-label="Close modal"
      >
        ✕
      </button>

      <!-- Panel Izquierdo: Imagen -->
      <div class="w-full md:w-1/2 h-[300px] md:h-auto md:min-h-[500px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white p-6 relative overflow-hidden flex-shrink-0">
        <img 
          src="${imgSrc}" 
          alt="${nombre}" 
          class="w-full h-full object-contain max-h-[350px] transition-transform duration-500 hover:scale-105"
          onerror="this.src='https://placehold.co/500x500/111111/e62429?text=B'"
        />
        <!-- Badge de Marca -->
        <span class="absolute bottom-4 left-4 bg-black text-white dark:bg-white dark:text-black text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 border border-white/20">
          ${marca}
        </span>
      </div>

      <!-- Panel Derecho: Detalles e Interacción -->
      <div class="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[600px]">
        
        <!-- Contenido Superior -->
        <div>
          <!-- Categoría -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[9px] font-black uppercase tracking-[0.2em] bg-[#e62429]/10 text-[#e62429] border border-[#e62429]/30 px-2 py-0.5">
              ${categoria.toUpperCase() || 'ELITE SUPPLEMENT'}
            </span>
            <span class="text-[9px] font-black uppercase tracking-[0.2em] bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/70 px-2 py-0.5">
              ${objetivo.toUpperCase()}
            </span>
          </div>

          <!-- Título -->
          <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white leading-none mb-3">
            ${nombre}
          </h2>

          <!-- Precio -->
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-3xl font-black tracking-tighter text-[#e62429]">
              ${formattedPrice} €
            </span>
            <span class="text-[10px] font-bold text-black/30 dark:text-white/30 uppercase">
              VAT INCLUDED / ${stock > 0 ? `${stock} IN STOCK` : 'OUT OF STOCK'}
            </span>
          </div>

          <!-- Descripción -->
          <p class="text-xs text-black/70 dark:text-white/70 font-semibold leading-relaxed mb-6">
            ${descripcion}
          </p>

          <!-- Detalles técnicos/nutricionales interactivas -->
          <div class="flex flex-col gap-4 border-t border-black/10 dark:border-white/10 pt-4">
            <!-- Pestañas/Sección Técnica -->
            <div class="w-full">
              <div class="flex gap-2 mb-3">
                <button id="modal-tab-specs" class="text-[10px] font-black uppercase tracking-wider pb-1 border-b-2 border-[#e62429] text-[#e62429]">
                  PRODUCT SPECS
                </button>
                <button id="modal-tab-usage" class="text-[10px] font-black uppercase tracking-wider pb-1 border-b-2 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
                  HOW TO USE / CARE
                </button>
              </div>

              <!-- Contenido de las pestañas -->
              <div id="modal-tab-content-specs" class="block animate-fadeIn">
                ${specsHTML}
              </div>
              <div id="modal-tab-content-usage" class="hidden animate-fadeIn">
                ${usageHTML}
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido Inferior: Compra y Cross-selling -->
        <div>
          <!-- Cross-selling -->
          ${crossHTML}

          <!-- Controles de Compra -->
          <div class="flex gap-4 items-center mt-6 border-t border-black/10 dark:border-white/10 pt-6">
            <!-- Selector de Cantidad -->
            <div class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">QTY</span>
              <div class="flex items-center border-2 border-black dark:border-white bg-white dark:bg-zinc-800">
                <button id="modal-qty-minus" class="px-3 py-1 font-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">-</button>
                <span id="modal-qty-value" class="w-8 text-center font-black text-sm">1</span>
                <button id="modal-qty-plus" class="px-3 py-1 font-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">+</button>
              </div>
            </div>

            <!-- Botón Añadir -->
            <div class="flex-grow">
              <button 
                id="modal-btn-add" 
                class="w-full bg-[#e62429] hover:bg-black dark:hover:bg-white text-white dark:hover:text-black font-black uppercase tracking-[0.15em] text-xs py-4 px-6 border-2 border-black dark:border-white hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all duration-200 cursor-pointer"
                ${stock <= 0 ? 'disabled' : ''}
              >
                ${stock > 0 ? 'ADD TO ARSENAL' : 'OUT OF STOCK'}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  // 6. Añadir al DOM
  document.body.appendChild(modalRoot);
  document.body.style.overflow = 'hidden'; // Evitar scroll de fondo

  // 7. Configurar eventos de interacción
  const overlay = modalRoot.querySelector('#product-detail-modal-overlay');
  const closeBtn = modalRoot.querySelector('#product-detail-modal-close');
  const addBtn = modalRoot.querySelector('#modal-btn-add');
  const qtyMinus = modalRoot.querySelector('#modal-qty-minus');
  const qtyPlus = modalRoot.querySelector('#modal-qty-plus');
  const qtyValue = modalRoot.querySelector('#modal-qty-value');

  // Pestañas
  const tabSpecs = modalRoot.querySelector('#modal-tab-specs');
  const tabUsage = modalRoot.querySelector('#modal-tab-usage');
  const contentSpecs = modalRoot.querySelector('#modal-tab-content-specs');
  const contentUsage = modalRoot.querySelector('#modal-tab-content-usage');

  let currentQty = 1;

  const closeModal = () => {
    modalRoot.classList.add('animate-fadeOut');
    modalRoot.querySelector('.animate-scaleUp').classList.remove('animate-scaleUp');
    modalRoot.querySelector('.relative').classList.add('animate-scaleDown');
    
    setTimeout(() => {
      modalRoot.remove();
      document.body.style.overflow = ''; // Restaurar scroll
    }, 250);
  };

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  // Escuchar tecla Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Controladores de Pestañas
  if (tabSpecs && tabUsage) {
    tabSpecs.addEventListener('click', () => {
      tabSpecs.className = 'text-[10px] font-black uppercase tracking-wider pb-1 border-b-2 border-[#e62429] text-[#e62429]';
      tabUsage.className = 'text-[10px] font-black uppercase tracking-wider pb-1 border-b-2 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors';
      contentSpecs.classList.remove('hidden');
      contentUsage.classList.add('hidden');
    });

    tabUsage.addEventListener('click', () => {
      tabUsage.className = 'text-[10px] font-black uppercase tracking-wider pb-1 border-b-2 border-[#e62429] text-[#e62429]';
      tabSpecs.className = 'text-[10px] font-black uppercase tracking-wider pb-1 border-b-2 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors';
      contentUsage.classList.remove('hidden');
      contentSpecs.classList.add('hidden');
    });
  }

  // Controles de cantidad
  qtyMinus.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      qtyValue.textContent = currentQty;
    }
  });

  qtyPlus.addEventListener('click', () => {
    if (currentQty < stock) {
      currentQty++;
      qtyValue.textContent = currentQty;
    }
  });

  // Botón añadir al carrito principal
  addBtn.addEventListener('click', async () => {
    const originalText = addBtn.textContent;
    addBtn.textContent = 'ADDING TO ARSENAL...';
    addBtn.disabled = true;

    // Llama al servicio del carrito (multiplicado por la cantidad elegida)
    let success = true;
    for (let i = 0; i < currentQty; i++) {
      const ok = await addItemToCart(id);
      if (!ok) success = false;
    }

    if (success) {
      addBtn.textContent = 'ADDED SUCCESSFULLY!';
      addBtn.className = 'w-full bg-green-600 text-white font-black uppercase tracking-[0.15em] text-xs py-4 px-6 border-2 border-black hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200 cursor-pointer';
      
      setTimeout(() => {
        closeModal();
      }, 1000);
    } else {
      addBtn.textContent = 'ERROR ADDING ITEM';
      addBtn.className = 'w-full bg-red-600 text-white font-black uppercase tracking-[0.15em] text-xs py-4 px-6 border-2 border-black transition-all';
      setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.disabled = false;
        addBtn.className = 'w-full bg-[#e62429] hover:bg-black text-white font-black uppercase tracking-[0.15em] text-xs py-4 px-6 border-2 border-black hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200 cursor-pointer';
      }, 2000);
    }
  });

  // Botón quick add de cross-selling
  modalRoot.addEventListener('click', async (e) => {
    const qaBtn = e.target.closest('.btn-quick-add');
    if (!qaBtn) return;

    const qaId = qaBtn.dataset.id;
    const originalText = qaBtn.textContent;
    qaBtn.textContent = '...';
    qaBtn.disabled = true;

    const success = await addItemToCart(qaId);
    if (success) {
      qaBtn.textContent = '✔';
      qaBtn.className = 'btn-quick-add text-[9px] font-black uppercase border border-black bg-green-600 text-white px-2 py-1 transition-colors';
      setTimeout(() => {
        qaBtn.textContent = originalText;
        qaBtn.disabled = false;
        qaBtn.className = 'btn-quick-add text-[9px] font-black uppercase border border-black bg-black text-white hover:bg-[#e62429] hover:text-white px-2 py-1 transition-colors';
      }, 1500);
    } else {
      qaBtn.textContent = 'ERR';
      setTimeout(() => {
        qaBtn.textContent = originalText;
        qaBtn.disabled = false;
      }, 1500);
    }
  });
};
