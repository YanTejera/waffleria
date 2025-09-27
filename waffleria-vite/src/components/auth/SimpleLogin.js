import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiShield,
  FiCreditCard,
  FiArrowRight,
  FiClock,
  FiWifi
} from 'react-icons/fi';
import clsx from 'clsx';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Usuarios de desarrollo mejorados
  const devUsers = [
    {
      email: 'admin@waffleria.com',
      password: 'admin123',
      role: 'Administrador',
      icon: FiShield,
      color: 'red',
      description: 'Acceso total al sistema'
    },
    {
      email: 'gerente@waffleria.com',
      password: 'gerente123',
      role: 'Gerente',
      icon: FiUser,
      color: 'blue',
      description: 'Gestión y reportes'
    },
    {
      email: 'cajero@waffleria.com',
      password: 'cajero123',
      role: 'Cajero',
      icon: FiCreditCard,
      color: 'green',
      description: 'Punto de venta'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpiar cualquier token corrupto antes del login
      if (localStorage.getItem('token') && !localStorage.getItem('user')) {
        localStorage.removeItem('token');
      }

      const result = await login(email, password);
      if (result.success) {
        toast.success(`¡Bienvenido ${result.user.nombre}!`, {
          icon: '🎉',
          duration: 4000,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setLoading(true);

    // Limpiar tokens corruptos antes del login
    if (localStorage.getItem('token') && !localStorage.getItem('user')) {
      localStorage.removeItem('token');
    }

    try {
      // Auto submit después de un pequeño delay
      setTimeout(async () => {
        const result = await login(userEmail, userPassword);
        if (result.success) {
          toast.success(`¡Bienvenido ${result.user.nombre}!`, {
            icon: '🎉',
            duration: 4000,
          });
          navigate('/dashboard');
        }
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error en quick login:', error);
      toast.error('Error al iniciar sesión');
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex">
      {/* Panel izquierdo con información */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-white bg-opacity-30 rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-16">
          <div className="text-center mb-12">
            <div className="text-9xl mb-6 animate-bounce">🧇</div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              La Waffleria
            </h1>
            <p className="text-xl font-light text-yellow-100 mb-8">
              Sistema Integral de Gestión POS
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-300 to-orange-300 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-sm w-full">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
              <h3 className="font-semibold text-lg mb-2">Gestión Completa</h3>
              <p className="text-yellow-100 text-sm">
                Control total de inventarios, ventas, usuarios y reportes en tiempo real.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
              <h3 className="font-semibold text-lg mb-2">Punto de Venta</h3>
              <p className="text-yellow-100 text-sm">
                Interfaz intuitiva para procesar órdenes rápidamente con múltiples métodos de pago.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-3 text-yellow-100">
              <FiClock className="h-5 w-5" />
              <span className="text-lg font-mono">{formatTime(currentTime)}</span>
            </div>
            <p className="text-sm text-yellow-200 mt-1 capitalize">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-md w-full space-y-8">
          {/* Logo móvil */}
          <div className="text-center lg:hidden mb-8">
            <div className="text-6xl mb-4">🧇</div>
            <h2 className="text-3xl font-bold text-gray-900">La Waffleria</h2>
            <p className="text-gray-600">Sistema POS</p>
          </div>

          {/* Header del formulario */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido de vuelta
            </h2>
            <p className="text-gray-600">
              Inicia sesión para acceder al sistema
            </p>

            {/* Estado del sistema */}
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <FiWifi className="h-4 w-4" />
                <span>Sistema Online</span>
              </div>
            </div>
          </div>

          {/* Formulario principal */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="usuario@waffleria.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  "w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl",
                  loading
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:from-amber-600 hover:to-orange-600 hover:scale-105 active:scale-95"
                )}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <FiArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Usuarios de prueba mejorados */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Usuarios de Demostración
              </div>
            </div>

            <div className="grid gap-3">
              {devUsers.map((user, index) => {
                const Icon = user.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickLogin(user.email, user.password)}
                    disabled={loading}
                    className={clsx(
                      "group w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                      `border-${user.color}-200 hover:border-${user.color}-300 hover:bg-${user.color}-50 hover:shadow-lg hover:scale-105 active:scale-95`
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-${user.color}-100 rounded-xl group-hover:bg-${user.color}-200 transition-colors`}>
                        <Icon className={`h-6 w-6 text-${user.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-gray-800">{user.role}</h4>
                          <FiArrowRight className={`h-4 w-4 text-${user.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{user.description}</p>
                        <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✨</div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Acceso Rápido</h4>
                  <p className="text-sm text-amber-800">
                    Selecciona cualquier perfil para acceder instantáneamente al sistema con todos los permisos correspondientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>© 2024 La Waffleria - Sistema POS</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Modo Desarrollo
              </span>
              <span>•</span>
              <span>Versión 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;