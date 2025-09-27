import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ToppingsManager = () => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filtros específicos para toppings
  const [filters, setFilters] = useState({
    buscar: '',
    subcategoria: '',
    disponible: ''
  });

  // Cargar solo toppings (categoria: 'toppings')
  const fetchToppings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('categoria', 'toppings'); // Solo toppings

      if (filters.buscar) queryParams.append('buscar', filters.buscar);
      if (filters.subcategoria) queryParams.append('subcategoria', filters.subcategoria);
      if (filters.disponible) queryParams.append('disponible', filters.disponible);

      const response = await fetch(`http://localhost:9003/api/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setToppings(data.productos);
      }
    } catch (error) {
      console.error('Error loading toppings:', error);
      toast.error('Error al cargar toppings');
    } finally {
      setLoading(false);
    }
  };

  // Crear/editar topping
  const handleSaveTopping = async (toppingData) => {
    try {
      setFormLoading(true);

      // Asegurar que sea un topping
      const toppingProductData = {
        ...toppingData,
        tipo: 'ingrediente',
        categoria: 'toppings',
        esPlato: false
      };

      const url = editingTopping
        ? `http://localhost:9003/api/products/${editingTopping._id}`
        : 'http://localhost:9003/api/products';

      const method = editingTopping ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(toppingProductData)
      });

      if (response.ok) {
        toast.success(editingTopping ? 'Topping actualizado' : 'Topping creado');
        setShowForm(false);
        setEditingTopping(null);
        fetchToppings();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al guardar topping');
      }
    } catch (error) {
      console.error('Error saving topping:', error);
      toast.error('Error al guardar topping');
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar topping
  const handleDeleteTopping = async (toppingId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este topping?')) return;

    try {
      const response = await fetch(`http://localhost:9003/api/products/${toppingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Topping eliminado');
        fetchToppings();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al eliminar topping');
      }
    } catch (error) {
      console.error('Error deleting topping:', error);
      toast.error('Error al eliminar topping');
    }
  };

  // Cambiar disponibilidad
  const toggleAvailability = async (toppingId) => {
    try {
      const response = await fetch(`http://localhost:9003/api/products/${toppingId}/toggle-availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Disponibilidad actualizada');
        fetchToppings();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Error al cambiar disponibilidad');
    }
  };

  useEffect(() => {
    fetchToppings();
  }, [filters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getToppingIcon = (subcategoria) => {
    switch (subcategoria) {
      case 'cremas': return '🍫';
      case 'frutas_frescas': return '🍓';
      default: return '✨';
    }
  };

  const getSubcategoryLabel = (subcategoria) => {
    const labels = {
      cremas: 'Cremas',
      frutas_frescas: 'Frutas Frescas'
    };
    return labels[subcategoria] || subcategoria;
  };

  const getSubcategoryColor = (subcategoria) => {
    switch (subcategoria) {
      case 'cremas': return 'status-warning';
      case 'frutas_frescas': return 'status-success';
      default: return 'status-info';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiStar className="h-8 w-8 text-purple-600" />
            Gestión de Toppings
          </h1>
          <p className="text-gray-600 mt-1">Administra toppings por categorías: cremas, dulces, frutos secos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo Topping
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Buscar</label>
            <input
              type="text"
              placeholder="Nombre del topping..."
              className="form-input"
              value={filters.buscar}
              onChange={(e) => setFilters(prev => ({ ...prev, buscar: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Subcategoría</label>
            <select
              className="form-select"
              value={filters.subcategoria}
              onChange={(e) => setFilters(prev => ({ ...prev, subcategoria: e.target.value }))}
            >
              <option value="">Todas</option>
              <option value="cremas">Cremas</option>
              <option value="frutas_frescas">Frutas Frescas</option>
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

      {/* Lista de toppings */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando toppings...</p>
          </div>
        ) : toppings.length === 0 ? (
          <div className="p-8 text-center">
            <FiStar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay toppings disponibles</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary mt-4"
            >
              <FiPlus className="h-4 w-4" />
              Crear primer topping
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Topping</th>
                  <th>Subcategoría</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                  <th>Ganancia</th>
                  <th>Popularidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {toppings.map((topping) => {
                  const ganancia = topping.precioVenta - topping.precioCompra;
                  const margen = ((ganancia / topping.precioVenta) * 100).toFixed(1);

                  return (
                    <tr key={topping._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">
                              {getToppingIcon(topping.subcategoria)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{topping.nombre}</p>
                            <p className="text-sm text-gray-500">
                              {topping.descripcion || 'Sin descripción'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {topping.subcategoria && (
                          <span className={`status-badge ${getSubcategoryColor(topping.subcategoria)}`}>
                            {getSubcategoryLabel(topping.subcategoria)}
                          </span>
                        )}
                      </td>
                      <td className="font-medium text-gray-600">
                        {formatPrice(topping.precioCompra)}
                      </td>
                      <td className="font-semibold">
                        {formatPrice(topping.precioVenta)}
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
                        <div className="flex items-center gap-1">
                          ⭐ {topping.popularidad || 0}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleAvailability(topping._id)}
                          className={`status-badge ${
                            topping.disponible ? 'status-success' : 'status-warning'
                          } cursor-pointer`}
                        >
                          {topping.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTopping(topping);
                              setShowForm(true);
                            }}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Editar topping"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTopping(topping._id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                            title="Eliminar topping"
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

      {/* Modal de formulario específico para toppings (después lo desarrollaremos) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingTopping ? 'Editar' : 'Crear'} Topping
            </h2>
            <p className="text-gray-600 mb-4">
              Formulario específico para toppings en desarrollo...
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTopping(null);
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

export default ToppingsManager;