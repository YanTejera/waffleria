import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      // Limpiar datos corruptos o malformados
      if (token && (!savedUser || token === 'undefined' || token === 'null' || savedUser === 'undefined' || savedUser === 'null')) {
        console.log('Limpiando datos de autenticación corruptos');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      if (token && savedUser) {
        try {
          // Verificar que el usuario guardado sea válido
          const user = JSON.parse(savedUser);
          if (!user || !user.id || !user.nombre || !user.email || !user.rol) {
            throw new Error('Datos de usuario inválidos');
          }

          // Para modo desarrollo, usar directamente (MongoDB no disponible)
          console.log('Usando sesión guardada en modo desarrollo');
          setUser(user);
          setIsAuthenticated(true);

        } catch (error) {
          // Error al procesar datos guardados - limpiar todo
          console.log('Error procesando datos de autenticación, limpiando:', error.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Intentar login con backend
      const response = await authAPI.login({ email, password });

      if (response.data.token && response.data.usuario) {
        const { token, usuario } = response.data;

        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));

        // Actualizar estado
        setUser(usuario);
        setIsAuthenticated(true);

        toast.success(`¡Bienvenido ${usuario.nombre}!`);
        return { success: true, user: usuario };
      }
    } catch (error) {
      console.error('Error en login:', error);
      const message = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continuar con el logout aunque falle la petición al servidor
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Sesión cerrada correctamente');
    }
  };

  // Función para verificar roles
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (!Array.isArray(requiredRoles)) requiredRoles = [requiredRoles];
    return requiredRoles.includes(user.rol);
  };

  const isAdmin = user?.rol === 'admin';
  const isManager = user?.rol === 'gerente';
  const isCashier = user?.rol === 'cajero';

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isManager,
    isCashier
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};