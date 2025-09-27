const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generar token JWT
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'waffleria-default-jwt-secret-key';
  return jwt.sign({ id: userId }, secret, { expiresIn: '24h' });
};

// Registrar nuevo usuario (solo admin)
router.post('/register', auth, async (req, res) => {
  try {
    // Solo admin puede crear usuarios
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores pueden crear usuarios.' });
    }

    const { nombre, email, password, rol, telefono } = req.body;

    // Validar datos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
    }

    // Verificar si el email ya existe
    const existeUsuario = await User.findOne({ email: email.toLowerCase() });
    if (existeUsuario) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email: email.toLowerCase(),
      password,
      rol: rol || 'cajero',
      telefono
    });

    await nuevoUsuario.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente.',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    // Usuarios de desarrollo en memoria (sin MongoDB)
    const devUsers = {
      'admin@waffleria.com': {
        id: '1',
        nombre: 'Administrador',
        email: 'admin@waffleria.com',
        rol: 'admin',
        password: 'admin123',
        activo: true
      },
      'gerente@waffleria.com': {
        id: '2',
        nombre: 'Gerente',
        email: 'gerente@waffleria.com',
        rol: 'gerente',
        password: 'gerente123',
        activo: true
      },
      'cajero@waffleria.com': {
        id: '3',
        nombre: 'Cajero',
        email: 'cajero@waffleria.com',
        rol: 'cajero',
        password: 'cajero123',
        activo: true
      }
    };

    // Buscar usuario en memoria
    const usuario = devUsers[email.toLowerCase()];
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Verificar si está activo
    if (!usuario.activo) {
      return res.status(401).json({ message: 'Usuario inactivo. Contacte al administrador.' });
    }

    // Verificar contraseña (comparación simple)
    if (usuario.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generar token
    const token = generateToken(usuario.id);

    res.json({
      message: 'Login exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        ultimoAcceso: new Date()
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener perfil del usuario actual
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      usuario: {
        id: req.user._id,
        nombre: req.user.nombre,
        email: req.user.email,
        rol: req.user.rol,
        telefono: req.user.telefono,
        fechaCreacion: req.user.fechaCreacion,
        ultimoAcceso: req.user.ultimoAcceso
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Cambiar contraseña
router.put('/change-password', auth, async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ message: 'Contraseña actual y nueva son requeridas.' });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    const usuario = await User.findById(req.user._id);

    // Verificar contraseña actual
    const passwordValida = await usuario.compararPassword(passwordActual);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
    }

    // Actualizar contraseña
    usuario.password = passwordNueva;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada exitosamente.' });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Verificar token válido
router.get('/verify-token', auth, (req, res) => {
  res.json({ valid: true, usuario: req.user });
});

// Logout (invalidar token - en el frontend)
router.post('/logout', auth, (req, res) => {
  // En una implementación más robusta, podrías mantener una lista de tokens inválidos
  res.json({ message: 'Logout exitoso.' });
});

module.exports = router;