import React from 'react';
import { FiArchive, FiAlertTriangle, FiPlus, FiTrendingDown, FiPackage } from 'react-icons/fi';

const Inventory = () => {
  return (
    <div className="text-white">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FiArchive className="h-8 w-8 text-amber-600" />
              Gestión de Inventario
            </h1>
            <p className="text-gray-300 mt-1">Control de stock y movimientos</p>
          </div>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg">
            <FiPlus className="h-4 w-4" />
            Nuevo Inventario
          </button>
        </div>
      </div>

      {/* Métricas del inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-800/50 rounded-lg">
              <FiPackage className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">124</span>
          </div>
          <p className="text-gray-300 text-sm">Total Productos</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-800/50 rounded-lg">
              <FiAlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-red-400">8</span>
          </div>
          <p className="text-gray-300 text-sm">Bajo Stock</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-800/50 rounded-lg">
              <FiTrendingDown className="h-5 w-5 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-yellow-400">3</span>
          </div>
          <p className="text-gray-300 text-sm">Por Vencer</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-800/50 rounded-lg">
              <span className="text-green-400 font-bold">$</span>
            </div>
            <span className="text-2xl font-bold text-white">$2.5M</span>
          </div>
          <p className="text-gray-300 text-sm">Valor Total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors">
              <option value="">Todas</option>
              <option value="waffle_base">Waffles</option>
              <option value="helado">Helados</option>
              <option value="topping">Toppings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors">
              <option value="">Todos</option>
              <option value="bajo_stock">Bajo Stock</option>
              <option value="por_vencer">Por Vencer</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
            <select className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors">
              <option value="nombre">Nombre</option>
              <option value="cantidad">Cantidad</option>
              <option value="vencimiento">Vencimiento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de inventario */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-300 font-semibold">Producto</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Stock Actual</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Stock Mínimo</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Unidad</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Costo Unit.</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Valor Total</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Vencimiento</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, i) => {
                const stockActual = Math.floor(Math.random() * 100) + 10;
                const stockMinimo = 20;
                const isLowStock = stockActual <= stockMinimo;
                const costoUnitario = Math.floor(Math.random() * 5000) + 1000;

                return (
                  <tr key={i} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-amber-900/50 rounded flex items-center justify-center text-sm border border-amber-700/50">
                          {i % 3 === 0 ? '🧇' : i % 3 === 1 ? '🍦' : '🍓'}
                        </div>
                        <div>
                          <p className="font-medium text-white">Producto {i + 1}</p>
                          <p className="text-xs text-gray-400">SKU-00{i + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                        {stockActual}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{stockMinimo}</td>
                    <td className="p-4">
                      <span className="text-sm bg-gray-700/50 text-gray-300 px-2 py-1 rounded border border-gray-600/50">
                        {i % 2 === 0 ? 'Unidades' : 'Kg'}
                      </span>
                    </td>
                    <td className="p-4 text-white">${costoUnitario.toLocaleString()}</td>
                    <td className="p-4 font-medium text-white">
                      ${(stockActual * costoUnitario).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-900/50 text-red-300 border border-red-700/50 rounded-full">
                          <FiAlertTriangle className="h-3 w-3" />
                          Bajo Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-900/50 text-green-300 border border-green-700/50 rounded-full">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">
                          Movimiento
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-300">
          Mostrando 1-10 de 45 productos en inventario
        </p>
        <div className="flex items-center gap-2">
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">Anterior</button>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">1</button>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">2</button>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;