// src/lib/api.js
// Centraliza las peticiones HTTP al backend BitIron.
// Solo incluye lo que estamos usando actualmente en el frontend.

import axios from 'axios';
import { showToast } from './toast.js';

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

// Interceptor para manejar errores de respuesta (como sesión expirada 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bitiron_token');
      if (!window.location.pathname.includes('login.html')) {
        showToast('YOUR SESSION HAS EXPIRED. PLEASE LOGIN AGAIN.', 'error');
        window.location.href = '/login.html';
      }
    }
    return Promise.reject(error);
  }
);

// ── PRODUCTOS (Usado en ShopCatalog) ─────────────────────────────────────────

/**
 * GET /api/productos
 * Devuelve la lista completa de productos.
 */
export const getProductos = async () => {
  const response = await api.get('/productos?limit=100');
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
  const response = await api.post('/auth/registro', { nombreCompleto, email, password });
  return response.data;
};

export const getPerfil = async () => {
  const response = await api.get('/auth/perfil');
  return response.data.usuario || response.data;
};

export const updatePerfil = async (nombreCompleto, objetivoFitness) => {
  const response = await api.put('/auth/perfil', { nombreCompleto, objetivoFitness });
  return response.data;
};

export const getPedidosCliente = async (idCliente) => {
  const response = await api.get(`/pedidos/cliente/${idCliente}`);
  return response.data;
};

/**
 * POST /api/pedidos/checkout
 * Procesa el carrito actual del cliente en una transacción atómica:
 * valida stock, crea el PEDIDO, inserta DETALLE_PEDIDO, resta stock y vacía el CARRITO.
 */
export const checkoutPedido = async (idCliente) => {
  const response = await api.post('/pedidos/checkout', { IdCliente: idCliente });
  return response.data;
};

// ── ASESORIAS / PLANES DE ENTRENAMIENTO ──────────────────────────────────────────

export const getAsesoriasHistorial = async () => {
  const response = await api.get('/planes/historial');
  return response.data;
};

export const createAsesoria = async (asesoriaData) => {
  const response = await api.post('/asesorias', asesoriaData);
  return response.data;
};

export const updateAsesoria = async (id, asesoriaData) => {
  const response = await api.put(`/asesorias/${id}`, asesoriaData);
  return response.data;
};

export const deleteAsesoria = async (id) => {
  const response = await api.delete(`/asesorias/${id}`);
  return response.data;
};

export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default api;
