// Mock data para desarrollo sin MongoDB
let products = [
  {
    _id: '1',
    nombre: 'Waffle Clásico',
    tipo: 'waffles',
    precioCompra: 5000,
    precioVenta: 8000,
    descripcion: 'Waffle tradicional belga con mantequilla',
    categoria: 'waffles',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Harina', cantidad: 200, unidad: 'gramos' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' }
    ],
    informacionNutricional: {
      calorias: 320,
      proteinas: 8,
      carbohidratos: 45,
      grasas: 12
    },
    tiempoPreparacion: 5,
    popularidad: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    nombre: 'Waffle Premium',
    tipo: 'waffles',
    precioCompra: 7000,
    precioVenta: 12000,
    descripcion: 'Waffle con helado y topping incluido',
    categoria: 'waffles',
    esPlato: true,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Harina premium', cantidad: 200, unidad: 'gramos' },
      { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' },
      { nombre: 'Helado', cantidad: 1, unidad: 'bola' }
    ],
    informacionNutricional: {
      calorias: 480,
      proteinas: 12,
      carbohidratos: 58,
      grasas: 18
    },
    tiempoPreparacion: 7,
    popularidad: 92,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    nombre: 'Helado Vainilla',
    tipo: 'helados',
    precioCompra: 2000,
    precioVenta: 3500,
    descripcion: 'Helado artesanal de vainilla',
    categoria: 'helados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Leche', cantidad: 200, unidad: 'ml' },
      { nombre: 'Vainilla', cantidad: 5, unidad: 'ml' }
    ],
    informacionNutricional: {
      calorias: 150,
      proteinas: 4,
      carbohidratos: 18,
      grasas: 8
    },
    tiempoPreparacion: 2,
    popularidad: 78,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    nombre: 'Helado Chocolate',
    tipo: 'helados',
    precioCompra: 2200,
    precioVenta: 3800,
    descripcion: 'Helado artesanal de chocolate',
    categoria: 'helados',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Leche', cantidad: 200, unidad: 'ml' },
      { nombre: 'Chocolate', cantidad: 50, unidad: 'gramos' }
    ],
    informacionNutricional: {
      calorias: 180,
      proteinas: 5,
      carbohidratos: 22,
      grasas: 9
    },
    tiempoPreparacion: 2,
    popularidad: 82,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Bebidas
  {
    _id: '5',
    nombre: 'Coca Cola',
    tipo: 'bebidas',
    precioCompra: 1500,
    precioVenta: 2500,
    descripcion: 'Bebida gaseosa 350ml',
    categoria: 'bebidas',
    subcategoria: 'gaseosas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [],
    informacionNutricional: {
      calorias: 140,
      proteinas: 0,
      carbohidratos: 39,
      grasas: 0
    },
    tiempoPreparacion: 1,
    popularidad: 65,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6',
    nombre: 'Agua',
    tipo: 'bebidas',
    precioCompra: 800,
    precioVenta: 1500,
    descripcion: 'Agua natural 500ml',
    categoria: 'bebidas',
    subcategoria: 'aguas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [],
    informacionNutricional: {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    },
    tiempoPreparacion: 1,
    popularidad: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '7',
    nombre: 'Jugo Natural',
    tipo: 'bebidas',
    precioCompra: 2500,
    precioVenta: 4000,
    descripcion: 'Jugo de frutas naturales',
    categoria: 'bebidas',
    subcategoria: 'jugos',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Fruta', cantidad: 200, unidad: 'gramos' },
      { nombre: 'Agua', cantidad: 300, unidad: 'ml' }
    ],
    informacionNutricional: {
      calorias: 80,
      proteinas: 1,
      carbohidratos: 20,
      grasas: 0
    },
    tiempoPreparacion: 3,
    popularidad: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Frutas (para toppings)
  {
    _id: '8',
    nombre: 'Fresas',
    tipo: 'ingrediente',
    precioCompra: 1200,
    precioVenta: 2000,
    descripcion: 'Fresas frescas cortadas',
    categoria: 'frutas',
    subcategoria: 'frutas_frescas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Fresas', cantidad: 100, unidad: 'gramos' }
    ],
    informacionNutricional: {
      calorias: 32,
      proteinas: 1,
      carbohidratos: 8,
      grasas: 0
    },
    tiempoPreparacion: 2,
    popularidad: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '9',
    nombre: 'Banano',
    tipo: 'ingrediente',
    precioCompra: 800,
    precioVenta: 1500,
    descripcion: 'Banano en rodajas',
    categoria: 'frutas',
    subcategoria: 'frutas_frescas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Banano', cantidad: 120, unidad: 'gramos' }
    ],
    informacionNutricional: {
      calorias: 89,
      proteinas: 1,
      carbohidratos: 23,
      grasas: 0
    },
    tiempoPreparacion: 1,
    popularidad: 68,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Toppings/Cremas
  {
    _id: '10',
    nombre: 'Nutella',
    tipo: 'ingrediente',
    precioCompra: 800,
    precioVenta: 1500,
    descripcion: 'Crema de avellanas',
    categoria: 'toppings',
    subcategoria: 'cremas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Nutella', cantidad: 30, unidad: 'gramos' }
    ],
    informacionNutricional: {
      calorias: 160,
      proteinas: 2,
      carbohidratos: 17,
      grasas: 11
    },
    tiempoPreparacion: 1,
    popularidad: 88,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '11',
    nombre: 'Arequipe',
    tipo: 'ingrediente',
    precioCompra: 600,
    precioVenta: 1200,
    descripcion: 'Dulce de leche tradicional',
    categoria: 'toppings',
    subcategoria: 'cremas',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [
      { nombre: 'Arequipe', cantidad: 35, unidad: 'gramos' }
    ],
    informacionNutricional: {
      calorias: 120,
      proteinas: 2,
      carbohidratos: 20,
      grasas: 4
    },
    tiempoPreparacion: 1,
    popularidad: 82,
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

let nextProductId = 12;

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