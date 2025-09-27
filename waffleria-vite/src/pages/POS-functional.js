import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI, ordersAPI, inventoryAPI, formatCurrency, uploadAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiGrid,
  FiList,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';

const POSFunctional = () => {
  const { user } = useAuth();

  // Estados principales
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['todos']);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);

  // Estados de la orden
  const [customer, setCustomer] = useState({ name: '', table: '' });
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [discount, setDiscount] = useState({ type: 'none', value: 0 });
  const [tip, setTip] = useState(0);

  // Estados de UI
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Cargar productos con inventario
      const productsResponse = await productsAPI.getAll({
        disponible: true,
        limit: 100
      });

      if (productsResponse.data) {
        setProducts(productsResponse.data.productos);

        // Extraer categorías únicas
        const uniqueCategories = ['todos', ...new Set(
          productsResponse.data.productos.map(p => p.categoria)
        )];
        setCategories(uniqueCategories);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'todos' || product.categoria === selectedCategory;
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const hasStock = product.inventario && product.inventario.cantidadActual > 0;

    return matchesCategory && matchesSearch && hasStock;
  });

  // Agregar al carrito
  const addToCart = (product) => {
    if (!product.inventario || product.inventario.cantidadActual === 0) {
      toast.error('Producto sin stock disponible');
      return;
    }

    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      if (existingItem.quantity >= product.inventario.cantidadActual) {
        toast.error('No hay suficiente stock disponible');
        return;
      }

      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        _id: product._id,
        nombre: product.nombre,
        precio: product.precio,
        quantity: 1,
        categoria: product.categoria,
        maxStock: product.inventario.cantidadActual
      }]);
    }

    toast.success(`${product.nombre} agregado al carrito`);
  };

  // Cambiar cantidad en carrito
  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item._id === productId) {
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
          return null; // Será filtrado
        }

        if (newQuantity > item.maxStock) {
          toast.error('No hay suficiente stock disponible');
          return item;
        }

        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  // Eliminar del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
    toast.success('Producto eliminado del carrito');
  };

  // Limpiar carrito
  const clearCart = () => {
    if (cart.length === 0) return;

    if (window.confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
      setCart([]);
      toast.success('Carrito limpiado');
    }
  };

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const discountAmount = discount.type === 'percentage'
    ? (subtotal * discount.value / 100)
    : (discount.type === 'fixed' ? discount.value : 0);
  const total = subtotal - discountAmount + tip;

  // Procesar orden
  const processOrder = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    try {
      setProcessingOrder(true);

      // Preparar items de la orden
      const orderItems = cart.map(item => ({
        productoId: item._id,
        cantidad: item.quantity,
        personalizacion: {}
      }));

      // Crear orden
      const orderData = {
        items: orderItems,
        cliente: {
          nombre: customer.name || 'Cliente',
          mesa: customer.table
        },
        metodoPago: paymentMethod,
        descuentos: {
          porcentaje: discount.type === 'percentage' ? discount.value : 0,
          monto: discount.type === 'fixed' ? discount.value : 0,
          motivo: discount.type !== 'none' ? 'Descuento aplicado' : ''
        },
        propina: tip,
        observaciones: ''
      };

      const response = await ordersAPI.create(orderData);

      if (response.data?.orden) {
        toast.success(`Orden #${response.data.orden.numeroOrden} creada exitosamente`);

        // Mostrar recibo
        showReceipt(response.data.orden);

        // Limpiar formulario
        setCart([]);
        setCustomer({ name: '', table: '' });
        setDiscount({ type: 'none', value: 0 });
        setTip(0);

        // Recargar productos para actualizar stock
        loadInitialData();
      }

    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(error.response?.data?.message || 'Error procesando la orden');
    } finally {
      setProcessingOrder(false);
    }
  };

  // Mostrar recibo
  const showReceipt = (order) => {
    const receiptText = `
🧇 LA WAFFLERIA
Orden #${order.numeroOrden}
${new Date(order.fechaCreacion).toLocaleString()}
============================
Cajero: ${user.nombre}
Cliente: ${order.cliente.nombre}
${order.cliente.mesa ? `Mesa: ${order.cliente.mesa}` : ''}
============================
${order.items.map(item =>
  `${item.producto.nombre} x${item.cantidad} - ${formatCurrency(item.subtotal)}`
).join('\n')}
============================
Subtotal: ${formatCurrency(order.subtotal)}
${order.descuentos.monto > 0 ? `Descuento: -${formatCurrency(order.descuentos.monto)}` : ''}
${order.propina > 0 ? `Propina: ${formatCurrency(order.propina)}` : ''}
TOTAL: ${formatCurrency(order.total)}
Método: ${order.metodoPago.toUpperCase()}
============================
¡Gracias por su compra!
    `;

    // En un entorno real, esto sería una impresión
    alert(receiptText);
  };

  // Categorías con nombres amigables
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'todos': '🏠 Todos',
      'waffle_tradicional': '🧇 Waffles Tradicionales',
      'waffle_premium': '🧇 Waffles Premium',
      'helado_artesanal': '🍦 Helados Artesanales',
      'helado_premium': '🍦 Helados Premium',
      'topping_frutas': '🍓 Frutas',
      'topping_cereales': '🥣 Cereales',
      'topping_frutos_secos': '🥜 Frutos Secos',
      'topping_dulces': '🍫 Dulces',
      'topping_salsas': '🍯 Salsas'
    };
    return categoryNames[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiShoppingCart className="h-6 w-6 text-amber-600" />
              Punto de Venta
            </h1>
            <p className="text-gray-600">Cajero: {user?.nombre}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadInitialData}
              className="btn btn-outline"
              disabled={loading}
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <FiGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <FiList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Panel de productos */}
        <div className="flex-1 p-6">
          {/* Búsqueda y filtros */}
          <div className="mb-6 space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categorías */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn whitespace-nowrap ${
                    selectedCategory === category
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {getCategoryDisplayName(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid/Lista de productos */}
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-2'
          }`}>
            {filteredProducts.map(product => (
              <div
                key={product._id}
                className={`card cursor-pointer hover:shadow-md transition-all ${
                  viewMode === 'grid' ? 'p-4' : 'p-3'
                }`}
                onClick={() => addToCart(product)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-square bg-amber-100 rounded-lg mb-3 flex items-center justify-center text-3xl overflow-hidden">
                      {product.imagen ? (
                        <img
                          src={uploadAPI.getImageUrl(product.imagen)}
                          alt={product.nombre}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '🧇';
                          }}
                        />
                      ) : (
                        '🧇'
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{product.nombre}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {product.descripcion}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-600 font-bold">
                        {formatCurrency(product.precio)}
                      </span>
                      <span className="text-xs text-green-600">
                        Stock: {product.inventario?.cantidadActual || 0}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                      {product.imagen ? (
                        <img
                          src={uploadAPI.getImageUrl(product.imagen)}
                          alt={product.nombre}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '🧇';
                          }}
                        />
                      ) : (
                        '🧇'
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.nombre}</h3>
                      <p className="text-sm text-gray-600">{product.descripcion}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-amber-600 font-bold">
                          {formatCurrency(product.precio)}
                        </span>
                        <span className="text-sm text-green-600">
                          Stock: {product.inventario?.cantidadActual || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <FiShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>

        {/* Panel del carrito */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Orden Actual</h2>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-red-600 text-sm hover:text-red-700">
                Limpiar
              </button>
            )}
          </div>

          {/* Información del cliente */}
          <div className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Nombre del cliente"
              className="form-input"
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Mesa (opcional)"
              className="form-input"
              value={customer.table}
              onChange={(e) => setCustomer({...customer, table: e.target.value})}
            />
          </div>

          {/* Items del carrito */}
          <div className="flex-1 overflow-y-auto mb-6">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <FiShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">El carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.nombre}</h4>
                      <p className="text-amber-600 text-sm">{formatCurrency(item.precio)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        <FiMinus className="h-3 w-3" />
                      </button>

                      <span className="w-8 text-center font-medium">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center"
                      >
                        <FiPlus className="h-3 w-3" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-2 text-red-600"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <>
              {/* Descuentos */}
              <div className="mb-4">
                <label className="form-label">Descuento</label>
                <div className="flex gap-2">
                  <select
                    className="form-select flex-1"
                    value={discount.type}
                    onChange={(e) => setDiscount({...discount, type: e.target.value, value: 0})}
                  >
                    <option value="none">Sin descuento</option>
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto fijo</option>
                  </select>
                  {discount.type !== 'none' && (
                    <input
                      type="number"
                      className="form-input w-20"
                      placeholder={discount.type === 'percentage' ? '%' : '$'}
                      value={discount.value}
                      onChange={(e) => setDiscount({...discount, value: parseFloat(e.target.value) || 0})}
                    />
                  )}
                </div>
              </div>

              {/* Propina */}
              <div className="mb-4">
                <label className="form-label">Propina</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Monto de propina"
                  value={tip}
                  onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Totales */}
              <div className="border-t pt-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Descuento:</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Propina:</span>
                    <span>{formatCurrency(tip)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Métodos de pago */}
              <div className="mb-6">
                <label className="form-label">Método de pago</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'efectivo', label: 'Efectivo', icon: FiDollarSign },
                    { value: 'tarjeta_credito', label: 'T. Crédito', icon: FiCreditCard },
                    { value: 'tarjeta_debito', label: 'T. Débito', icon: FiCreditCard },
                    { value: 'nequi', label: 'Nequi', icon: FiSmartphone }
                  ].map(method => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`btn ${
                        paymentMethod === method.value ? 'btn-primary' : 'btn-outline'
                      } text-xs`}
                    >
                      <method.icon className="h-3 w-3" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón procesar */}
              <button
                onClick={processOrder}
                disabled={processingOrder || cart.length === 0}
                className="btn btn-success w-full"
              >
                {processingOrder ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  `Procesar Orden - ${formatCurrency(total)}`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default POSFunctional;