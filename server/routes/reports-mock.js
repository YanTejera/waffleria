const express = require('express');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

// Dashboard con datos de prueba
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { periodo = '30' } = req.query;

    // Datos de prueba simulados para el dashboard
    const dashboard = {
      ventasHoy: {
        total: 156780,
        cantidadOrdenes: 23,
        ticketPromedio: 6816,
        efectivo: 98500,
        tarjeta: 58280,
        comparacionAyer: {
          ventasAyer: 142300,
          porcentajeCambio: 10.2
        }
      },
      ventasSemana: {
        total: 980450,
        cantidadOrdenes: 165,
        ticketPromedio: 5942,
        comparacionSemanaAnterior: {
          ventasSemanaAnterior: 875600,
          porcentajeCambio: 12.0
        }
      },
      ventasMes: {
        total: 4250680,
        cantidadOrdenes: 728,
        ticketPromedio: 5840,
        comparacionMesAnterior: {
          ventasMesAnterior: 3950000,
          porcentajeCambio: 7.6
        }
      },
      productosPopulares: [
        {
          _id: '1',
          nombre: 'Waffle Clásico con Helado',
          categoria: 'Waffles Dulces',
          cantidadVendida: 45,
          ingresos: 180000,
          precio: 4000
        },
        {
          _id: '2',
          nombre: 'Hotdog Especial',
          categoria: 'Hotdogs',
          cantidadVendida: 38,
          ingresos: 190000,
          precio: 5000
        },
        {
          _id: '3',
          nombre: 'Coca Cola 350ml',
          categoria: 'Bebidas',
          cantidadVendida: 67,
          ingresos: 134000,
          precio: 2000
        },
        {
          _id: '4',
          nombre: 'Papas Fritas Grandes',
          categoria: 'Acompañamientos',
          cantidadVendida: 29,
          ingresos: 87000,
          precio: 3000
        }
      ],
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
      inventarioCritico: [
        {
          _id: '1',
          nombre: 'Helado de Vainilla',
          categoria: 'Ingredientes',
          stockActual: 5,
          stockMinimo: 10,
          unidad: 'litros'
        },
        {
          _id: '2',
          nombre: 'Salchichas Premium',
          categoria: 'Ingredientes',
          stockActual: 12,
          stockMinimo: 20,
          unidad: 'paquetes'
        }
      ],
      resumenPeriodo: {
        totalVentas: 4250680,
        totalOrdenes: 728,
        ticketPromedio: 5840,
        ventasPorDia: 141689,
        ordenesPorDia: 24.3,
        periodoConsultado: parseInt(periodo)
      }
    };

    res.json({
      success: true,
      dashboard
    });

  } catch (error) {
    console.error('Error generando dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error generando datos del dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Otras rutas de reportes con datos de prueba
router.get('/ventas', auth, async (req, res) => {
  try {
    const ventasPrueba = {
      periodo: '2024-01-01 a 2024-01-31',
      totalVentas: 4250680,
      totalOrdenes: 728,
      ticketPromedio: 5840,
      ventasPorDia: [
        { fecha: '2024-01-01', ventas: 145000, ordenes: 25 },
        { fecha: '2024-01-02', ventas: 132000, ordenes: 22 },
        { fecha: '2024-01-03', ventas: 178000, ordenes: 31 }
      ]
    };

    res.json({
      success: true,
      reporteVentas: ventasPrueba
    });
  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error generando reporte de ventas'
    });
  }
});

module.exports = router;