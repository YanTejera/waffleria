import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiBell
} from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-900/50 text-red-300 border border-red-700/50',
      gerente: 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
      cajero: 'bg-green-900/50 text-green-300 border border-green-700/50'
    };
    return colors[role] || 'bg-gray-700/50 text-gray-300 border border-gray-600/50';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      gerente: 'Gerente',
      cajero: 'Cajero'
    };
    return labels[role] || role;
  };

  return (
    <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 px-4 py-3 flex items-center justify-end">
      {/* Lado derecho - Notificaciones y usuario */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors relative">
          <FiBell className="h-5 w-5 text-gray-300" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Menú de usuario */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="font-medium text-white text-sm">{user?.nombre}</p>
              <p className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user?.rol)}`}>
                {getRoleLabel(user?.rol)}
              </p>
            </div>
            <div className="h-8 w-8 bg-gray-700/50 rounded-full flex items-center justify-center border border-gray-600/50">
              <FiUser className="h-4 w-4 text-gray-300" />
            </div>
          </button>

          {/* Dropdown del usuario */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50 py-2 z-20">
                <div className="px-4 py-2 border-b border-gray-700/50">
                  <p className="font-medium text-white">{user?.nombre}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Aquí puedes abrir modal de perfil
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <FiUser className="h-4 w-4" />
                  Mi Perfil
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Aquí puedes abrir modal de configuración
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <FiSettings className="h-4 w-4" />
                  Configuración
                </button>

                <hr className="my-2 border-gray-700/50" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-900/30 transition-colors flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <FiLogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;