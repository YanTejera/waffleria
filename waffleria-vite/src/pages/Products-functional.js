import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI, inventoryAPI, formatCurrency, uploadAPI } from '../services/api';
import ImageUpload from '../components/common/ImageUpload';
import toast from 'react-hot-toast';
import {
  FiPackage,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiUpload,
  FiX,
  FiSave,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';

const ProductsAdmin = () => {
  const { isManager } = useAuth();

  // Estados principales
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'waffle_base',
    precio: '',
    descripcion: '',
    categoria: 'waffle_tradicional',
    disponible: true,
    imagen: '',
    tiempoPreparacion: 5,
    informacionNutricional: {
      calorias: '',
      proteinas: '',
      carbohidratos: '',
      grasas: ''
    },
    // Datos de inventario inicial
    stockInicial: '',
    stockMinimo: 10,
    unidadMedida: 'unidades',
    costoUnitario: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorías disponibles
  const categories = [
    { value: 'waffle_tradicional', label: '🧇 Waffles Tradicionales' },
    { value: 'waffle_premium', label: '🧇 Waffles Premium' },
    { value: 'helado_artesanal', label: '🍦 Helados Artesanales' },
    { value: 'helado_premium', label: '🍦 Helados Premium' },
    { value: 'topping_frutas', label: '🍓 Toppings de Frutas' },
    { value: 'topping_cereales', label: '🥣 Cereales' },
    { value: 'topping_frutos_secos', label: '🥜 Frutos Secos' },
    { value: 'topping_dulces', label: '🍫 Dulces' },
    { value: 'topping_salsas', label: '🍯 Salsas' }
  ];

  const types = [
    { value: 'waffle_base', label: 'Waffle Base' },
    { value: 'helado', label: 'Helado' },
    { value: 'topping', label: 'Topping' }
  ];

  const units = [
    { value: 'unidades', label: 'Unidades' },
    { value: 'gramos', label: 'Gramos' },
    { value: 'kilogramos', label: 'Kilogramos' },
    { value: 'litros', label: 'Litros' },
    { value: 'mililitros', label: 'Mililitros' }
  ];

  // Cargar productos
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        limit: 100,
        page: 1
      });

      if (response.data?.productos) {
        setProducts(response.data.productos);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
    const matchesType = !selectedType || product.tipo === selectedType;
    const matchesAvailability = !showAvailableOnly || product.disponible;

    return matchesSearch && matchesCategory && matchesType && matchesAvailability;
  });

  // Abrir modal
  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setEditingProduct(product);

    if (product) {
      setFormData({
        nombre: product.nombre || '',
        tipo: product.tipo || 'waffle_base',
        precio: product.precio || '',
        descripcion: product.descripcion || '',
        categoria: product.categoria || 'waffle_tradicional',
        disponible: product.disponible !== undefined ? product.disponible : true,
        imagen: product.imagen || '',
        tiempoPreparacion: product.tiempoPreparacion || 5,
        informacionNutricional: {
          calorias: product.informacionNutricional?.calorias || '',
          proteinas: product.informacionNutricional?.proteinas || '',
          carbohidratos: product.informacionNutricional?.carbohidratos || '',
          grasas: product.informacionNutricional?.grasas || ''
        },
        // Datos del inventario si existe
        stockInicial: product.inventario?.cantidadActual || '',
        stockMinimo: product.inventario?.cantidadMinima || 10,
        unidadMedida: product.inventario?.unidadMedida || 'unidades',
        costoUnitario: product.inventario?.costoUnitario || ''
      });
    } else {
      // Reset form for new product
      setFormData({
        nombre: '',
        tipo: 'waffle_base',
        precio: '',
        descripcion: '',
        categoria: 'waffle_tradicional',
        disponible: true,
        imagen: '',
        tiempoPreparacion: 5,
        informacionNutricional: {
          calorias: '',
          proteinas: '',
          carbohidratos: '',
          grasas: ''
        },
        stockInicial: '',
        stockMinimo: 10,
        unidadMedida: 'unidades',
        costoUnitario: ''
      });
    }

    setFormErrors({});
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({});
    setFormErrors({});
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.nombre?.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.precio || formData.precio <= 0) {
      errors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.descripcion?.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }

    if (modalMode === 'create') {
      if (!formData.stockInicial || formData.stockInicial < 0) {
        errors.stockInicial = 'El stock inicial es requerido';
      }

      if (!formData.costoUnitario || formData.costoUnitario <= 0) {
        errors.costoUnitario = 'El costo unitario es requerido';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('informacionNutricional.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        informacionNutricional: {
          ...prev.informacionNutricional,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Guardar producto
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setIsSubmitting(true);

      const productData = {
        nombre: formData.nombre.trim(),
        tipo: formData.tipo,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        disponible: formData.disponible,
        imagen: formData.imagen,
        tiempoPreparacion: parseInt(formData.tiempoPreparacion),
        informacionNutricional: {
          calorias: parseFloat(formData.informacionNutricional.calorias) || 0,
          proteinas: parseFloat(formData.informacionNutricional.proteinas) || 0,
          carbohidratos: parseFloat(formData.informacionNutricional.carbohidratos) || 0,
          grasas: parseFloat(formData.informacionNutricional.grasas) || 0
        }
      };

      let savedProduct;

      if (modalMode === 'create') {
        // Crear producto
        const response = await productsAPI.create(productData);
        savedProduct = response.data.producto;

        // Crear inventario inicial
        if (formData.stockInicial && formData.costoUnitario) {
          await inventoryAPI.create({
            productoId: savedProduct._id,
            cantidadActual: parseInt(formData.stockInicial),
            cantidadMinima: parseInt(formData.stockMinimo),
            cantidadMaxima: parseInt(formData.stockInicial) * 3,
            unidadMedida: formData.unidadMedida,
            costoUnitario: parseFloat(formData.costoUnitario),
            proveedor: {
              nombre: 'Proveedor Principal',
              contacto: 'contacto@proveedor.com',
              telefono: '+57 300 000 0000'
            }
          });
        }

        toast.success('Producto creado exitosamente');
      } else {
        // Actualizar producto
        const response = await productsAPI.update(editingProduct._id, productData);
        savedProduct = response.data.producto;

        toast.success('Producto actualizado exitosamente');
      }

      // Recargar productos
      await loadProducts();
      closeModal();

    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Error guardando producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cambiar disponibilidad
  const toggleAvailability = async (product) => {
    try {
      await productsAPI.toggleAvailability(product._id);
      toast.success(`Producto ${product.disponible ? 'desactivado' : 'activado'} exitosamente`);
      loadProducts();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Error cambiando disponibilidad');
    }
  };

  // Eliminar producto
  const handleDelete = async (product) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${product.nombre}"?`)) {
      return;
    }

    try {
      await productsAPI.delete(product._id);
      toast.success('Producto eliminado exitosamente');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Error eliminando producto');
    }
  };

  const getCategoryLabel = (category) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getTypeLabel = (type) => {
    return types.find(t => t.value === type)?.label || type;
  };

  if (!isManager()) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <FiPackage className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tienes permisos para administrar productos</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiPackage className="h-8 w-8 text-amber-600" />
            Administración de Productos
          </h1>
          <p className="text-gray-600 mt-1">Gestiona el menú de La Waffleria</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="btn btn-primary"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {types.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            <span className="text-sm">Solo disponibles</span>
          </label>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="spinner mr-4"></div>
            <span>Cargando productos...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.imagen ? (
                            <img
                              src={uploadAPI.getImageUrl(product.imagen)}
                              alt={product.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '🧇';
                              }}
                            />
                          ) : (
                            '🧇'
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.nombre}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {product.descripcion}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-info text-xs">
                        {getCategoryLabel(product.categoria)}
                      </span>
                    </td>
                    <td>{getTypeLabel(product.tipo)}</td>
                    <td className="font-semibold">{formatCurrency(product.precio)}</td>
                    <td>
                      {product.inventario ? (
                        <div>
                          <span className={`font-medium ${
                            product.inventario.alertaBajoStock ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {product.inventario.cantidadActual}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">
                            {product.inventario.unidadMedida}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin inventario</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleAvailability(product)}
                        className={`flex items-center gap-1 text-sm ${
                          product.disponible ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {product.disponible ? (
                          <>
                            <FiToggleRight className="h-4 w-4" />
                            Disponible
                          </>
                        ) : (
                          <>
                            <FiToggleLeft className="h-4 w-4" />
                            No disponible
                          </>
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal('view', product)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Ver detalles"
                        >
                          <FiEye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => openModal('edit', product)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Editar"
                        >
                          <FiEdit className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Eliminar"
                        >
                          <FiTrash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <FiPackage className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {modalMode === 'create' && 'Crear Nuevo Producto'}
                  {modalMode === 'edit' && 'Editar Producto'}
                  {modalMode === 'view' && 'Detalles del Producto'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-input ${formErrors.nombre ? 'border-red-500' : ''}`}
                    value={formData.nombre || ''}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    placeholder="Ej: Waffle Belga Especial"
                  />
                  {formErrors.nombre && (
                    <p className="form-error">{formErrors.nombre}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    className={`form-input ${formErrors.precio ? 'border-red-500' : ''}`}
                    value={formData.precio || ''}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    placeholder="15000"
                  />
                  {formErrors.precio && (
                    <p className="form-error">{formErrors.precio}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select
                    name="tipo"
                    className="form-select"
                    value={formData.tipo || 'waffle_base'}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select
                    name="categoria"
                    className="form-select"
                    value={formData.categoria || 'waffle_tradicional'}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tiempo de Preparación (minutos)</label>
                  <input
                    type="number"
                    name="tiempoPreparacion"
                    className="form-input"
                    value={formData.tiempoPreparacion || 5}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="disponible"
                      checked={formData.disponible || false}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                    />
                    <span>Producto disponible</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción *</label>
                <textarea
                  name="descripcion"
                  className={`form-input ${formErrors.descripcion ? 'border-red-500' : ''}`}
                  value={formData.descripcion || ''}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  rows="3"
                  placeholder="Descripción detallada del producto..."
                />
                {formErrors.descripcion && (
                  <p className="form-error">{formErrors.descripcion}</p>
                )}
              </div>

              {/* Imagen del producto */}
              <div className="product-form-image">
                <label className="form-label">Imagen del producto</label>
                <ImageUpload
                  currentImage={formData.imagen ? uploadAPI.getImageUrl(formData.imagen) : ''}
                  onImageChange={(imageUrl) => {
                    setFormData(prev => ({ ...prev, imagen: imageUrl }));
                  }}
                />
              </div>

              {/* Inventario inicial (solo para crear) */}
              {modalMode === 'create' && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Inventario Inicial</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Stock Inicial *</label>
                      <input
                        type="number"
                        name="stockInicial"
                        className={`form-input ${formErrors.stockInicial ? 'border-red-500' : ''}`}
                        value={formData.stockInicial || ''}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="50"
                      />
                      {formErrors.stockInicial && (
                        <p className="form-error">{formErrors.stockInicial}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Stock Mínimo</label>
                      <input
                        type="number"
                        name="stockMinimo"
                        className="form-input"
                        value={formData.stockMinimo || 10}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Unidad de Medida</label>
                      <select
                        name="unidadMedida"
                        className="form-select"
                        value={formData.unidadMedida || 'unidades'}
                        onChange={handleInputChange}
                      >
                        {units.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Costo Unitario *</label>
                      <input
                        type="number"
                        name="costoUnitario"
                        className={`form-input ${formErrors.costoUnitario ? 'border-red-500' : ''}`}
                        value={formData.costoUnitario || ''}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="6000"
                      />
                      {formErrors.costoUnitario && (
                        <p className="form-error">{formErrors.costoUnitario}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Información nutricional */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Información Nutricional (opcional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="form-label">Calorías</label>
                    <input
                      type="number"
                      name="informacionNutricional.calorias"
                      className="form-input"
                      value={formData.informacionNutricional?.calorias || ''}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Proteínas (g)</label>
                    <input
                      type="number"
                      name="informacionNutricional.proteinas"
                      className="form-input"
                      value={formData.informacionNutricional?.proteinas || ''}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Carbohidratos (g)</label>
                    <input
                      type="number"
                      name="informacionNutricional.carbohidratos"
                      className="form-input"
                      value={formData.informacionNutricional?.carbohidratos || ''}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grasas (g)</label>
                    <input
                      type="number"
                      name="informacionNutricional.grasas"
                      className="form-input"
                      value={formData.informacionNutricional?.grasas || ''}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            {modalMode !== 'view' && (
              <div className="p-6 border-t border-gray-200 flex gap-4 justify-end">
                <button
                  onClick={closeModal}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" />
                      {modalMode === 'create' ? 'Crear Producto' : 'Actualizar Producto'}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;