import React, { useState, useRef } from 'react';
import { uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ currentImage, onImageChange, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('El archivo es muy grande. Máximo 5MB');
        return;
      }

      // Mostrar preview inmediato
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Subir archivo
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const response = await uploadAPI.uploadProductImage(file);
      const imageUrl = response.data.imageUrl;

      // Actualizar la imagen en el componente padre
      onImageChange(imageUrl);
      setPreview(uploadAPI.getImageUrl(imageUrl));

      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      // Restaurar preview anterior
      setPreview(currentImage || '');
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      <div className="upload-container">
        {preview ? (
          <div className="image-preview">
            <img
              src={preview}
              alt="Preview"
              className="preview-img"
              onError={(e) => {
                e.target.src = '/default-product.jpg';
              }}
            />
            <div className="image-overlay">
              <button
                type="button"
                onClick={triggerFileSelect}
                disabled={uploading}
                className="btn-change"
              >
                {uploading ? 'Subiendo...' : 'Cambiar'}
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="btn-remove"
              >
                Quitar
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder" onClick={triggerFileSelect}>
            <div className="upload-icon">📷</div>
            <p className="upload-text">
              {uploading ? 'Subiendo...' : 'Hacer clic para subir imagen'}
            </p>
            <small className="upload-hint">
              JPEG, PNG, GIF, WebP • Máx. 5MB
            </small>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;