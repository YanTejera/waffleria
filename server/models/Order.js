const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  personalizacion: {
    waffleBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    helados: [{
      helado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      cantidad: {
        type: Number,
        default: 1
      }
    }],
    toppings: [{
      topping: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      cantidad: {
        type: Number,
        default: 1
      }
    }],
    instruccionesEspeciales: String
  }
});

const orderSchema = new mongoose.Schema({
  numeroOrden: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  cliente: {
    nombre: String,
    telefono: String,
    mesa: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  impuestos: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  descuentos: {
    porcentaje: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    monto: {
      type: Number,
      min: 0,
      default: 0
    },
    motivo: String
  },
  propina: {
    type: Number,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  metodoPago: {
    type: String,
    required: true,
    enum: ['efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'pse', 'nequi', 'daviplata']
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  cajero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tiempoEstimado: {
    type: Number, // en minutos
    default: 10
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaEntrega: {
    type: Date
  },
  observaciones: {
    type: String,
    trim: true
  },
  facturaFisica: {
    requerida: {
      type: Boolean,
      default: false
    },
    nit: String,
    razonSocial: String
  }
}, {
  timestamps: true
});

// Middleware para calcular totales automáticamente
orderSchema.pre('save', function(next) {
  // Calcular subtotal
  this.subtotal = this.items.reduce((total, item) => total + item.subtotal, 0);

  // Aplicar descuentos
  let descuentoTotal = 0;
  if (this.descuentos.porcentaje > 0) {
    descuentoTotal = (this.subtotal * this.descuentos.porcentaje) / 100;
  } else if (this.descuentos.monto > 0) {
    descuentoTotal = this.descuentos.monto;
  }

  // Calcular total final
  this.total = this.subtotal - descuentoTotal + this.impuestos + this.propina;

  next();
});

// Generar número de orden automático
orderSchema.pre('save', async function(next) {
  if (!this.numeroOrden) {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    // Contar órdenes del día
    const inicioHoy = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    const finHoy = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1);

    const ordenesDia = await this.constructor.countDocuments({
      fechaCreacion: {
        $gte: inicioHoy,
        $lt: finHoy
      }
    });

    const numeroSecuencial = String(ordenesDia + 1).padStart(3, '0');
    this.numeroOrden = `WF${año}${mes}${dia}${numeroSecuencial}`;
  }
  next();
});

// Índices para optimización
orderSchema.index({ numeroOrden: 1 });
orderSchema.index({ fechaCreacion: -1 });
orderSchema.index({ estado: 1, fechaCreacion: -1 });
orderSchema.index({ cajero: 1, fechaCreacion: -1 });

module.exports = mongoose.model('Order', orderSchema);