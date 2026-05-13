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

export default api;
