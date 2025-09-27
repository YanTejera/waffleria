const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  cantidadActual: {
    type: Number,
    required: true,
    min: 0
  },
  cantidadMinima: {
    type: Number,
    required: true,
    min: 0,
    default: 10
  },
  cantidadMaxima: {
    type: Number,
    required: true,
    min: 0,
    default: 100
  },
  unidadMedida: {
    type: String,
    required: true,
    enum: ['unidades', 'gramos', 'kilogramos', 'litros', 'mililitros'],
    default: 'unidades'
  },
  costoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  proveedor: {
    nombre: String,
    contacto: String,
    telefono: String
  },
  fechaVencimiento: {
    type: Date
  },
  lote: {
    type: String,
    trim: true
  },
  ubicacion: {
    seccion: String,
    anaquel: String,
    nivel: String
  },
  alertaBajoStock: {
    type: Boolean,
    default: false
  },
  ultimaActualizacion: {
    fecha: {
      type: Date,
      default: Date.now
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tipoMovimiento: {
      type: String,
      enum: ['entrada', 'salida', 'ajuste', 'merma']
    }
  }
}, {
  timestamps: true
});

// Middleware para actualizar alerta de bajo stock
inventorySchema.pre('save', function(next) {
  this.alertaBajoStock = this.cantidadActual <= this.cantidadMinima;
  next();
});

// Método para registrar movimiento de inventario
inventorySchema.methods.registrarMovimiento = function(cantidad, tipo, usuario) {
  const movimiento = {
    fecha: new Date(),
    cantidad: cantidad,
    tipo: tipo,
    cantidadAnterior: this.cantidadActual,
    usuario: usuario,
    observaciones: ''
  };

  if (!this.historialMovimientos) {
    this.historialMovimientos = [];
  }

  this.historialMovimientos.push(movimiento);

  if (tipo === 'entrada' || tipo === 'ajuste_positivo') {
    this.cantidadActual += cantidad;
  } else if (tipo === 'salida' || tipo === 'ajuste_negativo' || tipo === 'merma') {
    this.cantidadActual = Math.max(0, this.cantidadActual - cantidad);
  }

  this.ultimaActualizacion = {
    fecha: new Date(),
    usuario: usuario,
    tipoMovimiento: tipo
  };
};

// Índices para optimización
inventorySchema.index({ producto: 1 });
inventorySchema.index({ alertaBajoStock: 1 });
inventorySchema.index({ fechaVencimiento: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);