import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiStar,
  FiClock,
  FiZap,
  FiHeart,
  FiPlus
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import AdvancedCart from '../components/AdvancedCart';
import { uploadAPI } from '../services/api';

const POS = () => {
  const [selectedCategory, setSelectedCategory] = useState('waffles');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const { addItem } = useCart();

  const categories = [
    { id: 'waffles', name: 'Waffles', icon: '🧇', color: 'from-amber-500 to-orange-600' },
    { id: 'helados', name: 'Helados', icon: '🍦', color: 'from-blue-500 to-cyan-600' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤', color: 'from-green-500 to-emerald-600' },
    { id: 'personalizados', name: 'Especiales', icon: '⭐', color: 'from-purple-500 to-pink-600' }
  ];

  const [products, setProducts] = useState([]);

  const [toppings, setToppings] = useState([
    { id: 1, name: 'Almendras', price: 2000, category: 'frutos-secos', stock: 20 },
    { id: 2, name: 'Nueces', price: 2500, category: 'frutos-secos', stock: 15 },
    { id: 3, name: 'Maní', price: 1500, category: 'frutos-secos', stock: 25 },
    { id: 4, name: 'Nutella', price: 3000, category: 'cremas', stock: 18 },
    { id: 5, name: 'Arequipe', price: 2500, category: 'cremas', stock: 22 },
    { id: 6, name: 'Mermelada de Fresa', price: 2000, category: 'cremas', stock: 16 },
    { id: 7, name: 'Helado Vainilla', price: 4000, category: 'helados', stock: 12 },
    { id: 8, name: 'Helado Chocolate', price: 4000, category: 'helados', stock: 10 },
    { id: 9, name: 'Helado Fresa', price: 4000, category: 'helados', stock: 8 },
    { id: 10, name: 'Fresas', price: 3000, category: 'frutas', stock: 30 },
    { id: 11, name: 'Banano', price: 2000, category: 'frutas', stock: 25 },
    { id: 12, name: 'Kiwi', price: 3500, category: 'frutas', stock: 12 }
  ]);

  const toppingCategories = [
    { id: 'frutos-secos', name: 'Frutos Secos', icon: '🥜' },
    { id: 'cremas', name: 'Cremas', icon: '🍯' },
    { id: 'helados', name: 'Helados', icon: '🍦' },
    { id: 'frutas', name: 'Frutas', icon: '🍓' }
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
          informacionNutricional: product.informacionNutricional || {},
          hasCustomization: product.tipo === 'waffles' || product.esPlato
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

  const openCustomizationModal = (product) => {
    setSelectedProduct(product);
    setSelectedToppings([]);
    setShowModal(true);
  };

  const addToCartDirectly = (product) => {
    addItem(product, {
      notes: '',
      toppings: []
    });
  };

  const addToCartFromModal = () => {
    if (selectedProduct) {
      addItem(selectedProduct, {
        notes: '',
        toppings: selectedToppings
      });
      setShowModal(false);
      setSelectedProduct(null);
      setSelectedToppings([]);
    }
  };

  const toggleTopping = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const calculateModalTotal = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.price + selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🧇</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white">Punto de Venta</h1>
                <p className="text-gray-300 mt-1">Sistema avanzado de pedidos</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Turno actual</p>
                <p className="text-lg font-semibold text-white">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Filter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative overflow-hidden p-4 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:scale-102'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    {selectedCategory === category.id && (
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-xl p-4 animate-pulse">
                      <div className="h-32 bg-gray-600/50 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-600/50 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600/50 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500">
                    Intenta con otra categoría o término de búsqueda
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-700/30 rounded-xl overflow-hidden border border-gray-600/30 hover:border-amber-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
                    >
                      {/* Product Image */}
                      <div className="h-32 bg-gradient-to-br from-gray-600 to-gray-700 relative overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {categories.find(c => c.id === product.category)?.icon || '🍽️'}
                          </div>
                        )}

                        {/* Product Badges */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {product.popularidad > 80 && (
                            <span className="bg-amber-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <FiStar className="h-3 w-3" />
                              Popular
                            </span>
                          )}
                          {product.tiempoPreparacion <= 3 && (
                            <span className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <FiZap className="h-3 w-3" />
                              Rápido
                            </span>
                          )}
                        </div>

                        {/* Prep Time */}
                        <div className="absolute bottom-2 right-2">
                          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FiClock className="h-3 w-3" />
                            {product.tiempoPreparacion}min
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-amber-400">
                            {formatCurrency(product.price)}
                          </span>

                          <div className="flex gap-2">
                            {product.hasCustomization ? (
                              <button
                                onClick={() => openCustomizationModal(product)}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-1 text-sm shadow-lg"
                              >
                                <FiPlus className="h-3 w-3" />
                                Personalizar
                              </button>
                            ) : (
                              <button
                                onClick={() => addToCartDirectly(product)}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-1 text-sm shadow-lg"
                              >
                                <FiPlus className="h-3 w-3" />
                                Agregar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Advanced Cart */}
          <div className="lg:col-span-1">
            <AdvancedCart />
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Personalizar - {selectedProduct.name}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {/* Product Summary */}
                <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-400">Precio base: {formatCurrency(selectedProduct.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-400">
                        Total: {formatCurrency(calculateModalTotal())}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toppings */}
                <div className="space-y-4">
                  {toppingCategories.map((category) => {
                    const categoryToppings = toppings.filter(t => t.category === category.id);
                    if (categoryToppings.length === 0) return null;

                    return (
                      <div key={category.id}>
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryToppings.map((topping) => {
                            const isSelected = selectedToppings.find(t => t.id === topping.id);
                            return (
                              <button
                                key={topping.id}
                                onClick={() => toggleTopping(topping)}
                                className={`p-3 rounded-lg border transition-all text-left ${
                                  isSelected
                                    ? 'bg-amber-600/50 border-amber-500/50 text-amber-100'
                                    : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm">{topping.name}</span>
                                  <span className="text-sm">{formatCurrency(topping.price)}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Stock: {topping.stock}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700/50 text-gray-300 py-3 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addToCartFromModal}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  Agregar al Carrito - {formatCurrency(calculateModalTotal())}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;