import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiChef } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const DishCreator = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filtros específicos para platos
  const [filters, setFilters] = useState({
    buscar: '',
    tipo: '',
    disponible: ''
  });

  // Cargar solo platos (esPlato: true)
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.buscar) queryParams.append('buscar', filters.buscar);
      if (filters.tipo) queryParams.append('tipo', filters.tipo);
      if (filters.disponible) queryParams.append('disponible', filters.disponible);

      const response = await fetch(`http://localhost:9003/api/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar solo los platos
        const platosData = data.productos.filter(product => product.esPlato === true);
        setDishes(platosData);
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
      toast.error('Error al cargar platos');
    } finally {
      setLoading(false);
    }
  };

  // Crear/editar plato
  const handleSaveDish = async (dishData) => {
    try {
      setFormLoading(true);

      // Asegurar que sea un plato
      const platoDishData = {
        ...dishData,
        esPlato: true
      };

      const url = editingDish
        ? `http://localhost:9003/api/products/${editingDish._id}`
        : 'http://localhost:9003/api/products';

      const method = editingDish ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(platoDishData)
      });

      if (response.ok) {
        toast.success(editingDish ? 'Plato actualizado' : 'Plato creado');
        setShowForm(false);
        setEditingDish(null);
        fetchDishes();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al guardar plato');
      }
    } catch (error) {
      console.error('Error saving dish:', error);
      toast.error('Error al guardar plato');
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar plato
  const handleDeleteDish = async (dishId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este plato?')) return;

    try {
      const response = await fetch(`http://localhost:9003/api/products/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Plato eliminado');
        fetchDishes();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al eliminar plato');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Error al eliminar plato');
    }
  };

  // Cambiar disponibilidad
  const toggleAvailability = async (dishId) => {
    try {
      const response = await fetch(`http://localhost:9003/api/products/${dishId}/toggle-availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Disponibilidad actualizada');
        fetchDishes();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Error al cambiar disponibilidad');
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [filters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDishIcon = (tipo) => {
    switch (tipo) {
      case 'waffles': return '🧇';
      case 'helados': return '🍦';
      case 'bebidas': return '🥤';
      default: return '🍽️';
    }
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      waffles: 'Waffle',
      helados: 'Helado',
      bebidas: 'Bebida'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiChef className="h-8 w-8 text-orange-600" />
            Creación de Platos
          </h1>
          <p className="text-gray-600 mt-1">Crea y administra waffles personalizados y platos completos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo Plato
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Buscar</label>
            <input
              type="text"
              placeholder="Nombre del plato..."
              className="form-input"
              value={filters.buscar}
              onChange={(e) => setFilters(prev => ({ ...prev, buscar: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Tipo de Plato</label>
            <select
              className="form-select"
              value={filters.tipo}
              onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="waffles">Waffles</option>
              <option value="helados">Helados</option>
              <option value="bebidas">Bebidas</option>
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

      {/* Lista de platos */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando platos...</p>
          </div>
        ) : dishes.length === 0 ? (
          <div className="p-8 text-center">
            <FiChef className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay platos creados</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary mt-4"
            >
              <FiPlus className="h-4 w-4" />
              Crear primer plato
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Plato</th>
                  <th>Tipo</th>
                  <th>Ingredientes</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                  <th>Ganancia</th>
                  <th>Tiempo Prep.</th>
                  <th>Estado</th>
                  <th>Popularidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => {
                  const ganancia = dish.precioVenta - dish.precioCompra;
                  const margen = ((ganancia / dish.precioVenta) * 100).toFixed(1);

                  return (
                    <tr key={dish._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">
                              {getDishIcon(dish.tipo)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{dish.nombre}</p>
                            <p className="text-sm text-gray-500">
                              {dish.descripcion || 'Sin descripción'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge status-warning">
                          {getTipoLabel(dish.tipo)}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          {dish.ingredientes && dish.ingredientes.length > 0 ? (
                            <div>
                              <p className="font-medium">{dish.ingredientes.length} ingredientes</p>
                              <p className="text-xs text-gray-500">
                                {dish.ingredientes.slice(0, 2).map(ing => ing.nombre).join(', ')}
                                {dish.ingredientes.length > 2 && '...'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">Sin ingredientes</span>
                          )}
                        </div>
                      </td>
                      <td className="font-medium text-gray-600">
                        {formatPrice(dish.precioCompra)}
                      </td>
                      <td className="font-semibold">
                        {formatPrice(dish.precioVenta)}
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
                        <span className="text-sm text-gray-600">
                          {dish.tiempoPreparacion || 0} min
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleAvailability(dish._id)}
                          className={`status-badge ${
                            dish.disponible ? 'status-success' : 'status-warning'
                          } cursor-pointer`}
                        >
                          {dish.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          ⭐ {dish.popularidad || 0}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingDish(dish);
                              setShowForm(true);
                            }}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Editar plato"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish._id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                            title="Eliminar plato"
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

      {/* Modal de formulario específico para platos (después lo desarrollaremos) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingDish ? 'Editar' : 'Crear'} Plato
            </h2>
            <p className="text-gray-600 mb-4">
              Formulario especializado para creación de platos en desarrollo...
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingDish(null);
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

export default DishCreator;