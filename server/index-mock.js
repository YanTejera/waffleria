const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth-mock');
const productRoutes = require('./routes/products-mock');

const app = express();
const PORT = process.env.PORT || 9002;

// Seguridad
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3005',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas) con CORS
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static('uploads'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rutas mock para otras funcionalidades
app.use('/api/users', (req, res) => {
  res.json({ message: 'Users endpoint (mock)' });
});

app.use('/api/orders', (req, res) => {
  res.json({ message: 'Orders endpoint (mock)' });
});

app.use('/api/inventory', (req, res) => {
  res.json({ message: 'Inventory endpoint (mock)' });
});

app.use('/api/reports', (req, res) => {
  res.json({ message: 'Reports endpoint (mock)' });
});

app.use('/api/cash-register', (req, res) => {
  res.json({ message: 'Cash register endpoint (mock)' });
});

app.use('/api/upload', (req, res) => {
  res.json({ message: 'Upload endpoint (mock)' });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de La Waffleria funcionando correctamente (MODO MOCK)',
    version: '1.0.0',
    endpoints: [
      '/api/auth/login',
      '/api/auth/me',
      '/api/products',
      '/api/products/:id'
    ]
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor mock corriendo en puerto ${PORT}`);
  console.log(`📊 Modo: DESARROLLO (sin MongoDB)`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📋 Usuarios de prueba:`);
  console.log(`   - admin@waffleria.com / admin123`);
  console.log(`   - gerente@waffleria.com / gerente123`);
  console.log(`   - cajero@waffleria.com / cajero123`);
});