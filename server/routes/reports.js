const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const CashRegister = require('../models/CashRegister');
const Inventory = require('../models/Inventory');
const { auth, requireManager } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Reporte de ventas por período
router.get('/ventas', auth, requireManager, async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin,
      cajero,
      metodoPago,
      agrupaPor = 'dia' // dia, semana, mes
    } = req.query;

    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: 'Fecha de inicio y fin son requeridas.'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    // Construir filtros
    const filtros = {
      fechaCreacion: { $gte: inicio, $lte: fin },
      estado: { $ne: 'cancelado' }
    };

    if (cajero) filtros.cajero = cajero;
    if (metodoPago) filtros.metodoPago = metodoPago;

    // Configurar agrupación por fecha
    let formatoFecha;
    let formatoDisplay;

    switch (agrupaPor) {
      case 'semana':
        formatoFecha = { $week: '$fechaCreacion' };
        formatoDisplay = { $year: '$fechaCreacion' };
        break;
      case 'mes':
        formatoFecha = { $month: '$fechaCreacion' };
        formatoDisplay = { $year: '$fechaCreacion' };
        break;
      default: // día
        formatoFecha = { $dateToString: { format: '%Y-%m-%d', date: '$fechaCreacion' } };
        formatoDisplay = formatoFecha;
    }

    const pipeline = [
      { $match: filtros },
      {
        $group: {
          _id: formatoFecha,
          fecha: { $first: formatoDisplay },
          totalVentas: { $sum: '$total' },
          cantidadOrdenes: { $sum: 1 },
          ticketPromedio: { $avg: '$total' },
          totalDescuentos: { $sum: '$descuentos.monto' },
          totalPropinas: { $sum: '$propina' },
          ventasPorMetodoPago: {
            $push: {
              metodoPago: '$metodoPago',
              monto: '$total'
            }
          }
        }
      },
      {
        $addFields: {
          ventasPorMetodoResumen: {
            $reduce: {
              input: '$ventasPorMetodoPago',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [{ k: '$$this.metodoPago', v: { $add: [{ $ifNull: [{ $getField: { field: '$$this.metodoPago', input: '$$value' } }, 0] }, '$$this.monto'] } }]
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const reporte = await Order.aggregate(pipeline);

    // Calcular totales generales
    const totales = {
      totalVentas: reporte.reduce((sum, item) => sum + item.totalVentas, 0),
      cantidadOrdenes: reporte.reduce((sum, item) => sum + item.cantidadOrdenes, 0),
      totalDescuentos: reporte.reduce((sum, item) => sum + item.totalDescuentos, 0),
      totalPropinas: reporte.reduce((sum, item) => sum + item.totalPropinas, 0)
    };

    totales.ticketPromedio = totales.cantidadOrdenes > 0 ? totales.totalVentas / totales.cantidadOrdenes : 0;

    res.json({
      reporte,
      totales,
      periodo: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        agrupaPor
      }
    });

  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Reporte de productos más vendidos
router.get('/productos-vendidos', auth, requireManager, async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin,
      limite = 20,
      categoria
    } = req.query;

    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: 'Fecha de inicio y fin son requeridas.'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          fechaCreacion: { $gte: inicio, $lte: fin },
          estado: { $ne: 'cancelado' }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.producto',
          foreignField: '_id',
          as: 'producto'
        }
      },
      { $unwind: '$producto' },
      {
        $match: {
          ...(categoria && { 'producto.categoria': categoria })
        }
      },
      {
        $group: {
          _id: '$items.producto',
          nombre: { $first: '$producto.nombre' },
          categoria: { $first: '$producto.categoria' },
          tipo: { $first: '$producto.tipo' },
          cantidadVendida: { $sum: '$items.cantidad' },
          ingresoTotal: { $sum: '$items.subtotal' },
          precioPromedio: { $avg: '$items.precioUnitario' },
          frecuenciaOrdenes: { $sum: 1 }
        }
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: parseInt(limite) }
    ];

    const productosVendidos = await Order.aggregate(pipeline);

    res.json({
      productos: productosVendidos,
      periodo: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

  } catch (error) {
    console.error('Error generando reporte de productos vendidos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Reporte de rendimiento de cajeros
router.get('/cajeros', auth, requireManager, async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin
    } = req.query;

    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: 'Fecha de inicio y fin son requeridas.'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          fechaCreacion: { $gte: inicio, $lte: fin },
          estado: { $ne: 'cancelado' }
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
          _id: '$cajero',
          nombreCajero: { $first: '$cajeroInfo.nombre' },
          totalVentas: { $sum: '$total' },
          cantidadOrdenes: { $sum: 1 },
          ticketPromedio: { $avg: '$total' },
          totalPropinas: { $sum: '$propina' },
          ordenesCanceladas: {
            $sum: { $cond: [{ $eq: ['$estado', 'cancelado'] }, 1, 0] }
          },
          tiempoPromedioEntrega: {
            $avg: {
              $subtract: ['$fechaEntrega', '$fechaCreacion']
            }
          }
        }
      },
      { $sort: { totalVentas: -1 } }
    ];

    const rendimientoCajeros = await Order.aggregate(pipeline);

    // Obtener información adicional de cajas registradoras
    const cajasInfo = await CashRegister.aggregate([
      {
        $match: {
          fechaApertura: { $gte: inicio, $lte: fin }
        }
      },
      {
        $group: {
          _id: '$cajero',
          totalDiferencias: { $sum: '$diferenciaCaja' },
          cajasAbiertas: { $sum: 1 }
        }
      }
    ]);

    // Combinar información
    const reporteFinal = rendimientoCajeros.map(cajero => {
      const infoAdicional = cajasInfo.find(info => info._id.toString() === cajero._id.toString());
      return {
        ...cajero,
        totalDiferencias: infoAdicional?.totalDiferencias || 0,
        cajasAbiertas: infoAdicional?.cajasAbiertas || 0,
        tiempoPromedioEntregaMinutos: cajero.tiempoPromedioEntrega ? Math.round(cajero.tiempoPromedioEntrega / (1000 * 60)) : 0
      };
    });

    res.json({
      cajeros: reporteFinal,
      periodo: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

  } catch (error) {
    console.error('Error generando reporte de cajeros:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Dashboard con métricas principales
router.get('/dashboard', auth, requireManager, async (req, res) => {
  try {
    const { periodo = '30' } = req.query; // días hacia atrás

    const fechaInicio = moment().subtract(parseInt(periodo), 'days').startOf('day').toDate();
    const fechaFin = moment().endOf('day').toDate();

    // Métricas principales
    const [
      ventasHoy,
      ventasSemana,
      ventasMes,
      productosPopulares,
      alertasInventario,
      cajasPendientesCierre
    ] = await Promise.all([
      // Ventas de hoy
      Order.aggregate([
        {
          $match: {
            fechaCreacion: {
              $gte: moment().startOf('day').toDate(),
              $lte: moment().endOf('day').toDate()
            },
            estado: { $ne: 'cancelado' }
          }
        },
        {
          $group: {
            _id: null,
            totalVentas: { $sum: '$total' },
            cantidadOrdenes: { $sum: 1 },
            ticketPromedio: { $avg: '$total' }
          }
        }
      ]),

      // Ventas de la semana
      Order.aggregate([
        {
          $match: {
            fechaCreacion: {
              $gte: moment().startOf('week').toDate(),
              $lte: moment().endOf('week').toDate()
            },
            estado: { $ne: 'cancelado' }
          }
        },
        {
          $group: {
            _id: null,
            totalVentas: { $sum: '$total' },
            cantidadOrdenes: { $sum: 1 }
          }
        }
      ]),

      // Ventas del mes
      Order.aggregate([
        {
          $match: {
            fechaCreacion: {
              $gte: moment().startOf('month').toDate(),
              $lte: moment().endOf('month').toDate()
            },
            estado: { $ne: 'cancelado' }
          }
        },
        {
          $group: {
            _id: null,
            totalVentas: { $sum: '$total' },
            cantidadOrdenes: { $sum: 1 }
          }
        }
      ]),

      // Top 5 productos más vendidos (último mes)
      Order.aggregate([
        {
          $match: {
            fechaCreacion: {
              $gte: moment().subtract(30, 'days').toDate(),
              $lte: fechaFin
            },
            estado: { $ne: 'cancelado' }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.producto',
            foreignField: '_id',
            as: 'producto'
          }
        },
        { $unwind: '$producto' },
        {
          $group: {
            _id: '$items.producto',
            nombre: { $first: '$producto.nombre' },
            cantidadVendida: { $sum: '$items.cantidad' },
            ingresoTotal: { $sum: '$items.subtotal' }
          }
        },
        { $sort: { cantidadVendida: -1 } },
        { $limit: 5 }
      ]),

      // Alertas de inventario
      Inventory.find({ alertaBajoStock: true })
        .populate('producto', 'nombre categoria')
        .limit(10),

      // Cajas pendientes de cierre
      CashRegister.find({ estado: 'abierta' })
        .populate('cajero', 'nombre')
        .select('cajero fechaApertura resumenVentas')
    ]);

    // Ventas por hora del día actual
    const ventasPorHora = await Order.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment().endOf('day').toDate()
          },
          estado: { $ne: 'cancelado' }
        }
      },
      {
        $group: {
          _id: { $hour: '$fechaCreacion' },
          totalVentas: { $sum: '$total' },
          cantidadOrdenes: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dashboard = {
      metricas: {
        hoy: ventasHoy[0] || { totalVentas: 0, cantidadOrdenes: 0, ticketPromedio: 0 },
        semana: ventasSemana[0] || { totalVentas: 0, cantidadOrdenes: 0 },
        mes: ventasMes[0] || { totalVentas: 0, cantidadOrdenes: 0 }
      },
      productosPopulares,
      alertasInventario: alertasInventario.map(item => ({
        producto: item.producto.nombre,
        categoria: item.producto.categoria,
        cantidadActual: item.cantidadActual,
        cantidadMinima: item.cantidadMinima
      })),
      cajasPendientesCierre: cajasPendientesCierre.map(caja => ({
        cajero: caja.cajero.nombre,
        fechaApertura: caja.fechaApertura,
        totalVentas: caja.resumenVentas.totalVentas,
        horasAbiertas: moment().diff(moment(caja.fechaApertura), 'hours', true)
      })),
      ventasPorHora: Array.from({ length: 24 }, (_, i) => {
        const ventaHora = ventasPorHora.find(v => v._id === i);
        return {
          hora: i,
          totalVentas: ventaHora?.totalVentas || 0,
          cantidadOrdenes: ventaHora?.cantidadOrdenes || 0
        };
      })
    };

    res.json({ dashboard });

  } catch (error) {
    console.error('Error generando dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Reporte de métodos de pago
router.get('/metodos-pago', auth, requireManager, async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin
    } = req.query;

    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: 'Fecha de inicio y fin son requeridas.'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const reporte = await Order.aggregate([
      {
        $match: {
          fechaCreacion: { $gte: inicio, $lte: fin },
          estado: { $ne: 'cancelado' }
        }
      },
      {
        $group: {
          _id: '$metodoPago',
          totalVentas: { $sum: '$total' },
          cantidadTransacciones: { $sum: 1 },
          ticketPromedio: { $avg: '$total' },
          totalPropinas: { $sum: '$propina' }
        }
      },
      { $sort: { totalVentas: -1 } }
    ]);

    const total = reporte.reduce((sum, item) => ({
      totalVentas: sum.totalVentas + item.totalVentas,
      cantidadTransacciones: sum.cantidadTransacciones + item.cantidadTransacciones,
      totalPropinas: sum.totalPropinas + item.totalPropinas
    }), { totalVentas: 0, cantidadTransacciones: 0, totalPropinas: 0 });

    // Calcular porcentajes
    const reporteConPorcentajes = reporte.map(item => ({
      ...item,
      porcentajeVentas: total.totalVentas > 0 ? (item.totalVentas / total.totalVentas * 100) : 0,
      porcentajeTransacciones: total.cantidadTransacciones > 0 ? (item.cantidadTransacciones / total.cantidadTransacciones * 100) : 0
    }));

    res.json({
      reporte: reporteConPorcentajes,
      totales: {
        ...total,
        ticketPromedio: total.cantidadTransacciones > 0 ? total.totalVentas / total.cantidadTransacciones : 0
      },
      periodo: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

  } catch (error) {
    console.error('Error generando reporte de métodos de pago:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Exportar datos para Excel/CSV
router.get('/exportar/ventas', auth, requireManager, async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin,
      formato = 'json'
    } = req.query;

    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: 'Fecha de inicio y fin son requeridas.'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const ordenes = await Order.find({
      fechaCreacion: { $gte: inicio, $lte: fin }
    })
      .populate('cajero', 'nombre')
      .populate('items.producto', 'nombre categoria')
      .select('numeroOrden fechaCreacion total metodoPago estado cajero cliente items descuentos propina observaciones')
      .sort({ fechaCreacion: -1 });

    // Transformar datos para exportación
    const datosExportacion = ordenes.map(orden => ({
      'Número de Orden': orden.numeroOrden,
      'Fecha': moment(orden.fechaCreacion).format('YYYY-MM-DD HH:mm:ss'),
      'Cajero': orden.cajero.nombre,
      'Cliente': orden.cliente?.nombre || 'Sin nombre',
      'Mesa': orden.cliente?.mesa || '',
      'Total': orden.total,
      'Método de Pago': orden.metodoPago,
      'Estado': orden.estado,
      'Descuento': orden.descuentos?.monto || 0,
      'Propina': orden.propina,
      'Items': orden.items.map(item => `${item.producto.nombre} x${item.cantidad}`).join('; '),
      'Observaciones': orden.observaciones || ''
    }));

    if (formato === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=ventas-${fechaInicio}-${fechaFin}.csv`);

      // Convertir a CSV básico
      const headers = Object.keys(datosExportacion[0] || {}).join(',');
      const rows = datosExportacion.map(row => Object.values(row).join(',')).join('\n');
      res.send(`${headers}\n${rows}`);
    } else {
      res.json({
        datos: datosExportacion,
        total: datosExportacion.length,
        periodo: { fechaInicio, fechaFin }
      });
    }

  } catch (error) {
    console.error('Error exportando ventas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;