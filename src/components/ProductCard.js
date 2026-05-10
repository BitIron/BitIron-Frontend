// src/components/ProductCard.js
// Este componente representará cada producto de la tienda.
export const ProductCard = (product) => {
  return `
    <div class="product-card">
      <p>Product Card: ${product.nombre}</p>
    </div>
  `;
};
