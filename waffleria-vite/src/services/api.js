import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9003/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción.');
    } else if (error.response?.status >= 500) {
      toast.error('Error interno del servidor. Intenta más tarde.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
  verifyToken: () => api.get('/auth/verify-token'),
  logout: () => api.post('/auth/logout'),
};

// Servicios de Usuarios
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  toggleStatus: (id) => api.patch(`/users/${id}/toggle-status`),
  resetPassword: (id, newPassword) => api.patch(`/users/${id}/reset-password`, { nuevaPassword: newPassword }),
};

// Servicios de Productos
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoria) => api.get(`/products/categoria/${categoria}`),
  getMenu: () => api.get('/products/menu/completo'),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  toggleAvailability: (id) => api.patch(`/products/${id}/toggle-availability`),
  updatePopularity: (id, incremento = 1) => api.patch(`/products/${id}/popularity`, { incremento }),
};

// Servicios de Inventario
export const inventoryAPI = {
  getAll: (params = {}) => api.get('/inventory', { params }),
  getLowStock: () => api.get('/inventory/bajo-stock'),
  getExpiringSoon: (dias = 7) => api.get('/inventory/proximos-vencer', { params: { dias } }),
  getValueReport: () => api.get('/inventory/reporte/valor-total'),
  create: (inventoryData) => api.post('/inventory', inventoryData),
  update: (id, inventoryData) => api.put(`/inventory/${id}`, inventoryData),
  delete: (id) => api.delete(`/inventory/${id}`),
  registerMovement: (id, movementData) => api.post(`/inventory/${id}/movimiento`, movementData),
};

// Servicios de Órdenes
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getPending: () => api.get('/orders/cocina/pendientes'),
  getRecent: (limite = 10) => api.get('/orders/recientes/ultimas', { params: { limite } }),
  getTodayStats: () => api.get('/orders/estadisticas/hoy'),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, estado) => api.patch(`/orders/${id}/estado`, { estado }),
  cancel: (id, motivo) => api.patch(`/orders/${id}/cancelar`, { motivo }),
};

// Servicios de Caja Registradora
export const cashRegisterAPI = {
  open: (montoInicial) => api.post('/cash-register/abrir', { montoInicialEfectivo: montoInicial }),
  getCurrent: () => api.get('/cash-register/actual'),
  getById: (id) => api.get(`/cash-register/${id}`),
  getHistory: (params = {}) => api.get('/cash-register/historial', { params }),
  addTransaction: (id, transactionData) => api.post(`/cash-register/${id}/transaccion`, transactionData),
  close: (id, montoFinal, observaciones) => api.post(`/cash-register/${id}/cerrar`, {
    montoFinalContado: montoFinal,
    observaciones
  }),
  getPaymentMethodsReport: (id) => api.get(`/cash-register/${id}/reporte-metodos-pago`),
  getDayStats: (fecha) => api.get('/cash-register/estadisticas/dia', { params: { fecha } }),
};

// Servicios de Reportes
export const reportsAPI = {
  getSalesReport: (params = {}) => api.get('/reports/ventas', { params }),
  getProductsReport: (params = {}) => api.get('/reports/productos-vendidos', { params }),
  getCashiersReport: (params = {}) => api.get('/reports/cajeros', { params }),
  getPaymentMethodsReport: (params = {}) => api.get('/reports/metodos-pago', { params }),
  getDashboard: (periodo = 30) => api.get('/reports/dashboard', { params: { periodo } }),
  exportSales: (params = {}) => api.get('/reports/exportar/ventas', { params }),
};

// Servicios de Upload
export const uploadAPI = {
  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProductImage: (filename) => api.delete(`/upload/product-image/${filename}`),
  getImageUrl: (filename) => {
    if (!filename) return '/default-product.jpg';
    return filename.startsWith('http') ? filename : filename;
  }
};

// Utilidades
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

export default api;