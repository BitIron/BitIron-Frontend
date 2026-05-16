// src/lib/cart.js
import { getCarrito, addProductoCarrito, updateCantidadCarrito, removeProductoCarrito, getToken } from './api.js';

// Estado local
let cartItemsCount = 0;
let cartItems = []; // Array completo de productos en el carrito

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
    // Guardamos el array original de items (si viene en data o data.items)
    cartItems = Array.isArray(data) ? data : (data?.items || []);
    cartItemsCount = cartItems.reduce((total, item) => total + (item.Cantidad || item.cantidad || 1), 0);
    notifyCartUpdate();
  } catch (err) {
    console.error('Failed to init cart state:', err);
  }
};

/**
 * Obtiene los datos locales del carrito (ideal para la página de Checkout)
 */
export const getCartData = () => {
  return cartItems;
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
    // Para simplificar, recargamos el carrito desde el servidor para tener los IDs y totales correctos
    await initCart();
    return true;
  } catch (err) {
    console.error('Failed to add item to cart:', err);
    return false;
  }
};

/**
 * Actualiza la cantidad de un producto y refresca el estado
 */
export const updateItemQuantity = async (idCarrito, cantidad) => {
  try {
    await updateCantidadCarrito(idCarrito, cantidad);
    await initCart();
    return true;
  } catch (err) {
    console.error('Failed to update cart item quantity:', err);
    return false;
  }
};

/**
 * Elimina un producto del carrito y refresca el estado
 */
export const removeItemFromCart = async (idCarrito) => {
  try {
    await removeProductoCarrito(idCarrito);
    await initCart();
    return true;
  } catch (err) {
    console.error('Failed to remove item from cart:', err);
    return false;
  }
};
