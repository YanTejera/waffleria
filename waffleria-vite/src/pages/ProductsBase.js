import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiDroplet, FiCoffee } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ProductsBase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filtros específicos para productos base
  const [filters, setFilters] = useState({
    buscar: '',
    categoria: '',
    subcategoria: '',
    disponible: ''
  });

  // Cargar solo productos base (bebidas, frutas, ingredientes)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('tipo', 'ingrediente'); // Solo ingredientes/productos base

      if (filters.buscar) queryParams.append('buscar', filters.buscar);
      if (filters.categoria) queryParams.append('categoria', filters.categoria);
      if (filters.disponible) queryParams.append('disponible', filters.disponible);

      const response = await fetch(`http://localhost:9003/api/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.productos);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos base');
    } finally {
      setLoading(false);
    }
  };

  // Crear/editar producto base
  const handleSaveProduct = async (productData) => {
    try {
      setFormLoading(true);

      // Asegurar que sea un ingrediente
      const baseProductData = {
        ...productData,
        tipo: 'ingrediente',
        esPlato: false
      };

      const url = editingProduct
        ? `http://localhost:9003/api/products/${editingProduct._id}`
        : 'http://localhost:9003/api/products';

      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(baseProductData)
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
    if (!confirm('¿Estás seguro de que quieres eliminar este producto base?')) return;

    try {
      const response = await fetch(`http://localhost:9003/api/products/${productId}`, {
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
      const response = await fetch(`http://localhost:9003/api/products/${productId}/toggle-availability`, {
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

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryIcon = (categoria) => {
    switch (categoria) {
      case 'bebidas': return '🥤';
      case 'frutas': return '🍓';
      case 'toppings': return '🍫';
      default: return '📦';
    }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiPackage className="h-8 w-8 text-blue-600" />
            Gestión de Productos Base
          </h1>
          <p className="text-gray-600 mt-1">Administra bebidas, aguas, gaseosas, frutas y ingredientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo Producto Base
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Buscar</label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              className="form-input"
              value={filters.buscar}
              onChange={(e) => setFilters(prev => ({ ...prev, buscar: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={filters.categoria}
              onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
            >
              <option value="">Todas</option>
              <option value="bebidas">Bebidas</option>
              <option value="frutas">Frutas</option>
              <option value="toppings">Toppings</option>
            </select>
          </div>
          <div>
            <label className="form-label">Subcategoría</label>
            <select
              className="form-select"
              value={filters.subcategoria}
              onChange={(e) => setFilters(prev => ({ ...prev, subcategoria: e.target.value }))}
            >
              <option value="">Todas</option>
              <option value="gaseosas">Gaseosas</option>
              <option value="aguas">Aguas</option>
              <option value="jugos">Jugos</option>
              <option value="frutas_frescas">Frutas Frescas</option>
              <option value="cremas">Cremas</option>
            </select>
          </div>
          <div>
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              value={filters.disponible}
              onChange={(e) => setFilters(prev => ({ ...prev, disponible: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="true">Disponible</option>
              <option value="false">No disponible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando productos base...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <FiPackage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay productos base disponibles</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary mt-4"
            >
              <FiPlus className="h-4 w-4" />
              Crear primer producto base
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Subcategoría</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                  <th>Ganancia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const ganancia = product.precioVenta - product.precioCompra;
                  const margen = ((ganancia / product.precioVenta) * 100).toFixed(1);

                  return (
                    <tr key={product._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">
                              {getCategoryIcon(product.categoria)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{product.nombre}</p>
                            <p className="text-sm text-gray-500">
                              {product.descripcion || 'Sin descripción'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge status-info">
                          {product.categoria}
                        </span>
                      </td>
                      <td>
                        {product.subcategoria && (
                          <span className="status-badge status-secondary">
                            {getSubcategoryLabel(product.subcategoria)}
                          </span>
                        )}
                      </td>
                      <td className="font-medium text-gray-600">
                        {formatPrice(product.precioCompra)}
                      </td>
                      <td className="font-semibold">
                        {formatPrice(product.precioVenta)}
                      </td>
                      <td>
                        <div className="text-sm">
                          <p className={`font-medium ${
                            ganancia > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPrice(ganancia)}
                          </p>
                          <p className="text-xs text-gray-500">{margen}%</p>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleAvailability(product._id)}
                          className={`status-badge ${
                            product.disponible ? 'status-success' : 'status-warning'
                          } cursor-pointer`}
                        >
                          {product.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowForm(true);
                            }}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Editar producto"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
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

      {/* Modal de formulario básico (después crearemos uno específico) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Editar' : 'Crear'} Producto Base
            </h2>
            <p className="text-gray-600 mb-4">
              Formulario específico para productos base en desarrollo...
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="btn btn-outline flex-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsBase;