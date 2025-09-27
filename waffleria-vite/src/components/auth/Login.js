import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Usar setTimeout para evitar el warning de actualización de estado
      setTimeout(() => {
        window.location.href = location.state?.from?.pathname || '/dashboard';
      }, 0);
    }
  }, [isAuthenticated, loading, location.state?.from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores del campo modificado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // La redirección se maneja en el useEffect
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillTestCredentials = (role) => {
    const credentials = {
      admin: { email: 'admin@waffleria.com', password: 'admin123' },
      gerente: { email: 'gerente@waffleria.com', password: 'gerente123' },
      cajero: { email: 'maria@waffleria.com', password: 'cajero123' }
    };

    if (credentials[role]) {
      setFormData(credentials[role]);
    }
  };

  // Mostrar loading si está verificando autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-amber-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🧇</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            La Waffleria
          </h2>
          <p className="text-gray-600">
            Sistema de Gestión de Ventas
          </p>
        </div>

        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="usuario@waffleria.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            {errors.submit && (
              <div className="alert alert-error">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Credenciales de prueba:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillTestCredentials('admin')}
                className="btn btn-outline btn-sm text-left"
              >
                <span className="font-medium">Admin:</span> admin@waffleria.com
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('gerente')}
                className="btn btn-outline btn-sm text-left"
              >
                <span className="font-medium">Gerente:</span> gerente@waffleria.com
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('cajero')}
                className="btn btn-outline btn-sm text-left"
              >
                <span className="font-medium">Cajero:</span> maria@waffleria.com
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>© 2024 La Waffleria. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;