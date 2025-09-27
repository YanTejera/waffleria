const express = require('express');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

// Obtener inventario completo
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      alertaBajoStock,
      categoria,
      buscar
    } = req.query;

    // Construir filtros para la agregación
    const matchStage = {};
    if (alertaBajoStock !== undefined) {
      matchStage.alertaBajoStock = alertaBajoStock === 'true';
    }

    // Pipeline de agregación para unir con productos
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'products',
          localField: 'producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: '$productoInfo' },
      {
        $match: {
          ...(categoria && { 'productoInfo.categoria': categoria }),
          ...(buscar && {
            $or: [
              { 'productoInfo.nombre': { $regex: buscar, $options: 'i' } },
              { lote: { $regex: buscar, $options: 'i' } }
            ]
          })
        }
      },
      {
        $project: {
          producto: '$productoInfo',
          cantidadActual: 1,
          cantidadMinima: 1,
          cantidadMaxima: 1,
          unidadMedida: 1,
          costoUnitario: 1,
          proveedor: 1,
          fechaVencimiento: 1,
          lote: 1,
          ubicacion: 1,
          alertaBajoStock: 1,
          ultimaActualizacion: 1,
          valorTotal: { $multiply: ['$cantidadActual', '$costoUnitario'] }
        }
      },
      { $sort: { alertaBajoStock: -1, 'producto.nombre': 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ];

    const inventario = await Inventory.aggregate(pipeline);

    // Contar total de documentos
    const countPipeline = [...pipeline];
    countPipeline.pop(); // Remover limit
    countPipeline.pop(); // Remover skip
    countPipeline.push({ $count: 'total' });

    const countResult = await Inventory.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    res.json({
      inventario,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error obteniendo inventario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener productos con bajo stock
router.get('/bajo-stock', auth, async (req, res) => {
  try {
    const inventarioBajoStock = await Inventory.find({ alertaBajoStock: true })
      .populate('producto', 'nombre tipo categoria precio')
      .sort({ cantidadActual: 1 });

    res.json({ inventarioBajoStock });

  } catch (error) {
    console.error('Error obteniendo productos con bajo stock:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Crear entrada de inventario para un producto
router.post('/', auth, requireManager, async (req, res) => {
  try {
    const {
      productoId,
      cantidadActual,
      cantidadMinima = 10,
      cantidadMaxima = 100,
      unidadMedida = 'unidades',
      costoUnitario,
      proveedor,
      fechaVencimiento,
      lote,
      ubicacion
    } = req.body;

    // Validar que el producto existe
    const producto = await Product.findById(productoId);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Verificar que no existe ya un inventario para este producto
    const inventarioExistente = await Inventory.findOne({ producto: productoId });
    if (inventarioExistente) {
      return res.status(400).json({
        message: 'Ya existe una entrada de inventario para este producto.'
      });
    }

    const nuevoInventario = new Inventory({
      producto: productoId,
      cantidadActual,
      cantidadMinima,
      cantidadMaxima,
      unidadMedida,
      costoUnitario,
      proveedor,
      fechaVencimiento,
      lote,
      ubicacion,
      ultimaActualizacion: {
        fecha: new Date(),
        usuario: req.user._id,
        tipoMovimiento: 'entrada'
      }
    });

    await nuevoInventario.save();
    await nuevoInventario.populate('producto', 'nombre tipo categoria');

    res.status(201).json({
      message: 'Inventario creado exitosamente.',
      inventario: nuevoInventario
    });

  } catch (error) {
    console.error('Error creando inventario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Actualizar inventario
router.put('/:id', auth, requireManager, async (req, res) => {
  try {
    const actualizaciones = req.body;
    delete actualizaciones._id;

    // Actualizar información de última actualización
    actualizaciones.ultimaActualizacion = {
      fecha: new Date(),
      usuario: req.user._id,
      tipoMovimiento: 'ajuste'
    };

    const inventario = await Inventory.findByIdAndUpdate(
      req.params.id,
      actualizaciones,
      { new: true, runValidators: true }
    ).populate('producto', 'nombre tipo categoria');

    if (!inventario) {
      return res.status(404).json({ message: 'Inventario no encontrado.' });
    }

    res.json({
      message: 'Inventario actualizado exitosamente.',
      inventario
    });

  } catch (error) {
    console.error('Error actualizando inventario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Registrar movimiento de inventario
router.post('/:id/movimiento', auth, async (req, res) => {
  try {
    const { cantidad, tipo, observaciones = '' } = req.body;

    if (!cantidad || !tipo) {
      return res.status(400).json({ message: 'Cantidad y tipo son requeridos.' });
    }

    const tiposValidos = ['entrada', 'salida', 'ajuste', 'merma'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        message: `Tipo debe ser uno de: ${tiposValidos.join(', ')}`
      });
    }

    const inventario = await Inventory.findById(req.params.id)
      .populate('producto', 'nombre tipo categoria');

    if (!inventario) {
      return res.status(404).json({ message: 'Inventario no encontrado.' });
    }

    const cantidadAnterior = inventario.cantidadActual;

    // Registrar movimiento usando el método del modelo
    inventario.registrarMovimiento(cantidad, tipo, req.user._id);

    // Validar que no quede cantidad negativa
    if (inventario.cantidadActual < 0) {
      return res.status(400).json({
        message: 'La cantidad resultante no puede ser negativa.'
      });
    }

    await inventario.save();

    res.json({
      message: 'Movimiento registrado exitosamente.',
      inventario,
      movimiento: {
        cantidadAnterior,
        cantidadNueva: inventario.cantidadActual,
        cantidad,
        tipo,
        observaciones
      }
    });

  } catch (error) {
    console.error('Error registrando movimiento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener productos próximos a vencer
router.get('/proximos-vencer', auth, async (req, res) => {
  try {
    const { dias = 7 } = req.query;
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + parseInt(dias));

    const productosProximosVencer = await Inventory.find({
      fechaVencimiento: {
        $lte: fechaLimite,
        $gte: new Date()
      }
    })
      .populate('producto', 'nombre tipo categoria')
      .sort({ fechaVencimiento: 1 });

    res.json({ productosProximosVencer });

  } catch (error) {
    console.error('Error obteniendo productos próximos a vencer:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Reporte de valor total del inventario
router.get('/reporte/valor-total', auth, requireManager, async (req, res) => {
  try {
    const valorTotal = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          valorTotalInventario: {
            $sum: { $multiply: ['$cantidadActual', '$costoUnitario'] }
          },
          totalProductos: { $sum: 1 },
          productosConBajoStock: {
            $sum: { $cond: ['$alertaBajoStock', 1, 0] }
          }
        }
      }
    ]);

    const resultado = valorTotal[0] || {
      valorTotalInventario: 0,
      totalProductos: 0,
      productosConBajoStock: 0
    };

    res.json({ reporte: resultado });

  } catch (error) {
    console.error('Error generando reporte de valor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Eliminar entrada de inventario
router.delete('/:id', auth, requireManager, async (req, res) => {
  try {
    const inventario = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventario) {
      return res.status(404).json({ message: 'Inventario no encontrado.' });
    }

    res.json({ message: 'Inventario eliminado exitosamente.' });

  } catch (error) {
    console.error('Error eliminando inventario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;