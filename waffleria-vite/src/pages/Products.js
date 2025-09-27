import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import ProductForm from '../components/products/ProductForm';
import { uploadAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    buscar: '',
    categoria: '',
    tipo: '',
    disponible: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // Cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.buscar) queryParams.append('buscar', filters.buscar);
      if (filters.categoria) queryParams.append('categoria', filters.categoria);
      if (filters.tipo) queryParams.append('tipo', filters.tipo);
      if (filters.disponible) queryParams.append('disponible', filters.disponible);
      queryParams.append('page', pagination.currentPage);

      const response = await fetch(`/api/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.productos);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          total: data.total
        });
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Guardar producto
  const handleSaveProduct = async (productData) => {
    try {
      setFormLoading(true);
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : '/api/products';

      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error al guardar producto');
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Producto eliminado');
        fetchProducts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  // Cambiar disponibilidad
  const toggleAvailability = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}/toggle-availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Disponibilidad actualizada');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Error al cambiar disponibilidad');
    }
  };

  // Manejar cambios en filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Efectos
  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  // Funciones auxiliares
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryLabel = (categoria) => {
    const labels = {
      waffles: 'Waffles',
      helados: 'Helados',
      bebidas: 'Bebidas',
      frutas: 'Frutas',
      toppings: 'Toppings'
    };
    return labels[categoria] || categoria;
  };

  const getSubcategoryLabel = (subcategoria) => {
    const labels = {
      gaseosas: 'Gaseosas',
      aguas: 'Aguas',
      jugos: 'Jugos',
      frutas_frescas: 'Frutas Frescas',
      cremas: 'Cremas'
    };
    return labels[subcategoria] || subcategoria;
  };

  const getTypeLabel = (tipo) => {
    const labels = {
      waffles: 'Waffles',
      helados: 'Helados',
      bebidas: 'Bebidas',
      ingrediente: 'Ingrediente'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="text-white">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FiPackage className="h-8 w-8 text-amber-600" />
              Gestión de Productos
            </h1>
            <p className="text-gray-300 mt-1">Administra el menú de La Waffleria</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <FiPlus className="h-4 w-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
              value={filters.buscar}
              onChange={(e) => handleFilterChange('buscar', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select
              className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="waffles">Waffles</option>
              <option value="helados">Helados</option>
              <option value="bebidas">Bebidas</option>
              <option value="frutas">Frutas</option>
              <option value="toppings">Toppings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
            <select
              className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="waffles">Waffles</option>
              <option value="helados">Helados</option>
              <option value="bebidas">Bebidas</option>
              <option value="ingrediente">Ingrediente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
              value={filters.disponible}
              onChange={(e) => handleFilterChange('disponible', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Disponible</option>
              <option value="false">No disponible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-gray-300">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <FiPackage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">No hay productos disponibles</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 mt-4 mx-auto"
            >
              <FiPlus className="h-4 w-4" />
              Crear primer producto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left p-4 text-gray-300 font-semibold">Producto</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Categoría</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Tipo</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Precio Compra</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Precio Venta</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Ganancia</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Popularidad</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const ganancia = product.precioVenta - product.precioCompra;
                  const margen = ((ganancia / product.precioVenta) * 100).toFixed(1);

                  return (
                    <tr key={product._id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                            {product.imagen ? (
                              <img
                                src={uploadAPI.getImageUrl(product.imagen)}
                                alt={product.nombre}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="text-lg">
                                {product.tipo === 'waffles' ? '🧇' :
                                 product.tipo === 'helados' ? '🍦' :
                                 product.tipo === 'ingrediente' && product.categoria === 'frutas' ? '🍓' :
                                 product.tipo === 'ingrediente' && product.categoria === 'toppings' ? '🍫' :
                                 product.tipo === 'bebidas' ? '🥤' : '🍽️'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.nombre}</p>
                            <p className="text-sm text-gray-400">
                              {product.descripcion || 'Sin descripción'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-900/30 text-blue-300 border border-blue-700/50">
                          {getCategoryLabel(product.categoria)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{getTypeLabel(product.tipo)}</td>
                      <td className="p-4 font-medium text-gray-300">
                        {formatPrice(product.precioCompra)}
                      </td>
                      <td className="p-4 font-semibold text-white">
                        {formatPrice(product.precioVenta)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className={`font-medium ${
                            ganancia > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {formatPrice(ganancia)}
                          </p>
                          <p className="text-xs text-gray-400">{margen}%</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleAvailability(product._id)}
                          className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                            product.disponible
                              ? 'bg-green-900/30 text-green-300 border border-green-700/50 hover:bg-green-800/30'
                              : 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50 hover:bg-yellow-800/30'
                          }`}
                        >
                          {product.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          ⭐ {product.popularidad || 0}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowForm(true);
                            }}
                            className="p-2 hover:bg-blue-900/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                            title="Editar producto"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                            title="Eliminar producto"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
          <p className="text-sm text-gray-300">
            Mostrando {((pagination.currentPage - 1) * 50) + 1}-{Math.min(pagination.currentPage * 50, pagination.total)} de {pagination.total} productos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pagination.currentPage === page
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-600/50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default Products;