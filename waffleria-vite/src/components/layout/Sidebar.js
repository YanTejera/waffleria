import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiArchive,
  FiDollarSign,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isManager, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FiHome,
      path: '/dashboard',
      roles: ['admin', 'gerente', 'cajero'],
      description: 'Panel principal'
    },
    {
      title: 'Punto de Venta',
      icon: FiShoppingCart,
      path: '/pos',
      roles: ['admin', 'gerente', 'cajero'],
      description: 'Registrar ventas'
    },
    {
      title: 'Productos',
      icon: FiPackage,
      path: '/products',
      roles: ['admin', 'gerente'],
      description: 'Gestionar catálogo'
    },
    {
      title: 'Inventario',
      icon: FiArchive,
      path: '/inventory',
      roles: ['admin', 'gerente'],
      description: 'Control de stock'
    },
    {
      title: 'Caja Registradora',
      icon: FiDollarSign,
      path: '/cash-register',
      roles: ['admin', 'gerente', 'cajero'],
      description: 'Gestión de caja'
    },
    {
      title: 'Reportes',
      icon: FiBarChart2,
      path: '/reports',
      roles: ['admin', 'gerente'],
      description: 'Análisis y estadísticas'
    },
    {
      title: 'Usuarios',
      icon: FiUsers,
      path: '/users',
      roles: ['admin', 'gerente'],
      description: 'Gestionar personal'
    },
    {
      title: 'Configuración',
      icon: FiSettings,
      path: '/settings',
      roles: ['admin'],
      description: 'Ajustes del sistema'
    }
  ];

  const hasPermission = (roles) => {
    return roles.includes(user?.rol);
  };

  const getRoleBadgeColor = (rol) => {
    switch (rol) {
      case 'admin':
        return 'bg-red-900/50 text-red-300 border border-red-700/50';
      case 'gerente':
        return 'bg-blue-900/50 text-blue-300 border border-blue-700/50';
      case 'cajero':
        return 'bg-green-900/50 text-green-300 border border-green-700/50';
      default:
        return 'bg-gray-700/50 text-gray-300 border border-gray-600/50';
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 transform bg-gray-800/90 backdrop-blur-sm shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-gray-700/50',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header del Sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700/50 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              <span className="text-xl">🧇</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white">La Waffleria</h1>
              <p className="text-xs text-gray-400">Sistema POS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Información del usuario */}
        <div className="border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-600">
              <FiUser className="h-6 w-6 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.nombre}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.rol)}`}>
                  {user?.rol === 'admin' ? 'Administrador' :
                   user?.rol === 'gerente' ? 'Gerente' : 'Cajero'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              if (!hasPermission(item.roles)) {
                return null;
              }

              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive: navIsActive }) =>
                    clsx(
                      'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                      (isActive || navIsActive)
                        ? 'bg-gradient-to-r from-amber-900/50 to-orange-900/50 text-amber-100 shadow-sm border border-amber-600/50'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    )
                  }
                >
                  <div className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200',
                    (isActive)
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm'
                      : 'text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-200'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{item.title}</p>
                    {item.description && (
                      <p className="truncate text-xs text-gray-400 group-hover:text-gray-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer del Sidebar */}
        <div className="border-t border-gray-700/50 px-4 py-4">
          <button
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-200 group-hover:bg-red-900/30 group-hover:text-red-400">
              <FiLogOut className="h-4 w-4" />
            </div>
            <span>Cerrar Sesión</span>
          </button>

          <div className="mt-4 px-3">
            <div className="rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-3 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-xs">🧇</span>
                </div>
                <p className="text-xs font-semibold text-gray-200">Estado del Sistema</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Servidor</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span className="text-green-400 font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-400">Modo</span>
                <span className="text-gray-300 font-medium">Desarrollo</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;