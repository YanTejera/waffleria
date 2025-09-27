const express = require('express');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

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

    // Filtro de búsqueda por texto
    if (buscar) {
      filtros.$text = { $search: buscar };
    }

    const productos = await Product.find(filtros)
      .sort(buscar ? { score: { $meta: 'textScore' } } : { popularidad: -1, nombre: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filtros);

    // Agregar información de inventario si es necesario
    const productosConInventario = await Promise.all(
      productos.map(async (producto) => {
        const inventory = await Inventory.findOne({ producto: producto._id });
        return {
          ...producto.toObject(),
          inventario: inventory ? {
            cantidadActual: inventory.cantidadActual,
            cantidadMinima: inventory.cantidadMinima,
            alertaBajoStock: inventory.alertaBajoStock
          } : null
        };
      })
    );

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
    const productos = await Product.find({
      categoria,
      disponible: true
    }).sort({ popularidad: -1, nombre: 1 });

    res.json({ productos });

  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener un producto específico
router.get('/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Obtener información de inventario
    const inventory = await Inventory.findOne({ producto: producto._id });

    res.json({
      producto: {
        ...producto.toObject(),
        inventario: inventory ? {
          cantidadActual: inventory.cantidadActual,
          cantidadMinima: inventory.cantidadMinima,
          alertaBajoStock: inventory.alertaBajoStock,
          unidadMedida: inventory.unidadMedida
        } : null
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
    const existeProducto = await Product.findOne({ nombre: { $regex: new RegExp(nombre, 'i') } });
    if (existeProducto) {
      return res.status(400).json({ message: 'Ya existe un producto con ese nombre.' });
    }

    const nuevoProducto = new Product({
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
      tiempoPreparacion
    });

    await nuevoProducto.save();

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

    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      actualizaciones,
      { new: true, runValidators: true }
    );

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
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    producto.disponible = !producto.disponible;
    await producto.save();

    res.json({
      message: `Producto ${producto.disponible ? 'activado' : 'desactivado'} exitosamente.`,
      producto
    });

  } catch (error) {
    console.error('Error cambiando disponibilidad:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Eliminar producto
router.delete('/:id', auth, requireManager, async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Verificar si hay inventario asociado
    const inventory = await Inventory.findOne({ producto: req.params.id });
    if (inventory) {
      return res.status(400).json({
        message: 'No se puede eliminar el producto porque tiene inventario asociado.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

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

    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { popularidad: incremento } },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json({
      message: 'Popularidad actualizada.',
      popularidad: producto.popularidad
    });

  } catch (error) {
    console.error('Error actualizando popularidad:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener menú completo organizado por categorías
router.get('/menu/completo', async (req, res) => {
  try {
    const menu = await Product.aggregate([
      { $match: { disponible: true } },
      {
        $group: {
          _id: '$categoria',
          productos: {
            $push: {
              _id: '$_id',
              nombre: '$nombre',
              tipo: '$tipo',
              precioVenta: '$precioVenta',
              descripcion: '$descripcion',
              imagen: '$imagen',
              tiempoPreparacion: '$tiempoPreparacion',
              popularidad: '$popularidad'
            }
          }
        }
      },
      {
        $project: {
          categoria: '$_id',
          productos: {
            $sortArray: {
              input: '$productos',
              sortBy: { popularidad: -1, nombre: 1 }
            }
          }
        }
      },
      { $sort: { categoria: 1 } }
    ]);

    res.json({ menu });

  } catch (error) {
    console.error('Error obteniendo menú completo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;