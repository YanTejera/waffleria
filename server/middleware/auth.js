const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT (sin MongoDB)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    const secret = process.env.JWT_SECRET || 'waffleria-default-jwt-secret-key';
    const decoded = jwt.verify(token, secret);

    // Usuarios en memoria (debe coincidir con auth.js)
    const devUsers = {
      '1': {
        id: '1',
        nombre: 'Administrador',
        email: 'admin@waffleria.com',
        rol: 'admin',
        activo: true
      },
      '2': {
        id: '2',
        nombre: 'Gerente',
        email: 'gerente@waffleria.com',
        rol: 'gerente',
        activo: true
      },
      '3': {
        id: '3',
        nombre: 'Cajero',
        email: 'cajero@waffleria.com',
        rol: 'cajero',
        activo: true
      }
    };

    const user = devUsers[decoded.id];

    if (!user) {
      return res.status(401).json({ message: 'Token inválido. Usuario no encontrado.' });
    }

    if (!user.activo) {
      return res.status(401).json({ message: 'Usuario inactivo.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware auth:', error);
    res.status(401).json({ message: 'Token inválido.' });
  }
};

// Middleware para verificar roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}.`
      });
    }

    next();
  };
};

// Middleware específico para administradores
const requireAdmin = authorize('admin');

// Middleware específico para gerentes y administradores
const requireManager = authorize('admin', 'gerente');

// Middleware específico para cualquier usuario autenticado
const requireAuth = auth;

module.exports = {
  auth,
  authorize,
  requireAdmin,
  requireManager,
  requireAuth
};