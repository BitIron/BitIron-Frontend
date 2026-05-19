// src/components/ShopCatalog.js
// Sección del catálogo de productos.
// Diseño: misma estética brutalist del Hero — fondo negro, rojo #e62429, Inter font.
// Incluye: título de sección, filtros de categoría, grid de productos.
// Los productos se cargan desde el backend (GET /api/productos) via api.js.
// Mientras carga: skeleton placeholders. En error: mensaje de estado vacío.

import { ProductCard } from './ProductCard.js';
import { getProductos } from '../lib/api.js';
import { addItemToCart } from '../lib/cart.js';
import { animateCatalogEntrance, animateCardReveal } from '../lib/motion.js';
import { openProductDetailModal } from './productDetailModal.js';

// Available categories — "ALL" always first
// label: what the button shows | filter: exact DB NombreCategoria (lowercase)
const CATEGORIES = [
  { label: 'ALL',          filter: 'all'              },
  { label: 'SUPPLEMENTS',  filter: 'suplementacion'   },
  { label: 'EQUIPMENT',    filter: 'equipamiento'     },
  { label: 'CLOTHING',     filter: 'ropa fitness'     },
  { label: 'FIT FOOD',     filter: 'comida fit'       },
];

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
    class="relative w-full bg-white dark:bg-black text-black dark:text-white flex flex-col px-6 sm:px-10 lg:px-16 transition-colors duration-300"
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
          <h2 class="font-black uppercase text-black dark:text-white leading-none tracking-tighter"
              style="font-size: clamp(2.8rem, 7vw, 90px);">
            The Arsenal
          </h2>
          <p id="product-count" class="text-black/30 dark:text-white/30 text-xs font-bold uppercase tracking-[0.3em] pb-1">
            Loading...
          </p>
        </div>

        <div class="mt-4 h-[1px] bg-black/10 dark:bg-white/10"></div>
      </div>

      <!-- ── Filters ─────────────────────────────────────────────────── -->
      <div id="catalog-filters" class="flex flex-wrap gap-2 mt-6 opacity-0">
        ${CATEGORIES.map(({ label, filter }, i) => `
            <button
              class="filter-btn text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2
                     border transition-all duration-300 cursor-pointer
                     ${i === 0
                       ? 'border-[#e62429] text-[#e62429] bg-[#e62429]/10'
                       : 'border-black/15 dark:border-white/15 text-black/40 dark:text-white/40 bg-transparent hover:border-black/60 dark:hover:border-white/60 hover:text-black/80 dark:hover:text-white/80'}"
              data-filter="${filter}"
              aria-pressed="${i === 0}"
            >
              ${label}
            </button>
          `).join('')}
      </div>
    </div>

    <!-- ── Grid: natural flow without inner scroll ── -->
    <div class="max-w-7xl w-full mx-auto mt-6 pb-8">

      <!-- Sleek Brutalist Announcement Ticker/Banner -->
      <div class="mb-8 border-4 border-black dark:border-white bg-[#e62429] p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Stripe patterns -->
        <div class="absolute inset-y-0 right-0 w-1/3 bg-black opacity-10 skew-x-12 pointer-events-none"></div>
        <div class="flex items-center gap-4">
          <div class="bg-black text-[#e62429] px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black">
            LAUNCH OFFER
          </div>
          <div>
            <h4 class="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-black">FUEL THE LEGACY: 20% OFF</h4>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-black/70">LIMITED TIME FOR THE FIRST 100 ATHLETES</p>
          </div>
        </div>
        <div class="flex items-center gap-3 bg-black text-white px-5 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(230,36,41,1)]">
          <span class="text-[10px] font-black uppercase tracking-widest text-[#e62429]">USE CODE:</span>
          <span class="text-xl font-black tracking-widest select-all cursor-pointer hover:text-[#e62429] transition-colors font-mono" title="Click to copy" onclick="navigator.clipboard.writeText('ATHLETE20'); alert('PROMO CODE ATHLETE20 COPIED! USE IT AT CHECKOUT.');">ATHLETE20</span>
        </div>
      </div>

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
        <p class="text-black/30 dark:text-white/30 text-xs uppercase tracking-widest">Try a different filter</p>
      </div>

      <!-- Estado error -->
      <div id="catalog-error" class="hidden text-center py-24">
        <p class="text-black/30 dark:text-white/30 font-black uppercase tracking-[0.3em] text-sm mb-2">Backend offline</p>
        <p class="text-black/20 dark:text-white/20 text-xs uppercase tracking-widest">Check connection to API</p>
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

  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('product-count');
  const emptyEl = document.getElementById('catalog-empty');
  const errorEl = document.getElementById('catalog-error');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Estado local
  let allProducts = [];
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

  // ── 2. Filter by category ────────────────────────────────────────────
  const applyFilter = (filter) => {
    activeFilter = filter;

    let filtered = filter === 'all'
      ? [...allProducts]
      : allProducts.filter(p => {
          const categoryName = (p.NombreCategoria || p.categoria || p.Categoria || '').toLowerCase();
          return categoryName === filter;
        });

    // Deduplicate by Imagen_Url — show only one product per unique image
    const seenImages = new Set();
    filtered = filtered.filter(p => {
      const img = p.Imagen_Url || p.imagen_url || null;
      if (!img) return true; // always show products without image
      if (seenImages.has(img)) return false;
      seenImages.add(img);
      return true;
    });

    // Shuffle when showing ALL
    if (filter === 'all') {
      filtered = filtered.sort(() => Math.random() - 0.5);
    }

    renderProducts(filtered);
  };

  // ── 3. Botones de filtro ─────────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Estilos activo/inactivo
      filterBtns.forEach(b => {
        b.classList.remove('border-[#e62429]', 'text-[#e62429]', 'bg-[#e62429]/10');
        b.classList.add('border-black/15', 'dark:border-white/15', 'text-black/40', 'dark:text-white/40');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('border-[#e62429]', 'text-[#e62429]', 'bg-[#e62429]/10');
      btn.classList.remove('border-black/15', 'dark:border-white/15', 'text-black/40', 'dark:text-white/40');
      btn.setAttribute('aria-pressed', 'true');

      applyFilter(btn.dataset.filter);
    });
  });

  // ── 3.5 Añadir al carrito & Detalle de Producto (Delegación de eventos) ──
  grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-add-cart');

    // Caso 1: Click en el botón de agregar al carrito
    if (btn) {
      e.preventDefault();
      e.stopPropagation();

      const productId = btn.dataset.id;
      const originalText = btn.textContent;
      btn.textContent = 'ADDING...';
      btn.disabled = true;

      const success = await addItemToCart(productId);

      if (success) {
        btn.textContent = 'ADDED!';
        btn.classList.add('bg-green-600', 'text-white');
        btn.classList.remove('bg-black', 'hover:bg-[#e62429]');

        // Volver a la normalidad tras 2s
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.classList.remove('bg-green-600');
          btn.classList.add('bg-black', 'hover:bg-[#e62429]');
        }, 2000);
      } else {
        btn.textContent = 'ERROR';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      }
      return;
    }

    // Caso 2: Click en cualquier otra parte de la tarjeta del producto -> Abrir modal
    const card = e.target.closest('.product-card');
    if (card) {
      const productId = card.dataset.id;
      // Encontrar el producto correspondiente en el estado local de allProducts
      const product = allProducts.find(p => {
        const pId = p.id || p.ID || p.IdProducto;
        return String(pId) === String(productId);
      });

      if (product) {
        openProductDetailModal(product, allProducts);
      }
    }
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
