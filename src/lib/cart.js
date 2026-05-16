// src/lib/cart.js
import { getCarrito, addProductoCarrito, getToken } from './api.js';

// Estado local
let cartItemsCount = 0;

/**
 * Notifica a la interfaz (Navbar) que el carrito ha cambiado.
 */
const notifyCartUpdate = () => {
  const event = new CustomEvent('cart_updated', { detail: { count: cartItemsCount } });
  document.dispatchEvent(event);
};

// Escucha global para actualizar el UI badge en cualquier página que tenga el Navbar
document.addEventListener('cart_updated', (e) => {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  
  const count = e.detail.count;
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.classList.remove('opacity-0');
  } else {
    badge.classList.add('opacity-0');
  }
});

/**
 * Inicializa el carrito al cargar la página (solo si está logueado).
 */
export const initCart = async () => {
  if (!getToken()) return;

  try {
    const data = await getCarrito();
    // Dependiendo de cómo devuelva el backend el carrito (array o con total items)
    // Asumimos que data.items es un array de productos en el carrito.
    cartItemsCount = data?.items?.reduce((total, item) => total + item.cantidad, 0) || data?.length || 0;
    notifyCartUpdate();
  } catch (err) {
    console.error('Failed to init cart state:', err);
  }
};

/**
 * Añade un producto al carrito y actualiza la UI.
 */
export const addItemToCart = async (productoId) => {
  if (!getToken()) {
    // Podríamos lanzar un toast o redirigir al login
    alert('PLEASE LOGIN TO ACCESS THE ARSENAL');
    window.location.href = '/login.html';
    return false;
  }

  try {
    await addProductoCarrito(productoId, 1);
    // Para simplificar, incrementamos localmente. En una app robusta, re-fetchearíamos o confiaríamos en la respuesta
    cartItemsCount += 1;
    notifyCartUpdate();
    return true;
  } catch (err) {
    console.error('Failed to add item to cart:', err);
    return false;
  }
};
