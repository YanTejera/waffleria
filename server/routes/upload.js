const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Health check para uploads
router.get('/health', (req, res) => {
  res.json({
    message: 'Upload service is working',
    uploadsDir: uploadDir,
    dirExists: fs.existsSync(uploadDir)
  });
});

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: fileFilter
});

// Subir imagen de producto
router.post('/product-image', auth, (req, res) => {
  // Manejar errores de multer
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error de multer:', err);
      return res.status(400).json({
        message: 'Error al subir la imagen',
        error: err.message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
      }

      // Construir URL de la imagen
      const imageUrl = `/uploads/${req.file.filename}`;

      res.json({
        message: 'Imagen subida exitosamente',
        imageUrl: imageUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  });
});

// Eliminar imagen
router.delete('/product-image/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Imagen eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Imagen no encontrada' });
    }
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;