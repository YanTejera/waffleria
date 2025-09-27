const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const CashRegister = require('../models/CashRegister');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las órdenes
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      estado,
      fechaInicio,
      fechaFin,
      cajero,
      metodoPago
    } = req.query;

    // Construir filtros
    const filtros = {};
    if (estado) filtros.estado = estado;
    if (cajero) filtros.cajero = cajero;
    if (metodoPago) filtros.metodoPago = metodoPago;

    // Filtro de fechas
    if (fechaInicio || fechaFin) {
      filtros.fechaCreacion = {};
      if (fechaInicio) filtros.fechaCreacion.$gte = new Date(fechaInicio);
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        filtros.fechaCreacion.$lte = fechaFinDate;
      }
    }

    const ordenes = await Order.find(filtros)
      .populate('cajero', 'nombre')
      .populate('items.producto', 'nombre tipo precio')
      .populate('items.personalizacion.waffleBase', 'nombre precio')
      .populate('items.personalizacion.helados.helado', 'nombre precio')
      .populate('items.personalizacion.toppings.topping', 'nombre precio')
      .sort({ fechaCreacion: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filtros);

    res.json({
      ordenes,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener una orden específica
router.get('/:id', auth, async (req, res) => {
  try {
    const orden = await Order.findById(req.params.id)
      .populate('cajero', 'nombre email')
      .populate('items.producto', 'nombre tipo precio categoria')
      .populate('items.personalizacion.waffleBase', 'nombre precio')
      .populate('items.personalizacion.helados.helado', 'nombre precio')
      .populate('items.personalizacion.toppings.topping', 'nombre precio');

    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    res.json({ orden });

  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Crear nueva orden
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      cliente = {},
      metodoPago,
      descuentos = { porcentaje: 0, monto: 0, motivo: '' },
      propina = 0,
      observaciones = '',
      facturaFisica = { requerida: false }
    } = req.body;

    // Validar datos requeridos
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'La orden debe tener al menos un item.' });
    }

    if (!metodoPago) {
      return res.status(400).json({ message: 'Método de pago es requerido.' });
    }

    // Procesar items y validar disponibilidad
    const itemsProcesados = [];
    let subtotalTotal = 0;

    for (const item of items) {
      const { productoId, cantidad, personalizacion = {} } = item;

      // Verificar producto base
      const producto = await Product.findById(productoId);
      if (!producto || !producto.disponible) {
        return res.status(400).json({
          message: `Producto ${producto?.nombre || productoId} no está disponible.`
        });
      }

      let precioItem = producto.precio;
      let subtotalItem = precioItem * cantidad;

      // Si es un waffle personalizado, calcular precio total
      if (producto.tipo === 'waffle_base' && personalizacion) {
        // Agregar precio de helados
        if (personalizacion.helados && personalizacion.helados.length > 0) {
          for (const heladoItem of personalizacion.helados) {
            const helado = await Product.findById(heladoItem.helado);
            if (helado && helado.disponible) {
              precioItem += helado.precio * (heladoItem.cantidad || 1);
            }
          }
        }

        // Agregar precio de toppings
        if (personalizacion.toppings && personalizacion.toppings.length > 0) {
          for (const toppingItem of personalizacion.toppings) {
            const topping = await Product.findById(toppingItem.topping);
            if (topping && topping.disponible) {
              precioItem += topping.precio * (toppingItem.cantidad || 1);
            }
          }
        }

        subtotalItem = precioItem * cantidad;
      }

      itemsProcesados.push({
        producto: productoId,
        cantidad,
        precioUnitario: precioItem,
        subtotal: subtotalItem,
        personalizacion
      });

      subtotalTotal += subtotalItem;

      // Actualizar popularidad del producto
      await Product.findByIdAndUpdate(productoId, {
        $inc: { popularidad: cantidad }
      });
    }

    // Crear la orden
    const nuevaOrden = new Order({
      items: itemsProcesados,
      cliente,
      subtotal: subtotalTotal,
      descuentos,
      propina,
      metodoPago,
      cajero: req.user._id,
      observaciones,
      facturaFisica
    });

    await nuevaOrden.save();

    // Poblar la orden creada para retornar información completa
    await nuevaOrden.populate([
      { path: 'cajero', select: 'nombre' },
      { path: 'items.producto', select: 'nombre tipo precio' },
      { path: 'items.personalizacion.waffleBase', select: 'nombre precio' },
      { path: 'items.personalizacion.helados.helado', select: 'nombre precio' },
      { path: 'items.personalizacion.toppings.topping', select: 'nombre precio' }
    ]);

    // Registrar en la caja registradora
    const cajaAbierta = await CashRegister.findOne({
      cajero: req.user._id,
      estado: 'abierta'
    });

    if (cajaAbierta) {
      cajaAbierta.registrarTransaccion({
        tipo: 'venta',
        monto: nuevaOrden.total,
        metodoPago,
        orden: nuevaOrden._id,
        descripcion: `Orden #${nuevaOrden.numeroOrden}`
      });

      await cajaAbierta.save();
    }

    res.status(201).json({
      message: 'Orden creada exitosamente.',
      orden: nuevaOrden
    });

  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Actualizar estado de orden
router.patch('/:id/estado', auth, async (req, res) => {
  try {
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        message: `Estado debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    const orden = await Order.findById(req.params.id);
    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    // Si se está entregando, establecer fecha de entrega
    if (estado === 'entregado' && orden.estado !== 'entregado') {
      orden.fechaEntrega = new Date();
    }

    orden.estado = estado;
    await orden.save();

    await orden.populate([
      { path: 'cajero', select: 'nombre' },
      { path: 'items.producto', select: 'nombre tipo precio' }
    ]);

    res.json({
      message: 'Estado de orden actualizado exitosamente.',
      orden
    });

  } catch (error) {
    console.error('Error actualizando estado de orden:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Cancelar orden
router.patch('/:id/cancelar', auth, async (req, res) => {
  try {
    const { motivo } = req.body;

    const orden = await Order.findById(req.params.id);
    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    if (orden.estado === 'cancelado') {
      return res.status(400).json({ message: 'La orden ya está cancelada.' });
    }

    if (orden.estado === 'entregado') {
      return res.status(400).json({ message: 'No se puede cancelar una orden entregada.' });
    }

    orden.estado = 'cancelado';
    orden.observaciones = motivo ? `CANCELADA: ${motivo}` : 'CANCELADA';

    await orden.save();

    // Si hay caja registradora abierta, registrar devolución
    const cajaAbierta = await CashRegister.findOne({
      cajero: req.user._id,
      estado: 'abierta'
    });

    if (cajaAbierta) {
      cajaAbierta.registrarTransaccion({
        tipo: 'devolucion',
        monto: orden.total,
        metodoPago: orden.metodoPago,
        orden: orden._id,
        descripcion: `Cancelación orden #${orden.numeroOrden}: ${motivo || 'Sin motivo'}`
      });

      await cajaAbierta.save();
    }

    res.json({
      message: 'Orden cancelada exitosamente.',
      orden
    });

  } catch (error) {
    console.error('Error cancelando orden:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener órdenes pendientes/en preparación
router.get('/cocina/pendientes', auth, async (req, res) => {
  try {
    const ordenesPendientes = await Order.find({
      estado: { $in: ['pendiente', 'en_preparacion'] }
    })
      .populate('items.producto', 'nombre tiempoPreparacion')
      .populate('items.personalizacion.waffleBase', 'nombre')
      .populate('items.personalizacion.helados.helado', 'nombre')
      .populate('items.personalizacion.toppings.topping', 'nombre')
      .select('numeroOrden items cliente.nombre cliente.mesa estado fechaCreacion tiempoEstimado observaciones')
      .sort({ fechaCreacion: 1 });

    res.json({ ordenes: ordenesPendientes });

  } catch (error) {
    console.error('Error obteniendo órdenes pendientes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Estadísticas rápidas de órdenes del día
router.get('/estadisticas/hoy', auth, async (req, res) => {
  try {
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

    const estadisticas = await Order.aggregate([
      {
        $match: {
          fechaCreacion: { $gte: inicioHoy, $lt: finHoy }
        }
      },
      {
        $group: {
          _id: null,
          totalOrdenes: { $sum: 1 },
          totalVentas: { $sum: '$total' },
          ordenesEntregadas: {
            $sum: { $cond: [{ $eq: ['$estado', 'entregado'] }, 1, 0] }
          },
          ordenesCanceladas: {
            $sum: { $cond: [{ $eq: ['$estado', 'cancelado'] }, 1, 0] }
          },
          ordenesPendientes: {
            $sum: { $cond: [{ $in: ['$estado', ['pendiente', 'en_preparacion', 'listo']] }, 1, 0] }
          }
        }
      }
    ]);

    const resultado = estadisticas[0] || {
      totalOrdenes: 0,
      totalVentas: 0,
      ordenesEntregadas: 0,
      ordenesCanceladas: 0,
      ordenesPendientes: 0
    };

    res.json({ estadisticas: resultado });

  } catch (error) {
    console.error('Error obteniendo estadísticas del día:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener últimas órdenes
router.get('/recientes/ultimas', auth, async (req, res) => {
  try {
    const { limite = 10 } = req.query;

    const ordenesRecientes = await Order.find()
      .populate('cajero', 'nombre')
      .populate('items.producto', 'nombre')
      .select('numeroOrden total estado fechaCreacion cajero cliente metodoPago')
      .sort({ fechaCreacion: -1 })
      .limit(parseInt(limite));

    res.json({ ordenes: ordenesRecientes });

  } catch (error) {
    console.error('Error obteniendo órdenes recientes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;