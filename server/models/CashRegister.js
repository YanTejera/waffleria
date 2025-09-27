const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['venta', 'devolucion', 'ingreso_manual', 'retiro_manual', 'apertura', 'cierre']
  },
  monto: {
    type: Number,
    required: true
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'pse', 'nequi', 'daviplata']
  },
  orden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  descripcion: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const cashRegisterSchema = new mongoose.Schema({
  fechaApertura: {
    type: Date,
    required: true,
    default: Date.now
  },
  fechaCierre: {
    type: Date
  },
  cajero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  montoInicialEfectivo: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  montoFinalEfectivo: {
    type: Number,
    min: 0
  },
  transacciones: [transactionSchema],
  resumenVentas: {
    totalVentas: {
      type: Number,
      default: 0
    },
    cantidadTransacciones: {
      type: Number,
      default: 0
    },
    ventasPorMetodoPago: {
      efectivo: { type: Number, default: 0 },
      tarjeta_credito: { type: Number, default: 0 },
      tarjeta_debito: { type: Number, default: 0 },
      transferencia: { type: Number, default: 0 },
      pse: { type: Number, default: 0 },
      nequi: { type: Number, default: 0 },
      daviplata: { type: Number, default: 0 }
    },
    propinaTotal: {
      type: Number,
      default: 0
    }
  },
  diferenciaCaja: {
    type: Number,
    default: 0
  },
  observaciones: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ['abierta', 'cerrada'],
    default: 'abierta'
  }
}, {
  timestamps: true
});

// Método para registrar transacción
cashRegisterSchema.methods.registrarTransaccion = function(transaccion) {
  this.transacciones.push(transaccion);

  // Actualizar resumen según tipo de transacción
  if (transaccion.tipo === 'venta') {
    this.resumenVentas.totalVentas += transaccion.monto;
    this.resumenVentas.cantidadTransacciones += 1;

    if (this.resumenVentas.ventasPorMetodoPago[transaccion.metodoPago] !== undefined) {
      this.resumenVentas.ventasPorMetodoPago[transaccion.metodoPago] += transaccion.monto;
    }
  }
};

// Método para calcular efectivo esperado
cashRegisterSchema.methods.calcularEfectivoEsperado = function() {
  let efectivoEsperado = this.montoInicialEfectivo;

  this.transacciones.forEach(transaccion => {
    if (transaccion.metodoPago === 'efectivo') {
      if (transaccion.tipo === 'venta' || transaccion.tipo === 'ingreso_manual') {
        efectivoEsperado += transaccion.monto;
      } else if (transaccion.tipo === 'devolucion' || transaccion.tipo === 'retiro_manual') {
        efectivoEsperado -= transaccion.monto;
      }
    }
  });

  return efectivoEsperado;
};

// Método para cerrar caja
cashRegisterSchema.methods.cerrarCaja = function(montoFinalContado, observaciones = '') {
  this.montoFinalEfectivo = montoFinalContado;
  this.fechaCierre = new Date();
  this.estado = 'cerrada';
  this.observaciones = observaciones;

  const efectivoEsperado = this.calcularEfectivoEsperado();
  this.diferenciaCaja = montoFinalContado - efectivoEsperado;

  return {
    efectivoEsperado,
    efectivoContado: montoFinalContado,
    diferencia: this.diferenciaCaja
  };
};

// Índices
cashRegisterSchema.index({ cajero: 1, fechaApertura: -1 });
cashRegisterSchema.index({ fechaApertura: -1 });
cashRegisterSchema.index({ estado: 1 });

module.exports = mongoose.model('CashRegister', cashRegisterSchema);