const express = require('express');
const CashRegister = require('../models/CashRegister');
const Order = require('../models/Order');
const { auth, requireManager } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Abrir caja
router.post('/abrir', auth, async (req, res) => {
  try {
    const { montoInicialEfectivo = 0 } = req.body;

    // Verificar que no haya una caja abierta para este cajero
    const cajaAbierta = await CashRegister.findOne({
      cajero: req.user._id,
      estado: 'abierta'
    });

    if (cajaAbierta) {
      return res.status(400).json({
        message: 'Ya tienes una caja abierta. Debes cerrarla antes de abrir una nueva.'
      });
    }

    const nuevaCaja = new CashRegister({
      cajero: req.user._id,
      montoInicialEfectivo,
      fechaApertura: new Date()
    });

    // Registrar transacción de apertura
    nuevaCaja.registrarTransaccion({
      tipo: 'apertura',
      monto: montoInicialEfectivo,
      metodoPago: 'efectivo',
      descripcion: `Apertura de caja - Monto inicial: $${montoInicialEfectivo}`
    });

    await nuevaCaja.save();
    await nuevaCaja.populate('cajero', 'nombre email');

    res.status(201).json({
      message: 'Caja abierta exitosamente.',
      caja: nuevaCaja
    });

  } catch (error) {
    console.error('Error abriendo caja:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener caja actual del cajero
router.get('/actual', auth, async (req, res) => {
  try {
    const cajaActual = await CashRegister.findOne({
      cajero: req.user._id,
      estado: 'abierta'
    }).populate('cajero', 'nombre email');

    if (!cajaActual) {
      return res.status(404).json({ message: 'No tienes una caja abierta actualmente.' });
    }

    // Calcular totales actualizados
    const efectivoEsperado = cajaActual.calcularEfectivoEsperado();

    res.json({
      caja: {
        ...cajaActual.toObject(),
        efectivoEsperado,
        tiempoAbierta: moment().diff(moment(cajaActual.fechaApertura), 'hours', true)
      }
    });

  } catch (error) {
    console.error('Error obteniendo caja actual:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Registrar transacción manual
router.post('/:id/transaccion', auth, async (req, res) => {
  try {
    const { tipo, monto, metodoPago, descripcion } = req.body;

    const tiposPermitidos = ['ingreso_manual', 'retiro_manual'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        message: `Tipo debe ser uno de: ${tiposPermitidos.join(', ')}`
      });
    }

    if (!monto || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser mayor a cero.' });
    }

    const caja = await CashRegister.findById(req.params.id);
    if (!caja) {
      return res.status(404).json({ message: 'Caja no encontrada.' });
    }

    if (caja.estado !== 'abierta') {
      return res.status(400).json({ message: 'La caja debe estar abierta para registrar transacciones.' });
    }

    if (caja.cajero.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No puedes registrar transacciones en una caja que no es tuya.' });
    }

    caja.registrarTransaccion({
      tipo,
      monto,
      metodoPago: metodoPago || 'efectivo',
      descripcion: descripcion || `${tipo.replace('_', ' ')} manual`
    });

    await caja.save();

    res.json({
      message: 'Transacción registrada exitosamente.',
      caja,
      efectivoEsperado: caja.calcularEfectivoEsperado()
    });

  } catch (error) {
    console.error('Error registrando transacción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Cerrar caja
router.post('/:id/cerrar', auth, async (req, res) => {
  try {
    const { montoFinalContado, observaciones = '' } = req.body;

    if (montoFinalContado === undefined || montoFinalContado < 0) {
      return res.status(400).json({ message: 'Debe proporcionar el monto final contado.' });
    }

    const caja = await CashRegister.findById(req.params.id);
    if (!caja) {
      return res.status(404).json({ message: 'Caja no encontrada.' });
    }

    if (caja.estado !== 'abierta') {
      return res.status(400).json({ message: 'La caja ya está cerrada.' });
    }

    if (caja.cajero.toString() !== req.user._id.toString() && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No puedes cerrar una caja que no es tuya.' });
    }

    // Cerrar la caja
    const resultadoCierre = caja.cerrarCaja(montoFinalContado, observaciones);

    // Registrar transacción de cierre
    caja.registrarTransaccion({
      tipo: 'cierre',
      monto: montoFinalContado,
      metodoPago: 'efectivo',
      descripcion: `Cierre de caja - Efectivo contado: $${montoFinalContado}. ${observaciones}`
    });

    await caja.save();
    await caja.populate('cajero', 'nombre email');

    res.json({
      message: 'Caja cerrada exitosamente.',
      caja,
      resumenCierre: {
        ...resultadoCierre,
        tiempoTotal: moment(caja.fechaCierre).diff(moment(caja.fechaApertura), 'hours', true)
      }
    });

  } catch (error) {
    console.error('Error cerrando caja:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener historial de cajas
router.get('/historial', auth, requireManager, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      cajero,
      fechaInicio,
      fechaFin,
      estado
    } = req.query;

    const filtros = {};
    if (cajero) filtros.cajero = cajero;
    if (estado) filtros.estado = estado;

    if (fechaInicio || fechaFin) {
      filtros.fechaApertura = {};
      if (fechaInicio) filtros.fechaApertura.$gte = new Date(fechaInicio);
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        filtros.fechaApertura.$lte = fechaFinDate;
      }
    }

    const cajas = await CashRegister.find(filtros)
      .populate('cajero', 'nombre email')
      .sort({ fechaApertura: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CashRegister.countDocuments(filtros);

    res.json({
      cajas,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error obteniendo historial de cajas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener detalles de una caja específica
router.get('/:id', auth, async (req, res) => {
  try {
    const caja = await CashRegister.findById(req.params.id)
      .populate('cajero', 'nombre email')
      .populate('transacciones.orden', 'numeroOrden');

    if (!caja) {
      return res.status(404).json({ message: 'Caja no encontrada.' });
    }

    // Solo permitir ver su propia caja a menos que sea gerente/admin
    if (caja.cajero._id.toString() !== req.user._id.toString() && !['admin', 'gerente'].includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para ver esta caja.' });
    }

    const efectivoEsperado = caja.calcularEfectivoEsperado();

    res.json({
      caja: {
        ...caja.toObject(),
        efectivoEsperado
      }
    });

  } catch (error) {
    console.error('Error obteniendo detalles de caja:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Reporte de ventas por método de pago
router.get('/:id/reporte-metodos-pago', auth, async (req, res) => {
  try {
    const caja = await CashRegister.findById(req.params.id);

    if (!caja) {
      return res.status(404).json({ message: 'Caja no encontrada.' });
    }

    if (caja.cajero.toString() !== req.user._id.toString() && !['admin', 'gerente'].includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para ver esta caja.' });
    }

    const reporte = {
      ventasPorMetodoPago: caja.resumenVentas.ventasPorMetodoPago,
      totalVentas: caja.resumenVentas.totalVentas,
      cantidadTransacciones: caja.resumenVentas.cantidadTransacciones,
      propinaTotal: caja.resumenVentas.propinaTotal,
      ticketPromedio: caja.resumenVentas.cantidadTransacciones > 0
        ? caja.resumenVentas.totalVentas / caja.resumenVentas.cantidadTransacciones
        : 0
    };

    res.json({ reporte });

  } catch (error) {
    console.error('Error generando reporte de métodos de pago:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Estadísticas del día para todos los cajeros (solo gerente/admin)
router.get('/estadisticas/dia', auth, requireManager, async (req, res) => {
  try {
    const { fecha = new Date().toISOString().split('T')[0] } = req.query;

    const inicioFecha = new Date(fecha);
    const finFecha = new Date(fecha);
    finFecha.setDate(finFecha.getDate() + 1);

    const estadisticas = await CashRegister.aggregate([
      {
        $match: {
          fechaApertura: { $gte: inicioFecha, $lt: finFecha }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'cajero',
          foreignField: '_id',
          as: 'cajeroInfo'
        }
      },
      { $unwind: '$cajeroInfo' },
      {
        $group: {
          _id: null,
          totalCajas: { $sum: 1 },
          cajasAbiertas: { $sum: { $cond: [{ $eq: ['$estado', 'abierta'] }, 1, 0] } },
          cajasCerradas: { $sum: { $cond: [{ $eq: ['$estado', 'cerrada'] }, 1, 0] } },
          totalVentasEfectivo: { $sum: '$resumenVentas.ventasPorMetodoPago.efectivo' },
          totalVentasTarjeta: {
            $sum: {
              $add: [
                '$resumenVentas.ventasPorMetodoPago.tarjeta_credito',
                '$resumenVentas.ventasPorMetodoPago.tarjeta_debito'
              ]
            }
          },
          totalVentasDigitales: {
            $sum: {
              $add: [
                '$resumenVentas.ventasPorMetodoPago.transferencia',
                '$resumenVentas.ventasPorMetodoPago.pse',
                '$resumenVentas.ventasPorMetodoPago.nequi',
                '$resumenVentas.ventasPorMetodoPago.daviplata'
              ]
            }
          },
          totalVentas: { $sum: '$resumenVentas.totalVentas' },
          totalTransacciones: { $sum: '$resumenVentas.cantidadTransacciones' },
          totalPropinas: { $sum: '$resumenVentas.propinaTotal' },
          diferenciasTotal: { $sum: '$diferenciaCaja' }
        }
      }
    ]);

    const resultado = estadisticas[0] || {
      totalCajas: 0,
      cajasAbiertas: 0,
      cajasCerradas: 0,
      totalVentasEfectivo: 0,
      totalVentasTarjeta: 0,
      totalVentasDigitales: 0,
      totalVentas: 0,
      totalTransacciones: 0,
      totalPropinas: 0,
      diferenciasTotal: 0
    };

    res.json({ estadisticas: resultado, fecha });

  } catch (error) {
    console.error('Error obteniendo estadísticas del día:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;