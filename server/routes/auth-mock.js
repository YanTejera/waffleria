const express = require('express');
const jwt = require('jsonwebtoken');
const mockDB = require('../mockData');
const { JWT_SECRET } = require('../middleware/auth-mock');

const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son requeridos.'
      });
    }

    // Buscar usuario por email
    const usuario = mockDB.findUserByEmail(email);

    if (!usuario) {
      return res.status(401).json({
        message: 'Credenciales inválidas.'
      });
    }

    // Verificar contraseña (en desarrollo, aceptamos cualquier contraseña)
    // En producción aquí iría bcrypt.compare(password, usuario.password)
    const passwordValida = password === 'admin123' ||
                          password === 'gerente123' ||
                          password === 'cajero123';

    if (!passwordValida) {
      return res.status(401).json({
        message: 'Credenciales inválidas.'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Actualizar último acceso
    const ahora = new Date();
    usuario.ultimoAcceso = ahora;

    // Respuesta exitosa
    res.json({
      message: 'Login exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        ultimoAcceso: usuario.ultimoAcceso
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error interno del servidor.'
    });
  }
});

// Ruta para obtener información del usuario actual
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token requerido.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = mockDB.findUserById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        ultimoAcceso: usuario.ultimoAcceso
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(401).json({ message: 'Token inválido.' });
  }
});

// Ruta de logout (opcional, principalmente para limpieza del lado del cliente)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso.' });
});

module.exports = router;