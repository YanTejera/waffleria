import React from 'react';
import { FiBarChart2, FiDownload, FiCalendar, FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiPackage } from 'react-icons/fi';

const Reports = () => {
  return (
    <div className="text-white">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FiBarChart2 className="h-8 w-8 text-amber-600" />
              Reportes y Analytics
            </h1>
            <p className="text-gray-300 mt-1">Análisis de ventas y rendimiento</p>
          </div>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg">
            <FiDownload className="h-4 w-4" />
            Exportar Datos
          </button>
        </div>
      </div>

      {/* Filtros de fecha */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Período:</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="date" className="bg-gray-700/50 text-white placeholder-gray-400 px-3 py-2 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors" />
            <span className="text-gray-400">-</span>
            <input type="date" className="bg-gray-700/50 text-white placeholder-gray-400 px-3 py-2 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors" />
          </div>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">Hoy</button>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">Esta Semana</button>
          <button className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">Este Mes</button>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all">Aplicar</button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-800/50 rounded-lg">
              <FiDollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">$2,450,000</p>
              <p className="text-green-400 text-sm">+12% vs mes anterior</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">Ventas Totales</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-800/50 rounded-lg">
              <FiTrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">347</p>
              <p className="text-blue-400 text-sm">+8% vs mes anterior</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">Órdenes</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-800/50 rounded-lg">
              <span className="text-purple-400 font-bold text-lg">₵</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">$7,060</p>
              <p className="text-purple-400 text-sm">+5% vs mes anterior</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">Ticket Promedio</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-800/50 rounded-lg">
              <span className="text-amber-400 font-bold text-lg">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3.8</p>
              <p className="text-amber-400 text-sm">+2% vs mes anterior</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">Items por Orden</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-white">Ventas por Día</h3>
          <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/50">
            <p className="text-gray-400">Gráfico de ventas diarias</p>
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-white">Productos Más Vendidos</h3>
          <div className="space-y-4">
            {[
              { name: 'Waffle Belga con Nutella', sales: 85, revenue: 850000 },
              { name: 'Waffle Tradicional con Vainilla', sales: 72, revenue: 576000 },
              { name: 'Waffle Chocolate con Fresas', sales: 64, revenue: 704000 },
              { name: 'Helado Cookies & Cream', sales: 58, revenue: 348000 },
              { name: 'Topping Mix Frutas', sales: 45, revenue: 135000 }
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <div>
                  <p className="font-medium text-sm text-white">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sales} vendidos</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${product.revenue.toLocaleString()}</p>
                  <div className="w-16 bg-gray-600/50 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: `${(product.sales / 85) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-white">Métodos de Pago</h3>
          <div className="space-y-3">
            {[
              { method: 'Efectivo', percentage: 45, amount: 1102500 },
              { method: 'Tarjeta Débito', percentage: 30, amount: 735000 },
              { method: 'Tarjeta Crédito', percentage: 15, amount: 367500 },
              { method: 'Nequi', percentage: 7, amount: 171500 },
              { method: 'DaviPlata', percentage: 3, amount: 73500 }
            ].map((payment, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 bg-gray-600/50 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: `${payment.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white">{payment.method}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{payment.percentage}%</p>
                  <p className="text-xs text-gray-400">${payment.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rendimiento de cajeros */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-white">Rendimiento de Cajeros</h3>
          <div className="space-y-4">
            {[
              { name: 'María González', orders: 145, sales: 1045000, avg: 7207 },
              { name: 'José Martínez', orders: 132, sales: 924000, avg: 7000 },
              { name: 'Ana López', orders: 70, sales: 481000, avg: 6871 }
            ].map((cashier, i) => (
              <div key={i} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{cashier.name}</p>
                  <span className="text-sm text-green-400 font-medium">
                    ${cashier.sales.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <span>{cashier.orders} órdenes</span>
                  <span>Promedio: ${cashier.avg.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de reportes detallados */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl mt-6 border border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-white">Reporte Detallado de Ventas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-300 font-semibold">Fecha</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Órdenes</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Ventas</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Ticket Prom.</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Efectivo</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Tarjetas</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Digital</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 7 }, (_, i) => {
                const orders = Math.floor(Math.random() * 50) + 20;
                const avgTicket = Math.floor(Math.random() * 3000) + 5000;
                const totalSales = orders * avgTicket;

                return (
                  <tr key={i} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 text-gray-300">
                      {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-white">{orders}</td>
                    <td className="p-4 font-medium text-white">${totalSales.toLocaleString()}</td>
                    <td className="p-4 text-white">${avgTicket.toLocaleString()}</td>
                    <td className="p-4 text-white">${Math.floor(totalSales * 0.4).toLocaleString()}</td>
                    <td className="p-4 text-white">${Math.floor(totalSales * 0.45).toLocaleString()}</td>
                    <td className="p-4 text-white">${Math.floor(totalSales * 0.15).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;