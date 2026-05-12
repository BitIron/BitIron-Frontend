// src/components/ShopCatalog.js
// Sección del catálogo de productos.
// Diseño: misma estética brutalist del Hero — fondo negro, rojo #e62429, Inter font.
// Incluye: título de sección, filtros de categoría, grid de productos.
// Los productos se cargan desde el backend (GET /api/productos) via api.js.
// Mientras carga: skeleton placeholders. En error: mensaje de estado vacío.

import { ProductCard } from './ProductCard.js';
import { getProductos } from '../lib/api.js';
import { animateCatalogEntrance, animateCardReveal } from '../lib/motion.js';

// Categorías disponibles — "ALL" siempre primero
const CATEGORIES = ['ALL', 'PROTEIN', 'PRE-WORKOUT', 'CREATINE', 'RECOVERY', 'APPAREL'];

// ── Skeleton placeholder mientras cargan los datos ────────────────────────
const SkeletonCard = () => `
  <div class="animate-pulse flex flex-col bg-black/5 border border-black/8 overflow-hidden">
    <div class="aspect-square bg-black/5"></div>
    <div class="p-4 flex flex-col gap-3">
      <div class="h-4 bg-black/5 rounded w-3/4"></div>
      <div class="h-3 bg-black/5 rounded w-1/2"></div>
      <div class="h-3 bg-black/5 rounded w-2/3"></div>
      <div class="flex justify-between items-center pt-3 border-t border-black/8 mt-auto">
        <div class="h-5 bg-black/5 rounded w-16"></div>
        <div class="h-8 bg-black/5 rounded w-16"></div>
      </div>
    </div>
  </div>
`;

// ── HTML estático de la sección (shell) ───────────────────────────────────
export const ShopCatalog = () => `
  <section
    id="catalog"
    class="relative w-full bg-white flex flex-col px-6 sm:px-10 lg:px-16 overflow-hidden"
    style="height: 100dvh; min-height: 100vh;"
  >

    <!-- Línea decorativa roja superior -->
    <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e62429] to-transparent opacity-40"></div>

    <!-- ── Encabezado: ocupa su espacio natural en la parte superior ── -->
    <div class="pt-24 pb-0 max-w-7xl w-full mx-auto">
      <div id="catalog-header" class="opacity-0">

        <!-- Label rojo -->
        <p class="text-[#e62429] font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-3">
          Iron Forged Products
        </p>

        <!-- Título + contador -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h2 class="font-black uppercase text-black leading-none tracking-tighter"
              style="font-size: clamp(2.8rem, 7vw, 90px);">
            The Arsenal
          </h2>
          <p id="product-count" class="text-black/30 text-xs font-bold uppercase tracking-[0.3em] pb-1">
            Loading...
          </p>
        </div>

        <div class="mt-4 h-[1px] bg-black/10"></div>
      </div>

      <!-- ── Filtros ──────────────────────────────────────────────────── -->
      <div id="catalog-filters" class="flex flex-wrap gap-2 mt-6 opacity-0">
        ${CATEGORIES.map((cat, i) => `
          <button
            class="filter-btn text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2
                   border transition-all duration-300 cursor-pointer
                   ${i === 0
                     ? 'border-[#e62429] text-[#e62429] bg-[#e62429]/10'
                     : 'border-black/15 text-black/40 bg-transparent hover:border-black/60 hover:text-black/80'}"
            data-filter="${cat.toLowerCase() === 'all' ? 'all' : cat.toLowerCase()}"
            aria-pressed="${i === 0}"
          >
            ${cat}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- ── Grid: flex-1 para ocupar el espacio restante, con scroll interno ── -->
    <div class="flex-1 overflow-y-auto max-w-7xl w-full mx-auto mt-6 pb-8">

      <!-- Grid de productos -->
      <div
        id="products-grid"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
      >
        ${Array(8).fill(0).map(SkeletonCard).join('')}
      </div>

      <!-- Estado vacío -->
      <div id="catalog-empty" class="hidden text-center py-24">
        <p class="text-[#e62429] font-black uppercase tracking-[0.3em] text-sm mb-2">No products found</p>
        <p class="text-black/30 text-xs uppercase tracking-widest">Try a different filter</p>
      </div>

      <!-- Estado error -->
      <div id="catalog-error" class="hidden text-center py-24">
        <p class="text-black/30 font-black uppercase tracking-[0.3em] text-sm mb-2">Backend offline</p>
        <p class="text-black/20 text-xs uppercase tracking-widest">Check connection to API</p>
      </div>

    </div>

    <!-- Línea decorativa roja inferior -->
    <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e62429] to-transparent opacity-40"></div>

  </section>
`;

// ── Lógica del catálogo: carga datos, filtra, renderiza ──────────────────
export const initShopCatalog = async () => {

  // Animación de entrada del header y filtros
  animateCatalogEntrance();

  const grid      = document.getElementById('products-grid');
  const countEl   = document.getElementById('product-count');
  const emptyEl   = document.getElementById('catalog-empty');
  const errorEl   = document.getElementById('catalog-error');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Estado local
  let allProducts  = [];
  let activeFilter = 'all';

  // ── 1. Renderiza productos filtrados en el grid ──────────────────────
  const renderProducts = (products) => {
    grid.innerHTML = '';
    emptyEl.classList.add('hidden');
    errorEl.classList.add('hidden');

    if (products.length === 0) {
      emptyEl.classList.remove('hidden');
      countEl.textContent = '0 products';
      return;
    }

    grid.innerHTML = products.map(p => ProductCard(p)).join('');
    countEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

    // Animar cada card al aparecer
    animateCardReveal('#products-grid .product-card');
  };

  // ── 2. Filtra por categoría ──────────────────────────────────────────
  const applyFilter = (filter) => {
    activeFilter = filter;
    const filtered = filter === 'all'
      ? allProducts
      : allProducts.filter(p =>
          (p.categoria || '').toLowerCase() === filter
        );
    renderProducts(filtered);
  };

  // ── 3. Botones de filtro ─────────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Estilos activo/inactivo
      filterBtns.forEach(b => {
        b.classList.remove('border-[#e62429]', 'text-[#e62429]', 'bg-[#e62429]/10');
        b.classList.add('border-black/15', 'text-black/40');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('border-[#e62429]', 'text-[#e62429]', 'bg-[#e62429]/10');
      btn.classList.remove('border-black/15', 'text-black/40');
      btn.setAttribute('aria-pressed', 'true');

      applyFilter(btn.dataset.filter);
    });
  });

  // ── 4. Carga datos del backend ───────────────────────────────────────
  try {
    allProducts = await getProductos();
    renderProducts(allProducts);
  } catch (err) {
    // Backend caído → muestra mensaje de error
    grid.innerHTML = '';
    errorEl.classList.remove('hidden');
    countEl.textContent = 'API offline';
    console.warn('⚠️ BitIron API unreachable:', err.message);
  }
};
