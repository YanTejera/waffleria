import React from 'react';
import { FiDollarSign, FiClock, FiTrendingUp, FiCreditCard } from 'react-icons/fi';

const CashRegister = () => {
  return (
    <div className="text-white">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FiDollarSign className="h-8 w-8 text-amber-600" />
              Caja Registradora
            </h1>
            <p className="text-gray-300 mt-1">Gestión de turnos y movimientos de caja</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
              Abrir Caja
            </button>
            <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg">
              Cerrar Caja
            </button>
          </div>
        </div>
      </div>

      {/* Estado actual de la caja */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Estado Actual</h2>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">Caja Abierta</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiClock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">Apertura</span>
            </div>
            <p className="text-2xl font-bold text-white">9:00 AM</p>
            <p className="text-sm text-gray-400">Hace 6 horas</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiDollarSign className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300">Inicial</span>
            </div>
            <p className="text-2xl font-bold text-green-400">$50,000</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiTrendingUp className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300">Ventas</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">$425,000</p>
            <p className="text-sm text-gray-400">32 transacciones</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiDollarSign className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-gray-300">Esperado</span>
            </div>
            <p className="text-2xl font-bold text-amber-400">$475,000</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por método de pago */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-white">Ventas por Método de Pago</h3>
          <div className="space-y-4">
            {[
              { method: 'Efectivo', amount: 180000, icon: '💵', color: 'green' },
              { method: 'Tarjeta Débito', amount: 120000, icon: '💳', color: 'blue' },
              { method: 'Tarjeta Crédito', amount: 85000, icon: '💳', color: 'purple' },
              { method: 'Nequi', amount: 40000, icon: '📱', color: 'indigo' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-white">{item.method}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${item.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">
                    {Math.floor(item.amount / 15000)} transacciones
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transacciones recientes */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Transacciones Recientes</h3>
            <button className="text-amber-400 text-sm hover:text-amber-300 transition-colors">Ver todas</button>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
                <div>
                  <p className="font-medium text-sm text-white">#WF20241201{String(i + 1).padStart(3, '0')}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toLocaleTimeString()}
                    </span>
                    <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50">
                      {['Efectivo', 'Tarjeta', 'Nequi'][Math.floor(Math.random() * 3)]}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-400">
                    +${(Math.random() * 25000 + 5000).toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold mb-4 text-white">Acciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-colors bg-gray-700/30">
            <FiDollarSign className="h-6 w-6 text-green-400" />
            <div className="text-left">
              <p className="font-medium text-white">Ingreso Manual</p>
              <p className="text-sm text-gray-300">Registrar ingreso</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-colors bg-gray-700/30">
            <FiCreditCard className="h-6 w-6 text-red-400" />
            <div className="text-left">
              <p className="font-medium text-white">Retiro Manual</p>
              <p className="text-sm text-gray-300">Registrar retiro</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-colors bg-gray-700/30">
            <FiTrendingUp className="h-6 w-6 text-blue-400" />
            <div className="text-left">
              <p className="font-medium text-white">Reporte de Turno</p>
              <p className="text-sm text-gray-300">Generar reporte</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashRegister;