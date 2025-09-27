const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['waffle_base', 'helado', 'topping', 'bebida', 'extra'],
    required: true
  },
  precioCompra: {
    type: Number,
    required: true,
    min: 0
  },
  precioVenta: {
    type: Number,
    required: true,
    min: 0
  },
  descripcion: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    enum: [
      'waffle_tradicional',
      'waffle_premium',
      'waffle_especial',
      'helado_artesanal',
      'helado_premium',
      'helado_tradicional',
      'topping_frutas',
      'topping_cereales',
      'topping_frutos_secos',
      'topping_dulces',
      'topping_salsas',
      'topping_cremas',
      'bebida_fria',
      'bebida_caliente',
      'bebida_natural',
      'bebida_especial',
      'extra_acompañante',
      'extra_postre',
      'extra_snack'
    ]
  },
  disponible: {
    type: Boolean,
    default: true
  },
  imagen: {
    type: String,
    default: ''
  },
  ingredientes: [{
    nombre: String,
    cantidad: Number,
    unidad: String
  }],
  informacionNutricional: {
    calorias: Number,
    proteinas: Number,
    carbohidratos: Number,
    grasas: Number
  },
  tiempoPreparacion: {
    type: Number, // en minutos
    default: 5
  },
  popularidad: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índice para búsquedas optimizadas
productSchema.index({ tipo: 1, categoria: 1, disponible: 1 });
productSchema.index({ nombre: 'text', descripcion: 'text' });

module.exports = mongoose.model('Product', productSchema);