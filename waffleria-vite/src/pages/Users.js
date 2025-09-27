import React from 'react';
import { FiUsers, FiPlus, FiEdit, FiTrash2, FiShield, FiMail, FiPhone } from 'react-icons/fi';

const Users = () => {
  return (
    <div className="text-white">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FiUsers className="h-8 w-8 text-amber-600" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-300 mt-1">Administra usuarios y permisos del sistema</p>
          </div>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg">
            <FiPlus className="h-4 w-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Estadísticas de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-800/50 rounded-lg">
              <FiUsers className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">12</span>
          </div>
          <p className="text-gray-300 text-sm">Total Usuarios</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-800/50 rounded-lg">
              <span className="text-green-400 font-bold">✓</span>
            </div>
            <span className="text-2xl font-bold text-green-400">10</span>
          </div>
          <p className="text-gray-300 text-sm">Activos</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-800/50 rounded-lg">
              <FiShield className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-red-400">1</span>
          </div>
          <p className="text-gray-300 text-sm">Administradores</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-800/50 rounded-lg">
              <span className="text-amber-400 font-bold">👤</span>
            </div>
            <span className="text-2xl font-bold text-amber-400">8</span>
          </div>
          <p className="text-gray-300 text-sm">Cajeros</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Nombre o email..."
              className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
            <select className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors">
              <option value="">Todos</option>
              <option value="admin">Administrador</option>
              <option value="gerente">Gerente</option>
              <option value="cajero">Cajero</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors">
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all w-full shadow-lg">
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-300 font-semibold">Usuario</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Rol</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Último Acceso</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Creado</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  nombre: 'Juan Administrador',
                  email: 'admin@waffleria.com',
                  telefono: '+57 300 123 4567',
                  rol: 'admin',
                  activo: true,
                  ultimoAcceso: '2024-01-15 09:30',
                  fechaCreacion: '2024-01-01'
                },
                {
                  nombre: 'María Gerente',
                  email: 'gerente@waffleria.com',
                  telefono: '+57 300 765 4321',
                  rol: 'gerente',
                  activo: true,
                  ultimoAcceso: '2024-01-15 08:45',
                  fechaCreacion: '2024-01-02'
                },
                {
                  nombre: 'Carlos Cajero',
                  email: 'carlos@waffleria.com',
                  telefono: '+57 300 111 2222',
                  rol: 'cajero',
                  activo: true,
                  ultimoAcceso: '2024-01-15 10:15',
                  fechaCreacion: '2024-01-03'
                },
                {
                  nombre: 'Ana Cajero',
                  email: 'ana@waffleria.com',
                  telefono: '+57 300 333 4444',
                  rol: 'cajero',
                  activo: false,
                  ultimoAcceso: '2024-01-10 16:20',
                  fechaCreacion: '2024-01-04'
                },
                {
                  nombre: 'Luis Cajero',
                  email: 'luis@waffleria.com',
                  telefono: '+57 300 555 6666',
                  rol: 'cajero',
                  activo: true,
                  ultimoAcceso: '2024-01-15 07:30',
                  fechaCreacion: '2024-01-05'
                }
              ].map((user, i) => (
                <tr key={i} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-amber-900/50 rounded-full flex items-center justify-center border border-amber-700/50">
                        <span className="font-medium text-amber-300">
                          {user.nombre.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.nombre}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <FiMail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiPhone className="h-3 w-3" />
                            {user.telefono}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      user.rol === 'admin' ? 'bg-red-900/50 text-red-300 border border-red-700/50' :
                      user.rol === 'gerente' ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' :
                      'bg-green-900/50 text-green-300 border border-green-700/50'
                    }`}>
                      {user.rol === 'admin' ? 'Administrador' :
                       user.rol === 'gerente' ? 'Gerente' : 'Cajero'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      user.activo ? 'bg-green-900/50 text-green-300 border border-green-700/50' : 'bg-red-900/50 text-red-300 border border-red-700/50'
                    }`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {user.ultimoAcceso}
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {user.fechaCreacion}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                        <FiEdit className="h-4 w-4 text-blue-400" />
                      </button>
                      {user.rol !== 'admin' && (
                        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                          <FiTrash2 className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                        <FiShield className="h-4 w-4 text-amber-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-300">
          Mostrando 1-5 de 12 usuarios
        </p>
        <div className="flex items-center gap-2">
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">Anterior</button>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">1</button>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">2</button>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">3</button>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default Users;