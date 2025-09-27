const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mockDB = require('../mockData');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      tipo,
      categoria,
      disponible,
      buscar
    } = req.query;

    // Construir filtros
    const filtros = {};
    if (tipo) filtros.tipo = tipo;
    if (categoria) filtros.categoria = categoria;
    if (disponible !== undefined) filtros.disponible = disponible === 'true';
    if (buscar) filtros.buscar = buscar;

    const allProducts = mockDB.findProducts(filtros);

    // Simular paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const productos = allProducts.slice(startIndex, endIndex);

    const total = allProducts.length;

    // Agregar información de inventario simulada
    const productosConInventario = productos.map(producto => ({
      ...producto,
      inventario: {
        cantidadActual: Math.floor(Math.random() * 100) + 50,
        cantidadMinima: 10,
        alertaBajoStock: false
      }
    }));

    res.json({
      productos: productosConInventario,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener productos por categoría específica
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    const productos = mockDB.findProducts({
      categoria,
      disponible: true
    });

    res.json({ productos });

  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener un producto específico
router.get('/:id', async (req, res) => {
  try {
    const producto = mockDB.findProductById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json({
      producto: {
        ...producto,
        inventario: {
          cantidadActual: Math.floor(Math.random() * 100) + 50,
          cantidadMinima: 10,
          alertaBajoStock: false,
          unidadMedida: 'unidades'
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Crear nuevo producto (solo gerente/admin)
router.post('/', auth, requireManager, async (req, res) => {
  try {
    const {
      nombre,
      tipo,
      precioCompra,
      precioVenta,
      descripcion,
      categoria,
      disponible = true,
      imagen = '',
      ingredientes = [],
      informacionNutricional = {},
      tiempoPreparacion = 5
    } = req.body;

    // Validar datos requeridos
    if (!nombre || !tipo || precioCompra === undefined || precioVenta === undefined || !categoria) {
      return res.status(400).json({
        message: 'Nombre, tipo, precio de compra, precio de venta y categoría son requeridos.'
      });
    }

    // Verificar que no exista un producto con el mismo nombre
    const existeProducto = mockDB.findProductByName(nombre);
    if (existeProducto) {
      return res.status(400).json({ message: 'Ya existe un producto con ese nombre.' });
    }

    const nuevoProducto = mockDB.createProduct({
      nombre,
      tipo,
      precioCompra,
      precioVenta,
      descripcion,
      categoria,
      disponible,
      imagen,
      ingredientes,
      informacionNutricional,
      tiempoPreparacion,
      popularidad: 0
    });

    res.status(201).json({
      message: 'Producto creado exitosamente.',
      producto: nuevoProducto
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Actualizar producto
router.put('/:id', auth, requireManager, async (req, res) => {
  try {
    const actualizaciones = req.body;
    delete actualizaciones._id; // Evitar actualizar el ID

    const producto = mockDB.updateProduct(req.params.id, actualizaciones);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json({
      message: 'Producto actualizado exitosamente.',
      producto
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Cambiar disponibilidad del producto
router.patch('/:id/toggle-availability', auth, requireManager, async (req, res) => {
  try {
    const producto = mockDB.findProductById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const productoActualizado = mockDB.updateProduct(req.params.id, {
      disponible: !producto.disponible
    });

    res.json({
      message: `Producto ${productoActualizado.disponible ? 'activado' : 'desactivado'} exitosamente.`,
      producto: productoActualizado
    });

  } catch (error) {
    console.error('Error cambiando disponibilidad:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Eliminar producto
router.delete('/:id', auth, requireManager, async (req, res) => {
  try {
    const producto = mockDB.findProductById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const eliminado = mockDB.deleteProduct(req.params.id);

    if (!eliminado) {
      return res.status(500).json({ message: 'Error eliminando producto.' });
    }

    res.json({ message: 'Producto eliminado exitosamente.' });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Actualizar popularidad del producto
router.patch('/:id/popularity', async (req, res) => {
  try {
    const { incremento = 1 } = req.body;

    const producto = mockDB.findProductById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const productoActualizado = mockDB.updateProduct(req.params.id, {
      popularidad: producto.popularidad + incremento
    });

    res.json({
      message: 'Popularidad actualizada.',
      popularidad: productoActualizado.popularidad
    });

  } catch (error) {
    console.error('Error actualizando popularidad:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener menú completo organizado por categorías
router.get('/menu/completo', async (req, res) => {
  try {
    const productosDisponibles = mockDB.findProducts({ disponible: true });

    // Agrupar por categoría
    const menu = {};
    productosDisponibles.forEach(producto => {
      if (!menu[producto.categoria]) {
        menu[producto.categoria] = [];
      }
      menu[producto.categoria].push({
        _id: producto._id,
        nombre: producto.nombre,
        tipo: producto.tipo,
        precioVenta: producto.precioVenta,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        tiempoPreparacion: producto.tiempoPreparacion,
        popularidad: producto.popularidad
      });
    });

    // Ordenar productos dentro de cada categoría
    Object.keys(menu).forEach(categoria => {
      menu[categoria].sort((a, b) => {
        if (b.popularidad !== a.popularidad) {
          return b.popularidad - a.popularidad;
        }
        return a.nombre.localeCompare(b.nombre);
      });
    });

    // Convertir a formato esperado
    const menuArray = Object.keys(menu).sort().map(categoria => ({
      categoria,
      productos: menu[categoria]
    }));

    res.json({ menu: menuArray });

  } catch (error) {
    console.error('Error obteniendo menú completo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Subir imagen de producto
router.post('/upload-image', auth, requireManager, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Imagen subida exitosamente.',
      imageUrl,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Eliminar imagen de producto
router.delete('/upload-image/:filename', auth, requireManager, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Imagen eliminada exitosamente.' });
    } else {
      res.status(404).json({ message: 'Archivo no encontrado.' });
    }

  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;