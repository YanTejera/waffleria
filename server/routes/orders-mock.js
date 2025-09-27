const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Estadísticas del día
router.get('/estadisticas/hoy', auth, async (req, res) => {
  try {
    const estadisticasHoy = {
      fecha: new Date().toISOString().split('T')[0],
      totalVentas: 156780,
      cantidadOrdenes: 23,
      ticketPromedio: 6816,
      ventasPorHora: [
        { hora: '08:00', ventas: 15000, ordenes: 3 },
        { hora: '09:00', ventas: 28000, ordenes: 5 },
        { hora: '10:00', ventas: 42000, ordenes: 8 },
        { hora: '11:00', ventas: 65000, ordenes: 12 },
        { hora: '12:00', ventas: 89000, ordenes: 16 },
        { hora: '13:00', ventas: 95000, ordenes: 18 },
        { hora: '14:00', ventas: 78000, ordenes: 14 },
        { hora: '15:00', ventas: 56000, ordenes: 10 },
        { hora: '16:00', ventas: 67000, ordenes: 13 },
        { hora: '17:00', ventas: 72000, ordenes: 15 },
        { hora: '18:00', ventas: 81000, ordenes: 17 },
        { hora: '19:00', ventas: 73000, ordenes: 14 },
        { hora: '20:00', ventas: 48000, ordenes: 9 },
        { hora: '21:00', ventas: 32000, ordenes: 6 }
      ],
      metodosPane: {
        efectivo: 98500,
        tarjeta: 58280,
        porcentajes: {
          efectivo: 62.8,
          tarjeta: 37.2
        }
      },
      productosVendidos: [
        {
          producto: 'Waffle Clásico con Helado',
          cantidad: 45,
          ingresos: 180000
        },
        {
          producto: 'Hotdog Especial',
          cantidad: 38,
          ingresos: 190000
        },
        {
          producto: 'Coca Cola 350ml',
          cantidad: 67,
          ingresos: 134000
        }
      ]
    };

    res.json({
      success: true,
      estadisticas: estadisticasHoy
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas del día:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas del día'
    });
  }
});

// Órdenes recientes
router.get('/recientes/ultimas', auth, async (req, res) => {
  try {
    const { limite = '10' } = req.query;

    const ordenesRecientes = [
      {
        _id: '1',
        numeroOrden: 'ORD-2024-001',
        fecha: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
        total: 18500,
        estado: 'completada',
        metodoPago: 'efectivo',
        cajero: {
          nombre: 'María González',
          id: '3'
        },
        items: [
          {
            producto: 'Waffle Clásico con Helado',
            cantidad: 2,
            precio: 4000,
            subtotal: 8000
          },
          {
            producto: 'Hotdog Especial',
            cantidad: 1,
            precio: 5000,
            subtotal: 5000
          },
          {
            producto: 'Coca Cola 350ml',
            cantidad: 2,
            precio: 2000,
            subtotal: 4000
          },
          {
            producto: 'Papas Fritas',
            cantidad: 1,
            precio: 1500,
            subtotal: 1500
          }
        ]
      },
      {
        _id: '2',
        numeroOrden: 'ORD-2024-002',
        fecha: new Date(Date.now() - 25 * 60 * 1000), // 25 minutos atrás
        total: 12000,
        estado: 'completada',
        metodoPago: 'tarjeta',
        cajero: {
          nombre: 'Carlos Pérez',
          id: '3'
        },
        items: [
          {
            producto: 'Waffle con Frutas',
            cantidad: 1,
            precio: 6000,
            subtotal: 6000
          },
          {
            producto: 'Jugo Natural',
            cantidad: 2,
            precio: 3000,
            subtotal: 6000
          }
        ]
      },
      {
        _id: '3',
        numeroOrden: 'ORD-2024-003',
        fecha: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
        total: 8500,
        estado: 'completada',
        metodoPago: 'efectivo',
        cajero: {
          nombre: 'Ana López',
          id: '3'
        },
        items: [
          {
            producto: 'Hotdog Sencillo',
            cantidad: 1,
            precio: 3500,
            subtotal: 3500
          },
          {
            producto: 'Coca Cola 350ml',
            cantidad: 2,
            precio: 2000,
            subtotal: 4000
          },
          {
            producto: 'Helado Individual',
            cantidad: 1,
            precio: 1000,
            subtotal: 1000
          }
        ]
      },
      {
        _id: '4',
        numeroOrden: 'ORD-2024-004',
        fecha: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        total: 25000,
        estado: 'completada',
        metodoPago: 'tarjeta',
        cajero: {
          nombre: 'Luis Martínez',
          id: '3'
        },
        items: [
          {
            producto: 'Waffle Premium',
            cantidad: 2,
            precio: 8000,
            subtotal: 16000
          },
          {
            producto: 'Café Americano',
            cantidad: 2,
            precio: 2500,
            subtotal: 5000
          },
          {
            producto: 'Postre del Día',
            cantidad: 1,
            precio: 4000,
            subtotal: 4000
          }
        ]
      },
      {
        _id: '5',
        numeroOrden: 'ORD-2024-005',
        fecha: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 horas atrás
        total: 15500,
        estado: 'completada',
        metodoPago: 'efectivo',
        cajero: {
          nombre: 'Sandra Rivera',
          id: '3'
        },
        items: [
          {
            producto: 'Waffle Salado',
            cantidad: 1,
            precio: 7000,
            subtotal: 7000
          },
          {
            producto: 'Hotdog Especial',
            cantidad: 1,
            precio: 5000,
            subtotal: 5000
          },
          {
            producto: 'Bebida Energética',
            cantidad: 1,
            precio: 3500,
            subtotal: 3500
          }
        ]
      }
    ];

    // Limitar según el parámetro
    const ordenes = ordenesRecientes.slice(0, parseInt(limite));

    res.json({
      success: true,
      ordenes
    });

  } catch (error) {
    console.error('Error obteniendo órdenes recientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo órdenes recientes'
    });
  }
});

// Crear nueva orden
router.post('/', auth, async (req, res) => {
  try {
    const { items, metodoPago, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Los items son requeridos'
      });
    }

    if (!metodoPago || !total) {
      return res.status(400).json({
        success: false,
        message: 'Método de pago y total son requeridos'
      });
    }

    // Simular creación de orden
    const nuevaOrden = {
      _id: Date.now().toString(),
      numeroOrden: `ORD-2024-${String(Date.now()).slice(-6)}`,
      fecha: new Date(),
      items,
      total,
      metodoPago,
      estado: 'completada',
      cajero: {
        nombre: req.user.nombre,
        id: req.user.id
      }
    };

    res.status(201).json({
      success: true,
      orden: nuevaOrden,
      message: 'Orden creada exitosamente'
    });

  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando orden'
    });
  }
});

module.exports = router;