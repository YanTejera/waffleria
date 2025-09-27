const express = require('express');
const User = require('../models/User');
const { auth, requireAdmin, requireManager } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los usuarios (solo admin y gerente)
router.get('/', auth, requireManager, async (req, res) => {
  try {
    const { page = 1, limit = 10, activo, rol } = req.query;

    const filtros = {};
    if (activo !== undefined) filtros.activo = activo === 'true';
    if (rol) filtros.rol = rol;

    const usuarios = await User.find(filtros)
      .select('-password')
      .sort({ fechaCreacion: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filtros);

    res.json({
      usuarios,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener un usuario específico
router.get('/:id', auth, requireManager, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ usuario });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Actualizar usuario
router.put('/:id', auth, requireManager, async (req, res) => {
  try {
    const { nombre, email, rol, telefono, activo } = req.body;
    const userId = req.params.id;

    // No permitir que un usuario se desactive a sí mismo
    if (userId === req.user._id.toString() && activo === false) {
      return res.status(400).json({ message: 'No puedes desactivar tu propia cuenta.' });
    }

    // Solo admin puede cambiar roles o activar/desactivar usuarios
    const actualizaciones = { nombre, telefono };
    if (req.user.rol === 'admin') {
      if (email) actualizaciones.email = email.toLowerCase();
      if (rol) actualizaciones.rol = rol;
      if (activo !== undefined) actualizaciones.activo = activo;
    }

    const usuario = await User.findByIdAndUpdate(
      userId,
      actualizaciones,
      { new: true, runValidators: true }
    ).select('-password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      message: 'Usuario actualizado exitosamente.',
      usuario
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El email ya está en uso.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // No permitir que un admin se elimine a sí mismo
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta.' });
    }

    const usuario = await User.findByIdAndDelete(userId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario eliminado exitosamente.' });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Activar/desactivar usuario (solo admin)
router.patch('/:id/toggle-status', auth, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // No permitir desactivar el propio usuario
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes cambiar el estado de tu propia cuenta.' });
    }

    const usuario = await User.findById(userId).select('-password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    usuario.activo = !usuario.activo;
    await usuario.save();

    res.json({
      message: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente.`,
      usuario
    });

  } catch (error) {
    console.error('Error cambiando estado usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Resetear contraseña (solo admin)
router.patch('/:id/reset-password', auth, requireAdmin, async (req, res) => {
  try {
    const { nuevaPassword } = req.body;
    const userId = req.params.id;

    if (!nuevaPassword || nuevaPassword.length < 6) {
      return res.status(400).json({
        message: 'La nueva contraseña es requerida y debe tener al menos 6 caracteres.'
      });
    }

    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    usuario.password = nuevaPassword;
    await usuario.save();

    res.json({ message: 'Contraseña restablecida exitosamente.' });

  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;