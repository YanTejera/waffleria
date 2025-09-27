import React, { useState, useEffect } from 'react';
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiSearch,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiUser,
  FiClock,
  FiCheck,
  FiX,
  FiHeart,
  FiStar,
  FiZap
} from 'react-icons/fi';
import { uploadAPI } from '../services/api';

const ModernPOS = () => {
  const [selectedCategory, setSelectedCategory] = useState('waffles');
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', table: '' });
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'waffles', name: 'Waffles', icon: '🧇', color: 'from-amber-500 to-orange-600' },
    { id: 'helados', name: 'Helados', icon: '🍦', color: 'from-blue-500 to-cyan-600' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤', color: 'from-green-500 to-emerald-600' },
    { id: 'personalizados', name: 'Especiales', icon: '⭐', color: 'from-purple-500 to-pink-600' }
  ];

  const [products, setProducts] = useState([]);

  const paymentMethods = [
    { id: 'efectivo', name: 'Efectivo', icon: FiDollarSign, color: 'from-green-500 to-green-600' },
    { id: 'tarjeta', name: 'Tarjeta', icon: FiCreditCard, color: 'from-blue-500 to-blue-600' },
    { id: 'nequi', name: 'Nequi', icon: FiSmartphone, color: 'from-purple-500 to-purple-600' }
  ];

  // Cargar productos desde la API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?disponible=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedProducts = data.productos.map(product => ({
          id: product._id,
          name: product.nombre,
          price: product.precioVenta,
          category: product.tipo,
          available: product.disponible,
          description: product.descripcion || '',
          image: product.imagen,
          popularidad: product.popularidad || 0,
          tiempoPreparacion: product.tiempoPreparacion || 5,
          informacionNutricional: product.informacionNutricional || {}
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.category === selectedCategory &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const processOrder = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    alert(`Pedido procesado por ${formatCurrency(getTotalAmount())}`);
    setCart([]);
    setCustomerInfo({ name: '', table: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Modern Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧇</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">La Waffleria</h1>
                <p className="text-gray-400">Punto de Venta Moderno</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-700/50 rounded-xl px-4 py-2 flex items-center gap-2 border border-gray-600/50">
                <FiUser className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cliente"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-transparent text-white placeholder-gray-400 border-none outline-none w-32"
                />
              </div>
              <div className="bg-gray-700/50 rounded-xl px-4 py-2 flex items-center gap-2 border border-gray-600/50">
                <span className="text-gray-400">#</span>
                <input
                  type="text"
                  placeholder="Mesa"
                  value={customerInfo.table}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, table: e.target.value }))}
                  className="bg-transparent text-white placeholder-gray-400 border-none outline-none w-20"
                />
              </div>
              <div className="bg-green-500/20 text-green-400 rounded-xl px-4 py-2 flex items-center gap-2 border border-green-500/30">
                <FiClock className="h-4 w-4" />
                <span className="text-sm font-medium">{new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-700/50">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg shadow-${category.color.split('-')[1]}-500/25`
                      : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 animate-pulse">
                    <div className="bg-gray-700 rounded-xl h-40 mb-4"></div>
                    <div className="bg-gray-700 rounded h-4 mb-2"></div>
                    <div className="bg-gray-700 rounded h-3 w-2/3"></div>
                  </div>
                ))
              ) : (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/10 group cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="relative mb-4">
                      {product.image ? (
                        <img
                          src={uploadAPI.getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center">
                          <span className="text-4xl opacity-50">
                            {product.category === 'waffles' ? '🧇' :
                             product.category === 'helados' ? '🍦' :
                             product.category === 'bebidas' ? '🥤' : '🍽️'}
                          </span>
                        </div>
                      )}
                      {product.popularidad > 80 && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
                          <FiStar className="h-3 w-3" />
                          Popular
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                        <FiClock className="h-3 w-3" />
                        {product.tiempoPreparacion}min
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-amber-400">
                          {formatCurrency(product.price)}
                        </span>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiPlus className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
                  <FiShoppingCart className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Pedido</h3>
                {cart.length > 0 && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl opacity-30 mb-4">🛒</div>
                  <p className="text-gray-400">Carrito vacío</p>
                  <p className="text-sm text-gray-500 mt-2">Selecciona productos para agregar</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-700/50 rounded-xl p-3 border border-gray-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white text-sm">{item.name}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 0)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-600 hover:bg-gray-500 text-white p-1 rounded"
                            >
                              <FiMinus className="h-3 w-3" />
                            </button>
                            <span className="text-white font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-amber-500 hover:bg-amber-600 text-white p-1 rounded"
                            >
                              <FiPlus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-amber-400 font-bold">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-white">Total:</span>
                        <span className="text-2xl font-bold text-amber-400">
                          {formatCurrency(getTotalAmount())}
                        </span>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400 mb-2">Método de pago:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {paymentMethods.map(method => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                              paymentMethod === method.id
                                ? `bg-gradient-to-r ${method.color} text-white`
                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                            }`}
                          >
                            <method.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{method.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={processOrder}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <FiCheck className="h-5 w-5" />
                      Procesar Pedido
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPOS;