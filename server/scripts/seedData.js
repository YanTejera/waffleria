const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Modelos
const User = require('../models/User');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

const connectDB = require('../config/database');

// Datos iniciales
const initialUsers = [
  {
    nombre: 'Administrador',
    email: 'admin@waffleria.com',
    password: 'admin123',
    rol: 'admin',
    telefono: '+57 300 123 4567',
    activo: true
  },
  {
    nombre: 'Gerente Principal',
    email: 'gerente@waffleria.com',
    password: 'gerente123',
    rol: 'gerente',
    telefono: '+57 300 765 4321',
    activo: true
  },
  {
    nombre: 'Cajero María',
    email: 'maria@waffleria.com',
    password: 'cajero123',
    rol: 'cajero',
    telefono: '+57 300 111 2222',
    activo: true
  },
  {
    nombre: 'Cajero José',
    email: 'jose@waffleria.com',
    password: 'cajero123',
    rol: 'cajero',
    telefono: '+57 300 333 4444',
    activo: true
  }
];

const initialProducts = [
  // Waffles Base
  {
    nombre: 'Waffle Tradicional',
    tipo: 'waffle_base',
    precio: 8000,
    descripcion: 'Delicioso waffle dorado y crujiente, perfecto para acompañar con helado y toppings',
    categoria: 'waffle_tradicional',
    disponible: true,
    tiempoPreparacion: 5,
    informacionNutricional: {
      calorias: 250,
      proteinas: 6,
      carbohidratos: 35,
      grasas: 10
    }
  },
  {
    nombre: 'Waffle Belga',
    tipo: 'waffle_base',
    precio: 10000,
    descripcion: 'Auténtico waffle belga con masa especial, más grueso y esponjoso',
    categoria: 'waffle_premium',
    disponible: true,
    tiempoPreparacion: 7,
    informacionNutricional: {
      calorias: 300,
      proteinas: 8,
      carbohidratos: 40,
      grasas: 12
    }
  },
  {
    nombre: 'Waffle de Chocolate',
    tipo: 'waffle_base',
    precio: 11000,
    descripcion: 'Waffle con masa de chocolate, perfecto para los amantes del cacao',
    categoria: 'waffle_premium',
    disponible: true,
    tiempoPreparacion: 6,
    informacionNutricional: {
      calorias: 320,
      proteinas: 7,
      carbohidratos: 42,
      grasas: 14
    }
  },

  // Helados
  {
    nombre: 'Helado de Vainilla',
    tipo: 'helado',
    precio: 3000,
    descripcion: 'Cremoso helado artesanal de vainilla natural',
    categoria: 'helado_artesanal',
    disponible: true,
    tiempoPreparacion: 1,
    informacionNutricional: {
      calorias: 180,
      proteinas: 4,
      carbohidratos: 20,
      grasas: 9
    }
  },
  {
    nombre: 'Helado de Chocolate',
    tipo: 'helado',
    precio: 3500,
    descripción: 'Intenso helado de chocolate con cacao premium',
    categoria: 'helado_artesanal',
    disponible: true,
    tiempoPreparacion: 1,
    informacionNutricional: {
      calorias: 200,
      proteinas: 5,
      carbohidratos: 22,
      grasas: 10
    }
  },
  {
    nombre: 'Helado de Fresa',
    tipo: 'helado',
    precio: 3200,
    descripcion: 'Helado artesanal con fresas naturales',
    categoria: 'helado_artesanal',
    disponible: true,
    tiempoPreparacion: 1,
    informacionNutricional: {
      calorias: 160,
      proteinas: 3,
      carbohidratos: 18,
      grasas: 8
    }
  },
  {
    nombre: 'Helado de Cookies & Cream',
    tipo: 'helado',
    precio: 4000,
    descripcion: 'Helado premium con trozos de galletas Oreo',
    categoria: 'helado_premium',
    disponible: true,
    tiempoPreparacion: 1,
    informacionNutricional: {
      calorias: 240,
      proteinas: 4,
      carbohidratos: 26,
      grasas: 12
    }
  },
  {
    nombre: 'Helado de Dulce de Leche',
    tipo: 'helado',
    precio: 3800,
    descripcion: 'Cremoso helado con auténtico dulce de leche argentino',
    categoria: 'helado_premium',
    disponible: true,
    tiempoPreparacion: 1,
    informacionNutricional: {
      calorias: 220,
      proteinas: 4,
      carbohidratos: 24,
      grasas: 11
    }
  },

  // Toppings - Frutas
  {
    nombre: 'Fresas',
    tipo: 'topping',
    precio: 2000,
    descripcion: 'Fresas frescas en rodajas',
    categoria: 'topping_frutas',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Banano',
    tipo: 'topping',
    precio: 1500,
    descripcion: 'Rodajas de banano fresco',
    categoria: 'topping_frutas',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Kiwi',
    tipo: 'topping',
    precio: 2500,
    descripcion: 'Kiwi fresco en rodajas',
    categoria: 'topping_frutas',
    disponible: true,
    tiempoPreparacion: 1
  },

  // Toppings - Cereales
  {
    nombre: 'Granola',
    tipo: 'topping',
    precio: 1800,
    descripcion: 'Granola crujiente casera',
    categoria: 'topping_cereales',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Choco Krispis',
    tipo: 'topping',
    precio: 1500,
    descripcion: 'Cereal de chocolate crujiente',
    categoria: 'topping_cereales',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Corn Flakes',
    tipo: 'topping',
    precio: 1200,
    descripcion: 'Hojuelas de maíz crujientes',
    categoria: 'topping_cereales',
    disponible: true,
    tiempoPreparacion: 1
  },

  // Toppings - Frutos Secos
  {
    nombre: 'Almendras',
    tipo: 'topping',
    precio: 3000,
    descripcion: 'Almendras tostadas en láminas',
    categoria: 'topping_frutos_secos',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Nueces',
    tipo: 'topping',
    precio: 3500,
    descripcion: 'Nueces picadas',
    categoria: 'topping_frutos_secos',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Maní',
    tipo: 'topping',
    precio: 2000,
    descripcion: 'Maní tostado y salado',
    categoria: 'topping_frutos_secos',
    disponible: true,
    tiempoPreparacion: 1
  },

  // Toppings - Dulces
  {
    nombre: 'M&Ms',
    tipo: 'topping',
    precio: 2500,
    descripcion: 'Chocolates M&Ms de colores',
    categoria: 'topping_dulces',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Chispas de Chocolate',
    tipo: 'topping',
    precio: 1800,
    descripcion: 'Chispas de chocolate semi-dulce',
    categoria: 'topping_dulces',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Gomitas',
    tipo: 'topping',
    precio: 2000,
    descripcion: 'Gomitas de frutas variadas',
    categoria: 'topping_dulces',
    disponible: true,
    tiempoPreparacion: 1
  },

  // Toppings - Salsas
  {
    nombre: 'Nutella',
    tipo: 'topping',
    precio: 3000,
    descripcion: 'Deliciosa crema de avellanas Nutella',
    categoria: 'topping_salsas',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Salsa de Chocolate',
    tipo: 'topping',
    precio: 2000,
    descripcion: 'Salsa de chocolate caliente',
    categoria: 'topping_salsas',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Salsa de Fresa',
    tipo: 'topping',
    precio: 2000,
    descripcion: 'Salsa natural de fresa',
    categoria: 'topping_salsas',
    disponible: true,
    tiempoPreparacion: 1
  },
  {
    nombre: 'Salsa de Caramelo',
    tipo: 'topping',
    precio: 2200,
    descripcion: 'Salsa de caramelo casera',
    categoria: 'topping_salsas',
    disponible: true,
    tiempoPreparacion: 1
  }
];

const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    console.log('🌱 Iniciando proceso de sembrado de datos...');

    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});

    // Crear usuarios
    console.log('👥 Creando usuarios iniciales...');
    const users = await User.insertMany(initialUsers);
    console.log(`✅ ${users.length} usuarios creados`);

    // Crear productos
    console.log('🧇 Creando productos iniciales...');
    const products = await Product.insertMany(initialProducts);
    console.log(`✅ ${products.length} productos creados`);

    // Crear inventarios iniciales para algunos productos
    console.log('📦 Creando inventarios iniciales...');
    const inventarios = [];

    for (const product of products) {
      let cantidadInicial, costoUnitario, unidadMedida;

      // Configurar inventario según el tipo de producto
      switch (product.tipo) {
        case 'waffle_base':
          cantidadInicial = 50;
          costoUnitario = product.precio * 0.4; // 40% del precio de venta
          unidadMedida = 'unidades';
          break;
        case 'helado':
          cantidadInicial = 30;
          costoUnitario = product.precio * 0.5;
          unidadMedida = 'unidades';
          break;
        case 'topping':
          if (product.categoria.includes('frutas')) {
            cantidadInicial = 20;
            unidadMedida = 'unidades';
          } else {
            cantidadInicial = 100;
            unidadMedida = 'gramos';
          }
          costoUnitario = product.precio * 0.3;
          break;
        default:
          cantidadInicial = 25;
          costoUnitario = product.precio * 0.4;
          unidadMedida = 'unidades';
      }

      inventarios.push({
        producto: product._id,
        cantidadActual: cantidadInicial,
        cantidadMinima: Math.round(cantidadInicial * 0.2), // 20% como mínimo
        cantidadMaxima: cantidadInicial * 3,
        unidadMedida,
        costoUnitario,
        proveedor: {
          nombre: 'Proveedor Principal',
          contacto: 'proveedor@ejemplo.com',
          telefono: '+57 300 555 0001'
        },
        ubicacion: {
          seccion: product.tipo === 'helado' ? 'Congelador' : 'Almacén',
          anaquel: 'A1',
          nivel: '1'
        }
      });
    }

    const inventoryEntries = await Inventory.insertMany(inventarios);
    console.log(`✅ ${inventoryEntries.length} entradas de inventario creadas`);

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • ${users.length} usuarios creados`);
    console.log(`   • ${products.length} productos creados`);
    console.log(`   • ${inventoryEntries.length} inventarios creados`);

    console.log('\n👤 Usuarios de prueba:');
    console.log('   • Admin: admin@waffleria.com / admin123');
    console.log('   • Gerente: gerente@waffleria.com / gerente123');
    console.log('   • Cajeros: maria@waffleria.com / cajero123');
    console.log('   •         jose@waffleria.com / cajero123');

    console.log('\n🚀 ¡La Waffleria está lista para funcionar!');

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    // Cerrar conexión
    mongoose.connection.close();
  }
};

// Ejecutar el script si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;