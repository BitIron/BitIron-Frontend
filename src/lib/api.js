// src/lib/api.js
// Centraliza las peticiones HTTP al backend BitIron.
// Solo incluye lo que estamos usando actualmente en el frontend.

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bitiron_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── PRODUCTOS (Usado en ShopCatalog) ─────────────────────────────────────────

/**
 * GET /api/productos
 * Devuelve la lista completa de productos.
 */
export const getProductos = async () => {
  const response = await api.get('/productos');
  // El backend devuelve { success: true, data: [...] }
  return response.data.data || response.data;
};

/**
 * GET /api/productos/:id
 */
export const getProductoById = async (id) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

// ── CARRITO DE COMPRAS ────────────────────────────────────────────────────────

/**
 * GET /api/carrito
 * Devuelve el carrito del usuario autenticado.
 */
export const getCarrito = async () => {
  const response = await api.get('/carrito');
  return response.data;
};

/**
 * POST /api/carrito
 * Añade un producto al carrito del usuario.
 */
export const addProductoCarrito = async (productoId, cantidad = 1) => {
  const response = await api.post('/carrito', { IdProducto: productoId, Cantidad: cantidad });
  return response.data;
};

/**
 * PUT /api/carrito/:id
 * Actualiza la cantidad de un producto en el carrito (usa IdCarrito)
 */
export const updateCantidadCarrito = async (idCarrito, cantidad) => {
  const response = await api.put(`/carrito/${idCarrito}`, { Cantidad: cantidad });
  return response.data;
};

/**
 * DELETE /api/carrito/:id
 * Elimina un producto del carrito (usa IdCarrito)
 */
export const removeProductoCarrito = async (idCarrito) => {
  const response = await api.delete(`/carrito/${idCarrito}`);
  return response.data;
};

// ── AUTHENTICATION ──────────────────────────────────────────────────────────

export const setToken = (token) => {
  localStorage.setItem('bitiron_token', token);
};

export const getToken = () => {
  return localStorage.getItem('bitiron_token');
};

export const clearToken = () => {
  localStorage.removeItem('bitiron_token');
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (nombreCompleto, email, password) => {
  // Nota: El backend tiene la ruta '/auth/registro' (o register? Revisemos authRoutes.js si es registro)
  // El controlador se llama 'registro'. Asumiré que la ruta es '/auth/registro'
  const response = await api.post('/auth/registro', { nombreCompleto, email, password });
  return response.data;
};

export default api;
