const jwt = require('jsonwebtoken');
const mockDB = require('../mockData');

const JWT_SECRET = 'waffleria_dev_secret_key_2024';

// Middleware de autenticación
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = mockDB.findUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Token inválido.' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Middleware para requerir rol de gerente o admin
const requireManager = (req, res, next) => {
  if (!req.user || (req.user.rol !== 'gerente' && req.user.rol !== 'admin')) {
    return res.status(403).json({
      message: 'Acceso denegado. Se requieren permisos de gerente o administrador.'
    });
  }
  next();
};

// Middleware para requerir rol de admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};

module.exports = {
  auth,
  requireManager,
  requireAdmin,
  JWT_SECRET
};