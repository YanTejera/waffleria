import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';
import { uploadAPI } from '../../services/api';

const ProductForm = ({ product, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    precioCompra: '',
    precioVenta: '',
    descripcion: '',
    categoria: '',
    subcategoria: '',
    esPlato: false,
    disponible: true,
    imagen: '',
    ingredientes: [],
    informacionNutricional: {
      calorias: '',
      proteinas: '',
      carbohidratos: '',
      grasas: ''
    },
    tiempoPreparacion: 5
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newIngredient, setNewIngredient] = useState({
    nombre: '',
    cantidad: '',
    unidad: 'gramos'
  });

  // Categorías y subcategorías organizadas por tipo
  const categoriasPorTipo = {
    waffles: [
      { value: 'waffles', label: 'Waffles' }
    ],
    helados: [
      { value: 'helados', label: 'Helados' }
    ],
    bebidas: [
      { value: 'bebidas', label: 'Bebidas' }
    ],
    ingrediente: [
      { value: 'bebidas', label: 'Bebidas' },
      { value: 'frutas', label: 'Frutas' },
      { value: 'toppings', label: 'Toppings' }
    ]
  };

  const subcategoriasPorCategoria = {
    bebidas: [
      { value: 'gaseosas', label: 'Gaseosas' },
      { value: 'aguas', label: 'Aguas' },
      { value: 'jugos', label: 'Jugos' }
    ],
    frutas: [
      { value: 'frutas_frescas', label: 'Frutas Frescas' }
    ],
    toppings: [
      { value: 'cremas', label: 'Cremas' }
    ]
  };

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        precioCompra: product.precioCompra || '',
        precioVenta: product.precioVenta || '',
        informacionNutricional: {
          calorias: product.informacionNutricional?.calorias || '',
          proteinas: product.informacionNutricional?.proteinas || '',
          carbohidratos: product.informacionNutricional?.carbohidratos || '',
          grasas: product.informacionNutricional?.grasas || ''
        }
      });

      // Si tiene imagen existente, mostrarla
      if (product.imagen) {
        setImagePreview(uploadAPI.getImageUrl(product.imagen));
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('nutricional.')) {
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
  };

  const addIngredient = () => {
    if (newIngredient.nombre && newIngredient.cantidad) {
      setFormData(prev => ({
        ...prev,
        ingredientes: [...prev.ingredientes, { ...newIngredient, cantidad: parseFloat(newIngredient.cantidad) }]
      }));
      setNewIngredient({ nombre: '', cantidad: '', unidad: 'gramos' });
    }
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  };

  // Manejar selección de archivo de imagen
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Subir imagen al servidor
  const uploadImage = async () => {
    if (!selectedImageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImageFile);

      const response = await fetch('/api/products/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        throw new Error('Error al subir imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imagen;

      // Si hay una nueva imagen seleccionada, subirla primero
      if (selectedImageFile) {
        imageUrl = await uploadImage();
      }

      const dataToSend = {
        ...formData,
        imagen: imageUrl,
        precioCompra: parseFloat(formData.precioCompra),
        precioVenta: parseFloat(formData.precioVenta),
        tiempoPreparacion: parseInt(formData.tiempoPreparacion),
        informacionNutricional: {
          calorias: parseFloat(formData.informacionNutricional.calorias) || 0,
          proteinas: parseFloat(formData.informacionNutricional.proteinas) || 0,
          carbohidratos: parseFloat(formData.informacionNutricional.carbohidratos) || 0,
          grasas: parseFloat(formData.informacionNutricional.grasas) || 0
        }
      };

      onSave(dataToSend);
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  const getCategoriesForType = (tipo) => {
    return categoriasPorTipo[tipo] || [];
  };

  const getSubcategoriesForCategory = (categoria) => {
    return subcategoriasPorCategoria[categoria] || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Información Básica</h3>

              <div>
                <label className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Tipo de Producto</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="waffles">Waffles</option>
                  <option value="helados">Helados</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="ingrediente">Ingrediente</option>
                </select>
              </div>

              <div>
                <label className="form-label">Categoría</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={!formData.tipo}
                >
                  <option value="">Seleccionar categoría</option>
                  {getCategoriesForType(formData.tipo).map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategoría (solo para ingredientes) */}
              {formData.categoria && subcategoriasPorCategoria[formData.categoria] && (
                <div>
                  <label className="form-label">Subcategoría</label>
                  <select
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {subcategoriasPorCategoria[formData.categoria].map(subcat => (
                      <option key={subcat.value} value={subcat.value}>
                        {subcat.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="disponible"
                    id="disponible"
                    checked={formData.disponible}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="disponible" className="form-label">
                    Producto disponible
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="esPlato"
                    id="esPlato"
                    checked={formData.esPlato}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="esPlato" className="form-label">
                    Es un plato completo
                  </label>
                </div>
              </div>
            </div>

            {/* Precios y tiempo */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Precios y Tiempos</h3>

              <div>
                <label className="form-label">Precio de Compra</label>
                <input
                  type="number"
                  name="precioCompra"
                  value={formData.precioCompra}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="form-label">Precio de Venta</label>
                <input
                  type="number"
                  name="precioVenta"
                  value={formData.precioVenta}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="form-label">Tiempo de Preparación (minutos)</label>
                <input
                  type="number"
                  name="tiempoPreparacion"
                  value={formData.tiempoPreparacion}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                />
              </div>

              {/* Subida de imagen */}
              <div>
                <label className="form-label">Imagen del Producto</label>
                <div className="space-y-3">
                  {/* Preview de imagen */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedImageFile(null);
                          setFormData(prev => ({ ...prev, imagen: '' }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Input de archivo */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="btn btn-outline cursor-pointer"
                    >
                      <FiUpload className="h-4 w-4" />
                      {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
                    </label>
                    {uploadingImage && (
                      <span className="text-sm text-gray-600">Subiendo...</span>
                    )}
                  </div>

                  {/* Información adicional */}
                  <p className="text-xs text-gray-500">
                    Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB.
                  </p>
                </div>
              </div>

              {/* Ganancia */}
              {formData.precioCompra && formData.precioVenta && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Ganancia: ${(parseFloat(formData.precioVenta) - parseFloat(formData.precioCompra)).toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600">
                    Margen: {(((parseFloat(formData.precioVenta) - parseFloat(formData.precioCompra)) / parseFloat(formData.precioVenta)) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-4">Ingredientes</h3>
            <div className="space-y-3">
              {formData.ingredientes.map((ing, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{ing.nombre}</span>
                  <span className="text-sm text-gray-600">{ing.cantidad} {ing.unidad}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nombre del ingrediente"
                  value={newIngredient.nombre}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, nombre: e.target.value }))}
                  className="form-input flex-1"
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={newIngredient.cantidad}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, cantidad: e.target.value }))}
                  className="form-input w-24"
                  min="0"
                  step="0.1"
                />
                <select
                  value={newIngredient.unidad}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, unidad: e.target.value }))}
                  className="form-select w-28"
                >
                  <option value="gramos">g</option>
                  <option value="ml">ml</option>
                  <option value="unidades">uds</option>
                  <option value="cucharadas">cdas</option>
                </select>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="btn btn-outline"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Información nutricional */}
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-4">Información Nutricional (por porción)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Calorías</label>
                <input
                  type="number"
                  name="nutricional.calorias"
                  value={formData.informacionNutricional.calorias}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                />
              </div>
              <div>
                <label className="form-label">Proteínas (g)</label>
                <input
                  type="number"
                  name="nutricional.proteinas"
                  value={formData.informacionNutricional.proteinas}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="form-label">Carbohidratos (g)</label>
                <input
                  type="number"
                  name="nutricional.carbohidratos"
                  value={formData.informacionNutricional.carbohidratos}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="form-label">Grasas (g)</label>
                <input
                  type="number"
                  name="nutricional.grasas"
                  value={formData.informacionNutricional.grasas}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadingImage}
              className="btn btn-primary"
            >
              <FiSave className="h-4 w-4" />
              {uploadingImage ? 'Subiendo imagen...' :
               isLoading ? 'Guardando...' :
               'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;