import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9003';

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
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
  changePassword: (passwords) => api.put('/api/auth/change-password', passwords),
  verifyToken: () => api.get('/api/auth/verify-token'),
  logout: () => api.post('/api/auth/logout'),
};

// Servicios de Usuarios
export const usersAPI = {
  getAll: (params = {}) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (userData) => api.post('/api/users', userData),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
  toggleStatus: (id) => api.patch(`/api/users/${id}/toggle-status`),
  resetPassword: (id, newPassword) => api.patch(`/api/users/${id}/reset-password`, { nuevaPassword: newPassword }),
};

// Servicios de Productos
export const productsAPI = {
  getAll: (params = {}) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  getByCategory: (categoria) => api.get(`/api/products/categoria/${categoria}`),
  getMenu: () => api.get('/api/products/menu/completo'),
  create: (productData) => api.post('/api/products', productData),
  update: (id, productData) => api.put(`/api/products/${id}`, productData),
  delete: (id) => api.delete(`/api/products/${id}`),
  toggleAvailability: (id) => api.patch(`/api/products/${id}/toggle-availability`),
  updatePopularity: (id, incremento = 1) => api.patch(`/api/products/${id}/popularity`, { incremento }),
};

// Servicios de Inventario
export const inventoryAPI = {
  getAll: (params = {}) => api.get('/api/inventory', { params }),
  getLowStock: () => api.get('/api/inventory/bajo-stock'),
  getExpiringSoon: (dias = 7) => api.get('/api/inventory/proximos-vencer', { params: { dias } }),
  getValueReport: () => api.get('/api/inventory/reporte/valor-total'),
  create: (inventoryData) => api.post('/api/inventory', inventoryData),
  update: (id, inventoryData) => api.put(`/api/inventory/${id}`, inventoryData),
  delete: (id) => api.delete(`/api/inventory/${id}`),
  registerMovement: (id, movementData) => api.post(`/api/inventory/${id}/movimiento`, movementData),
};

// Servicios de Órdenes
export const ordersAPI = {
  getAll: (params = {}) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  getPending: () => api.get('/api/orders/cocina/pendientes'),
  getRecent: (limite = 10) => api.get('/api/orders/recientes/ultimas', { params: { limite } }),
  getTodayStats: () => api.get('/api/orders/estadisticas/hoy'),
  create: (orderData) => api.post('/api/orders', orderData),
  updateStatus: (id, estado) => api.patch(`/api/orders/${id}/estado`, { estado }),
  cancel: (id, motivo) => api.patch(`/api/orders/${id}/cancelar`, { motivo }),
};

// Servicios de Caja Registradora
export const cashRegisterAPI = {
  open: (montoInicial) => api.post('/api/cash-register/abrir', { montoInicialEfectivo: montoInicial }),
  getCurrent: () => api.get('/api/cash-register/actual'),
  getById: (id) => api.get(`/api/cash-register/${id}`),
  getHistory: (params = {}) => api.get('/api/cash-register/historial', { params }),
  addTransaction: (id, transactionData) => api.post(`/api/cash-register/${id}/transaccion`, transactionData),
  close: (id, montoFinal, observaciones) => api.post(`/api/cash-register/${id}/cerrar`, {
    montoFinalContado: montoFinal,
    observaciones
  }),
  getPaymentMethodsReport: (id) => api.get(`/api/cash-register/${id}/reporte-metodos-pago`),
  getDayStats: (fecha) => api.get('/api/cash-register/estadisticas/dia', { params: { fecha } }),
};

// Servicios de Reportes
export const reportsAPI = {
  getSalesReport: (params = {}) => api.get('/api/reports/ventas', { params }),
  getProductsReport: (params = {}) => api.get('/api/reports/productos-vendidos', { params }),
  getCashiersReport: (params = {}) => api.get('/api/reports/cajeros', { params }),
  getPaymentMethodsReport: (params = {}) => api.get('/api/reports/metodos-pago', { params }),
  getDashboard: (periodo = 30) => api.get('/api/reports/dashboard', { params: { periodo } }),
  exportSales: (params = {}) => api.get('/api/reports/exportar/ventas', { params }),
};

// Servicios de Upload
export const uploadAPI = {
  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/api/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProductImage: (filename) => api.delete(`/api/upload/product-image/${filename}`),
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