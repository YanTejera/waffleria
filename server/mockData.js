// Mock data para desarrollo sin MongoDB - Menú Completo La Wafflería
let products = [
  // ============ WAFFLES PERSONALIZABLES ============
  {
    _id: '1',
    nombre: 'Waffle Vainilla',
    tipo: 'waffle_personalizable',
    precioCompra: 7000,
    precioVenta: 12000,
    descripcion: 'Waffle base de vainilla - Arma como quieras (incluye una fruta, topping y salsa)',
    categoria: 'Waffles Personalizables',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Harina', cantidad: 200, unidad: 'gramos' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Esencia vainilla', cantidad: 5, unidad: 'ml' }
    ],
    informacionNutricional: { calorias: 320, proteinas: 8, carbohidratos: 45, grasas: 12 },
    tiempoPreparacion: 8,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    nombre: 'Waffle Canela',
    tipo: 'waffle_personalizable',
    precioCompra: 7500,
    precioVenta: 13000,
    descripcion: 'Waffle con sabor a canela - Arma como quieras (incluye una fruta, topping y salsa)',
    categoria: 'Waffles Personalizables',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Harina', cantidad: 200, unidad: 'gramos' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Canela', cantidad: 10, unidad: 'gramos' }
    ],
    informacionNutricional: { calorias: 330, proteinas: 8, carbohidratos: 46, grasas: 12 },
    tiempoPreparacion: 8,
    popularidad: 78,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    nombre: 'Waffle Café',
    tipo: 'waffle_personalizable',
    precioCompra: 7500,
    precioVenta: 13000,
    descripcion: 'Waffle con sabor a café - Arma como quieras (incluye una fruta, topping y salsa)',
    categoria: 'Waffles Personalizables',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Harina', cantidad: 200, unidad: 'gramos' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Café', cantidad: 15, unidad: 'ml' }
    ],
    informacionNutricional: { calorias: 325, proteinas: 8, carbohidratos: 45, grasas: 12 },
    tiempoPreparacion: 8,
    popularidad: 82,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    nombre: 'Waffle Chocolate',
    tipo: 'waffle_personalizable',
    precioCompra: 8000,
    precioVenta: 14000,
    descripcion: 'Waffle con chocolate - Arma como quieras (incluye una fruta, topping y salsa)',
    categoria: 'Waffles Personalizables',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Harina', cantidad: 200, unidad: 'gramos' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Chocolate', cantidad: 50, unidad: 'gramos' }
    ],
    informacionNutricional: { calorias: 380, proteinas: 9, carbohidratos: 48, grasas: 15 },
    tiempoPreparacion: 8,
    popularidad: 92,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    nombre: 'Waffle Avena',
    tipo: 'waffle_personalizable',
    precioCompra: 8000,
    precioVenta: 14000,
    descripcion: 'Waffle integral con avena - Arma como quieras (incluye una fruta, topping y salsa)',
    categoria: 'Waffles Personalizables',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Harina integral', cantidad: 150, unidad: 'gramos' },
      { nombre: 'Avena', cantidad: 50, unidad: 'gramos' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' }
    ],
    informacionNutricional: { calorias: 340, proteinas: 10, carbohidratos: 50, grasas: 11 },
    tiempoPreparacion: 8,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ FRUTAS (para waffles personalizables) ============
  {
    _id: '6',
    nombre: 'Fresa',
    tipo: 'fruta',
    precioCompra: 1000,
    precioVenta: 2000,
    descripcion: 'Fresas frescas cortadas para acompañar tu waffle',
    categoria: 'Frutas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Fresas', cantidad: 100, unidad: 'gramos' }],
    informacionNutricional: { calorias: 32, proteinas: 1, carbohidratos: 8, grasas: 0 },
    tiempoPreparacion: 2,
    popularidad: 88,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '7',
    nombre: 'Banano',
    tipo: 'fruta',
    precioCompra: 800,
    precioVenta: 2000,
    descripcion: 'Banano en rodajas para tu waffle',
    categoria: 'Frutas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Banano', cantidad: 120, unidad: 'gramos' }],
    informacionNutricional: { calorias: 89, proteinas: 1, carbohidratos: 23, grasas: 0 },
    tiempoPreparacion: 2,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '8',
    nombre: 'Mango',
    tipo: 'fruta',
    precioCompra: 1200,
    precioVenta: 2000,
    descripcion: 'Mango fresco en cubos',
    categoria: 'Frutas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Mango', cantidad: 100, unidad: 'gramos' }],
    informacionNutricional: { calorias: 60, proteinas: 1, carbohidratos: 15, grasas: 0 },
    tiempoPreparacion: 2,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '9',
    nombre: 'Durazno',
    tipo: 'fruta',
    precioCompra: 1300,
    precioVenta: 2000,
    descripcion: 'Durazno fresco en gajos',
    categoria: 'Frutas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Durazno', cantidad: 100, unidad: 'gramos' }],
    informacionNutricional: { calorias: 39, proteinas: 1, carbohidratos: 10, grasas: 0 },
    tiempoPreparacion: 2,
    popularidad: 65,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ SALSAS ============
  {
    _id: '10',
    nombre: 'Salsa Chocolate',
    tipo: 'salsa',
    precioCompra: 500,
    precioVenta: 1000,
    descripcion: 'Deliciosa salsa de chocolate',
    categoria: 'Salsas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Chocolate', cantidad: 30, unidad: 'gramos' }],
    informacionNutricional: { calorias: 80, proteinas: 1, carbohidratos: 15, grasas: 3 },
    tiempoPreparacion: 1,
    popularidad: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '11',
    nombre: 'Salsa Lecherita',
    tipo: 'salsa',
    precioCompra: 400,
    precioVenta: 1000,
    descripcion: 'Salsa de leche condensada',
    categoria: 'Salsas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Leche condensada', cantidad: 30, unidad: 'gramos' }],
    informacionNutricional: { calorias: 90, proteinas: 2, carbohidratos: 18, grasas: 2 },
    tiempoPreparacion: 1,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '12',
    nombre: 'Salsa Arequipe',
    tipo: 'salsa',
    precioCompra: 600,
    precioVenta: 1000,
    descripcion: 'Dulce de leche tradicional',
    categoria: 'Salsas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Arequipe', cantidad: 35, unidad: 'gramos' }],
    informacionNutricional: { calorias: 120, proteinas: 2, carbohidratos: 20, grasas: 4 },
    tiempoPreparacion: 1,
    popularidad: 88,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ TOPPINGS ============
  {
    _id: '13',
    nombre: 'Galleta Oreo',
    tipo: 'topping',
    precioCompra: 800,
    precioVenta: 2000,
    descripción: 'Galletas Oreo trituradas',
    categoria: 'Toppings',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Galleta Oreo', cantidad: 20, unidad: 'gramos' }],
    informacionNutricional: { calorias: 95, proteinas: 1, carbohidratos: 14, grasas: 4 },
    tiempoPreparacion: 1,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '14',
    nombre: 'Barquillo',
    tipo: 'topping',
    precioCompra: 400,
    precioVenta: 1000,
    descripcion: 'Barquillos crujientes',
    categoria: 'Toppings',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Barquillo', cantidad: 15, unidad: 'gramos' }],
    informacionNutricional: { calorias: 65, proteinas: 1, carbohidratos: 12, grasas: 2 },
    tiempoPreparacion: 1,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '15',
    nombre: 'Chips de Chocolate',
    tipo: 'topping',
    precioCompra: 600,
    precioVenta: 1500,
    descripcion: 'Chips de chocolate para decorar',
    categoria: 'Toppings',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Chips chocolate', cantidad: 20, unidad: 'gramos' }],
    informacionNutricional: { calorias: 100, proteinas: 1, carbohidratos: 12, grasas: 6 },
    tiempoPreparacion: 1,
    popularidad: 80,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '16',
    nombre: 'Brownie',
    tipo: 'topping',
    precioCompra: 1000,
    precioVenta: 2000,
    descripcion: 'Trozos de brownie de chocolate',
    categoria: 'Toppings',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Brownie', cantidad: 30, unidad: 'gramos' }],
    informacionNutricional: { calorias: 130, proteinas: 2, carbohidratos: 18, grasas: 6 },
    tiempoPreparacion: 1,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '17',
    nombre: 'Nutella',
    tipo: 'topping',
    precioCompra: 800,
    precioVenta: 2000,
    descripcion: 'Crema de avellanas Nutella (+2 mil adicional)',
    categoria: 'Toppings',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Nutella', cantidad: 30, unidad: 'gramos' }],
    informacionNutricional: { calorias: 160, proteinas: 2, carbohidratos: 17, grasas: 11 },
    tiempoPreparacion: 1,
    popularidad: 95,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '18',
    nombre: 'Cerezas',
    tipo: 'topping',
    precioCompra: 1200,
    precioVenta: 2000,
    descripcion: 'Cerezas en almíbar (+2 mil adicional)',
    categoria: 'Toppings',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Cerezas', cantidad: 40, unidad: 'gramos' }],
    informacionNutricional: { calorias: 50, proteinas: 1, carbohidratos: 12, grasas: 0 },
    tiempoPreparacion: 1,
    popularidad: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ HELADOS ============
  {
    _id: '19',
    nombre: 'Helado Vainilla',
    tipo: 'helado',
    precioCompra: 2000,
    precioVenta: 3000,
    descripcion: 'Helado artesanal de vainilla (+3 mil adicional)',
    categoria: 'Helados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Leche', cantidad: 200, unidad: 'ml' }, { nombre: 'Vainilla', cantidad: 5, unidad: 'ml' }],
    informacionNutricional: { calorias: 150, proteinas: 4, carbohidratos: 18, grasas: 8 },
    tiempoPreparacion: 1,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '20',
    nombre: 'Helado Tres Leches',
    tipo: 'helado',
    precioCompra: 2200,
    precioVenta: 3000,
    descripcion: 'Helado sabor tres leches (+3 mil adicional)',
    categoria: 'Helados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Leche condensada', cantidad: 50, unidad: 'ml' }, { nombre: 'Leche evaporada', cantidad: 50, unidad: 'ml' }],
    informacionNutricional: { calorias: 180, proteinas: 5, carbohidratos: 22, grasas: 9 },
    tiempoPreparacion: 1,
    popularidad: 80,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '21',
    nombre: 'Helado Chocolate',
    tipo: 'helado',
    precioCompra: 2200,
    precioVenta: 3000,
    descripcion: 'Helado artesanal de chocolate (+3 mil adicional)',
    categoria: 'Helados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Leche', cantidad: 200, unidad: 'ml' }, { nombre: 'Chocolate', cantidad: 50, unidad: 'gramos' }],
    informacionNutricional: { calorias: 180, proteinas: 5, carbohidratos: 22, grasas: 9 },
    tiempoPreparacion: 1,
    popularidad: 88,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '22',
    nombre: 'Helado Galleta Oreo',
    tipo: 'helado',
    precioCompra: 2500,
    precioVenta: 3000,
    descripcion: 'Helado con trozos de galleta Oreo (+3 mil adicional)',
    categoria: 'Helados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Leche', cantidad: 200, unidad: 'ml' }, { nombre: 'Galleta Oreo', cantidad: 30, unidad: 'gramos' }],
    informacionNutricional: { calorias: 200, proteinas: 5, carbohidratos: 26, grasas: 10 },
    tiempoPreparacion: 1,
    popularidad: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ BATIDOS DE HELADO ============
  {
    _id: '23',
    nombre: 'Batido Chocolate Mocca',
    tipo: 'batido',
    precioCompra: 6000,
    precioVenta: 10000,
    descripcion: 'Batido hecho de 100% helado acompañado de toppings',
    categoria: 'Batidos de Helado',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado chocolate', cantidad: 200, unidad: 'gramos' }, { nombre: 'Café', cantidad: 30, unidad: 'ml' }],
    informacionNutricional: { calorias: 320, proteinas: 8, carbohidratos: 45, grasas: 15 },
    tiempoPreparacion: 5,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '24',
    nombre: 'Batido Fresa',
    tipo: 'batido',
    precioCompra: 6000,
    precioVenta: 10000,
    descripcion: 'Batido hecho de 100% helado acompañado de toppings',
    categoria: 'Batidos de Helado',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado vainilla', cantidad: 200, unidad: 'gramos' }, { nombre: 'Fresas', cantidad: 100, unidad: 'gramos' }],
    informacionNutricional: { calorias: 280, proteinas: 7, carbohidratos: 40, grasas: 12 },
    tiempoPreparacion: 5,
    popularidad: 80,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ WAFFLES ESPECIALES ============
  {
    _id: '25',
    nombre: 'Waffle de Pandebono',
    tipo: 'waffle_especial',
    precioCompra: 6000,
    precioVenta: 10000,
    descripcion: 'Especialidad de la casa. Incluye helado y salsa',
    categoria: 'Waffles Especiales',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Harina de yuca', cantidad: 150, unidad: 'gramos' }, { nombre: 'Queso', cantidad: 50, unidad: 'gramos' }],
    informacionNutricional: { calorias: 350, proteinas: 12, carbohidratos: 45, grasas: 15 },
    tiempoPreparacion: 10,
    popularidad: 95,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '26',
    nombre: 'Waffle de Chócolo',
    tipo: 'waffle_especial',
    precioCompra: 7500,
    precioVenta: 13000,
    descripcion: 'Con queso rayado y salsa',
    categoria: 'Waffles Especiales',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Chócolo', cantidad: 200, unidad: 'gramos' }, { nombre: 'Queso', cantidad: 50, unidad: 'gramos' }],
    informacionNutricional: { calorias: 380, proteinas: 14, carbohidratos: 50, grasas: 16 },
    tiempoPreparacion: 12,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '27',
    nombre: 'Porción de Waffle',
    tipo: 'waffle_especial',
    precioCompra: 6000,
    precioVenta: 10000,
    descripcion: 'Waffle de vainilla acompañado con helado, fruta y salsa',
    categoria: 'Waffles Especiales',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Waffle vainilla', cantidad: 1, unidad: 'pieza' }, { nombre: 'Helado', cantidad: 1, unidad: 'bola' }],
    informacionNutricional: { calorias: 420, proteinas: 10, carbohidratos: 55, grasas: 18 },
    tiempoPreparacion: 8,
    popularidad: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '28',
    nombre: 'Cono de Waffle',
    tipo: 'waffle_especial',
    precioCompra: 8000,
    precioVenta: 14000,
    descripcion: '2 bolas de helado, fruta, toppings y salsa',
    categoria: 'Waffles Especiales',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Cono waffle', cantidad: 1, unidad: 'pieza' }, { nombre: 'Helado', cantidad: 2, unidad: 'bolas' }],
    informacionNutricional: { calorias: 480, proteinas: 12, carbohidratos: 62, grasas: 22 },
    tiempoPreparacion: 6,
    popularidad: 88,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ ANTOJOS ============
  {
    _id: '29',
    nombre: 'Fresas con Crema',
    tipo: 'antojo',
    precioCompra: 7500,
    precioVenta: 13000,
    descripcion: 'Fresas acompañadas de crema de la casa con 1 bola de helado',
    categoria: 'Antojos',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Fresas', cantidad: 150, unidad: 'gramos' }, { nombre: 'Crema', cantidad: 50, unidad: 'ml' }],
    informacionNutricional: { calorias: 220, proteinas: 6, carbohidratos: 25, grasas: 12 },
    tiempoPreparacion: 5,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '30',
    nombre: 'Duraznos con Crema',
    tipo: 'antojo',
    precioCompra: 9000,
    precioVenta: 16000,
    descripcion: 'Duraznos en almíbar con crema de la casa y 1 bola de helado',
    categoria: 'Antojos',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Duraznos', cantidad: 150, unidad: 'gramos' }, { nombre: 'Crema', cantidad: 50, unidad: 'ml' }],
    informacionNutricional: { calorias: 250, proteinas: 6, carbohidratos: 35, grasas: 12 },
    tiempoPreparacion: 5,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '31',
    nombre: 'Brownie Caliente',
    tipo: 'antojo',
    precioCompra: 4500,
    precioVenta: 8000,
    descripcion: 'Brownie de chocolate acompañado de 1 bola de helado y salsa',
    categoria: 'Antojos',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Brownie', cantidad: 80, unidad: 'gramos' }, { nombre: 'Helado', cantidad: 1, unidad: 'bola' }],
    informacionNutricional: { calorias: 380, proteinas: 8, carbohidratos: 45, grasas: 18 },
    tiempoPreparacion: 3,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '32',
    nombre: 'Ensalada de Frutas Grande',
    tipo: 'antojo',
    precioCompra: 7500,
    precioVenta: 13000,
    descripcion: 'Mix de frutas, con queso, cereal, crema y helado',
    categoria: 'Antojos',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Frutas mixtas', cantidad: 200, unidad: 'gramos' }, { nombre: 'Queso', cantidad: 30, unidad: 'gramos' }],
    informacionNutricional: { calorias: 280, proteinas: 8, carbohidratos: 40, grasas: 12 },
    tiempoPreparacion: 6,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '33',
    nombre: 'Ensalada de Frutas Pequeña',
    tipo: 'antojo',
    precioCompra: 5000,
    precioVenta: 9000,
    descripcion: 'Mix de frutas, con queso, cereal, crema y helado',
    categoria: 'Antojos',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Frutas mixtas', cantidad: 150, unidad: 'gramos' }, { nombre: 'Queso', cantidad: 20, unidad: 'gramos' }],
    informacionNutricional: { calorias: 210, proteinas: 6, carbohidratos: 30, grasas: 9 },
    tiempoPreparacion: 5,
    popularidad: 65,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ MINI ANTOJOS ============
  {
    _id: '34',
    nombre: 'Helado en Vaso 1 Bola',
    tipo: 'mini_antojo',
    precioCompra: 2000,
    precioVenta: 3500,
    descripcion: 'Una bola de helado en vaso',
    categoria: 'Mini Antojos',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado', cantidad: 1, unidad: 'bola' }],
    informacionNutricional: { calorias: 150, proteinas: 4, carbohidratos: 18, grasas: 8 },
    tiempoPreparacion: 2,
    popularidad: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '35',
    nombre: 'Helado en Vaso 2 Bolas',
    tipo: 'mini_antojo',
    precioCompra: 3000,
    precioVenta: 5000,
    descripcion: 'Dos bolas de helado en vaso',
    categoria: 'Mini Antojos',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado', cantidad: 2, unidad: 'bolas' }],
    informacionNutricional: { calorias: 300, proteinas: 8, carbohidratos: 36, grasas: 16 },
    tiempoPreparacion: 2,
    popularidad: 65,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '36',
    nombre: 'Helado en Cono 1 Bola',
    tipo: 'mini_antojo',
    precioCompra: 2200,
    precioVenta: 3500,
    descripcion: 'Una bola de helado en cono',
    categoria: 'Mini Antojos',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado', cantidad: 1, unidad: 'bola' }, { nombre: 'Cono', cantidad: 1, unidad: 'pieza' }],
    informacionNutricional: { calorias: 180, proteinas: 4, carbohidratos: 22, grasas: 9 },
    tiempoPreparacion: 2,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '37',
    nombre: 'Helado en Cono 2 Bolas',
    tipo: 'mini_antojo',
    precioCompra: 3200,
    precioVenta: 5000,
    descripcion: 'Dos bolas de helado en cono',
    categoria: 'Mini Antojos',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado', cantidad: 2, unidad: 'bolas' }, { nombre: 'Cono', cantidad: 1, unidad: 'pieza' }],
    informacionNutricional: { calorias: 330, proteinas: 8, carbohidratos: 40, grasas: 17 },
    tiempoPreparacion: 2,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '38',
    nombre: 'Paleta Waffle',
    tipo: 'mini_antojo',
    precioCompra: 2500,
    precioVenta: 4000,
    descripcion: 'Trozo de waffle con Nutella y fresas',
    categoria: 'Mini Antojos',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Waffle', cantidad: 50, unidad: 'gramos' }, { nombre: 'Nutella', cantidad: 20, unidad: 'gramos' }],
    informacionNutricional: { calorias: 250, proteinas: 4, carbohidratos: 30, grasas: 12 },
    tiempoPreparacion: 3,
    popularidad: 80,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ COPAS ============
  {
    _id: '39',
    nombre: 'Copa Queso',
    tipo: 'copa',
    precioCompra: 8000,
    precioVenta: 14000,
    descripcion: 'Helado acompañado de queso rayado, salsa de arequipe y barquillos',
    categoria: 'Copas',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado', cantidad: 2, unidad: 'bolas' }, { nombre: 'Queso', cantidad: 40, unidad: 'gramos' }],
    informacionNutricional: { calorias: 380, proteinas: 12, carbohidratos: 35, grasas: 22 },
    tiempoPreparacion: 4,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '40',
    nombre: 'Copa Chocolate',
    tipo: 'copa',
    precioCompra: 8000,
    precioVenta: 14000,
    descripcion: 'Helado, salsa de chocolate y variedad de toppings de chocolate',
    categoria: 'Copas',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado', cantidad: 2, unidad: 'bolas' }, { nombre: 'Salsa chocolate', cantidad: 30, unidad: 'ml' }],
    informacionNutricional: { calorias: 420, proteinas: 8, carbohidratos: 45, grasas: 20 },
    tiempoPreparacion: 4,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '41',
    nombre: 'Copa Durazno',
    tipo: 'copa',
    precioCompra: 8000,
    precioVenta: 14000,
    descripcion: 'Trozos de durazno en almíbar con crema, helado y toppings',
    categoria: 'Copas',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Helado', cantidad: 2, unidad: 'bolas' }, { nombre: 'Duraznos', cantidad: 80, unidad: 'gramos' }],
    informacionNutricional: { calorias: 350, proteinas: 8, carbohidratos: 45, grasas: 16 },
    tiempoPreparacion: 4,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ SODAS TROPICALES ============
  {
    _id: '42',
    nombre: 'Soda Frutos Rojos',
    tipo: 'soda',
    precioCompra: 4500,
    precioVenta: 8000,
    descripcion: 'Bretaña con fresas frescas acompañado de cereza',
    categoria: 'Sodas Tropicales',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Bretaña', cantidad: 350, unidad: 'ml' }, { nombre: 'Fresas', cantidad: 50, unidad: 'gramos' }],
    informacionNutricional: { calorias: 120, proteinas: 1, carbohidratos: 30, grasas: 0 },
    tiempoPreparacion: 3,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '43',
    nombre: 'Soda Frutos Amarillos',
    tipo: 'soda',
    precioCompra: 4500,
    precioVenta: 8000,
    descripcion: 'Bretaña acompañada de zumo de maracuyá, limón y frutos amarillos',
    categoria: 'Sodas Tropicales',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Bretaña', cantidad: 350, unidad: 'ml' }, { nombre: 'Maracuyá', cantidad: 30, unidad: 'ml' }],
    informacionNutricional: { calorias: 110, proteinas: 1, carbohidratos: 28, grasas: 0 },
    tiempoPreparacion: 3,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '44',
    nombre: 'Soda Sal-Limón',
    tipo: 'soda',
    precioCompra: 3000,
    precioVenta: 6000,
    descripcion: 'Bretaña con limón y sal limón',
    categoria: 'Sodas Tropicales',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Bretaña', cantidad: 350, unidad: 'ml' }, { nombre: 'Limón', cantidad: 20, unidad: 'ml' }],
    informacionNutricional: { calorias: 95, proteinas: 0, carbohidratos: 24, grasas: 0 },
    tiempoPreparacion: 2,
    popularidad: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ ESCARCHADOS ============
  {
    _id: '45',
    nombre: 'Escarchado Mango Biche',
    tipo: 'escarchado',
    precioCompra: 5000,
    precioVenta: 9000,
    descripcion: 'Refrescante escarchado de mango biche',
    categoria: 'Escarchados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Mango biche', cantidad: 100, unidad: 'gramos' }, { nombre: 'Hielo', cantidad: 150, unidad: 'gramos' }],
    informacionNutricional: { calorias: 80, proteinas: 1, carbohidratos: 20, grasas: 0 },
    tiempoPreparacion: 3,
    popularidad: 65,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '46',
    nombre: 'Escarchado Maracumango',
    tipo: 'escarchado',
    precioCompra: 5000,
    precioVenta: 9000,
    descripcion: 'Escarchado de maracuyá y mango',
    categoria: 'Escarchados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Maracuyá', cantidad: 50, unidad: 'ml' }, { nombre: 'Mango', cantidad: 50, unidad: 'gramos' }],
    informacionNutricional: { calorias: 90, proteinas: 1, carbohidratos: 22, grasas: 0 },
    tiempoPreparacion: 3,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ============ ADICIONALES ============
  {
    _id: '47',
    nombre: 'Queso Adicional',
    tipo: 'adicional',
    precioCompra: 1500,
    precioVenta: 3000,
    descripcion: 'Porción adicional de queso rayado',
    categoria: 'Adicionales',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Queso', cantidad: 30, unidad: 'gramos' }],
    informacionNutricional: { calorias: 120, proteinas: 8, carbohidratos: 1, grasas: 10 },
    tiempoPreparacion: 1,
    popularidad: 40,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '48',
    nombre: 'Fruta Adicional',
    tipo: 'adicional',
    precioCompra: 1000,
    precioVenta: 2000,
    descripcion: 'Porción adicional de cualquier fruta',
    categoria: 'Adicionales',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Fruta', cantidad: 50, unidad: 'gramos' }],
    informacionNutricional: { calorias: 40, proteinas: 1, carbohidratos: 10, grasas: 0 },
    tiempoPreparacion: 2,
    popularidad: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '49',
    nombre: 'Topping Adicional',
    tipo: 'adicional',
    precioCompra: 1000,
    precioVenta: 2000,
    descripcion: 'Porción adicional de cualquier topping',
    categoria: 'Adicionales',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [{ nombre: 'Topping', cantidad: 20, unidad: 'gramos' }],
    informacionNutricional: { calorias: 80, proteinas: 1, carbohidratos: 12, grasas: 3 },
    tiempoPreparacion: 1,
    popularidad: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let users = [
  {
    id: '1',
    nombre: 'Administrador',
    email: 'admin@waffleria.com',
    password: '$2a$10$K8K8K8K8K8K8K8K8K8K8KO', // "admin123" hasheado
    rol: 'admin',
    ultimoAcceso: new Date()
  },
  {
    id: '2',
    nombre: 'Gerente',
    email: 'gerente@waffleria.com',
    password: '$2a$10$K8K8K8K8K8K8K8K8K8K8KO', // "gerente123" hasheado
    rol: 'gerente',
    ultimoAcceso: new Date()
  },
  {
    id: '3',
    nombre: 'Cajero',
    email: 'cajero@waffleria.com',
    password: '$2a$10$K8K8K8K8K8K8K8K8K8K8KO', // "cajero123" hasheado
    rol: 'cajero',
    ultimoAcceso: new Date()
  }
];

let nextProductId = 50;

// Simulación de operaciones de base de datos
const mockDB = {
  // Productos
  findProducts: (filters = {}) => {
    let filteredProducts = [...products];

    if (filters.tipo) {
      filteredProducts = filteredProducts.filter(p => p.tipo === filters.tipo);
    }
    if (filters.categoria) {
      filteredProducts = filteredProducts.filter(p => p.categoria === filters.categoria);
    }
    if (filters.disponible !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.disponible === filters.disponible);
    }
    if (filters.buscar) {
      const searchLower = filters.buscar.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.nombre.toLowerCase().includes(searchLower) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(searchLower))
      );
    }

    return filteredProducts;
  },

  findProductById: (id) => {
    return products.find(p => p._id === id);
  },

  createProduct: (productData) => {
    const newProduct = {
      _id: nextProductId.toString(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    nextProductId++;
    products.push(newProduct);
    return newProduct;
  },

  updateProduct: (id, updateData) => {
    const index = products.findIndex(p => p._id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updateData,
      updatedAt: new Date()
    };
    return products[index];
  },

  deleteProduct: (id) => {
    const index = products.findIndex(p => p._id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  },

  findProductByName: (name) => {
    return products.find(p => p.nombre.toLowerCase() === name.toLowerCase());
  },

  // Usuarios
  findUserByEmail: (email) => {
    return users.find(u => u.email === email);
  },

  findUserById: (id) => {
    return users.find(u => u.id === id);
  }
};

module.exports = mockDB;