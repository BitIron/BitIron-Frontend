// src/components/ProductCard.js
// Tarjeta de producto individual.
// Recibe un objeto product del backend: { id, nombre, precio, categoria, imagen_url, descripcion }
// Renderiza HTML string para inyectar en el grid.

export const ProductCard = (product) => {
  // Normalizamos las propiedades para soportar tanto minúsculas (JS) como Mayúsculas (SQL/Backend)
  const id          = product.id          || product.ID          || product.IdProducto;
  const nombre      = product.nombre      || product.Nombre;
  const precio      = product.precio      || product.Precio;
  const categoria   = product.categoria   || product.Categoria;
  const imagen_url  = product.imagen_url  || product.Imagen_URL;
  const descripcion = product.descripcion || product.Descripcion;

  // Formatea el precio con 2 decimales y símbolo €
  const formattedPrice = parseFloat(precio || 0).toFixed(2);

  // Label de categoría — color rojo si es "pre-workout", blanco resto
  const categoryLabel = categoria ? categoria.toUpperCase() : 'SUPPLEMENT';

  // Imagen: usa la del backend o un placeholder oscuro con iniciales
  const imgSrc = imagen_url || `https://placehold.co/400x400/111111/e62429?text=${encodeURIComponent(nombre?.charAt(0) || 'B')}`;

  return `
    <article
      class="product-card group relative flex flex-col bg-white dark:bg-black border border-black/8 dark:border-white/10 overflow-hidden cursor-pointer
             transition-all duration-500 hover:border-[#e62429]/40 dark:hover:border-[#e62429]/40 hover:-translate-y-1 shadow-sm hover:shadow-lg text-black dark:text-white"
      data-id="${id}"
      data-category="${categoria || 'all'}"
      style="opacity: 0;"
    >
      <!-- Imagen del producto -->
      <div class="relative overflow-hidden aspect-square bg-[#f4f4f4] dark:bg-zinc-900">
        <img
          src="${imgSrc}"
          alt="${nombre}"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x400/111111/e62429?text=B'"
        />
        <!-- Overlay sutil en hover -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 pointer-events-none"></div>

        <!-- Badge de categoría -->
        <span class="absolute top-3 left-3 text-[9px] font-black tracking-[0.2em] uppercase
                     bg-black/70 text-[#e62429] px-2 py-1 border border-[#e62429]/30">
          ${categoryLabel}
        </span>
      </div>

      <!-- Info del producto -->
      <div class="flex flex-col flex-grow p-4 gap-2 bg-white dark:bg-black transition-colors duration-300">

        <!-- Nombre -->
        <h3 class="font-black uppercase text-black dark:text-white text-sm tracking-tight leading-tight line-clamp-2">
          ${nombre}
        </h3>

        <!-- Descripción corta (opcional) -->
        ${descripcion ? `
        <p class="text-black/40 dark:text-white/40 text-[11px] leading-relaxed line-clamp-2">
          ${descripcion}
        </p>` : ''}

        <!-- Precio -->
        <div class="flex items-center justify-between mt-auto pt-3 border-t border-black/8 dark:border-white/10">
          <span class="font-black text-black dark:text-white text-lg tracking-tight">
            ${formattedPrice}<span class="text-xs text-black/40 dark:text-white/40 ml-1">€</span>
          </span>

          <button class="btn-add-cart text-[9px] font-black uppercase tracking-[0.2em] text-white dark:text-black bg-black dark:bg-white hover:bg-[#e62429] dark:hover:bg-[#e62429] dark:hover:text-white px-3 py-2 transition-all duration-300" data-id="${id}">
            ADD TO CART
          </button>
        </div>

      </div>
    </article>
  `;
};
