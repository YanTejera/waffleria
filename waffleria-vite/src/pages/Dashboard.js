import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reportsAPI, ordersAPI, inventoryAPI, formatCurrency } from '../services/api';
import {
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiAlertTriangle,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiRefreshCw,
  FiActivity,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';

const Dashboard = () => {
  const { user, isManager } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = [
        reportsAPI.getDashboard(30),
        ordersAPI.getTodayStats(),
        ordersAPI.getRecent(5)
      ];

      if (isManager) {
        promises.push(inventoryAPI.getLowStock());
      }

      const results = await Promise.allSettled(promises);

      if (results[0].status === 'fulfilled') {
        setDashboard(results[0].value.data.dashboard);
      }

      if (results[1].status === 'fulfilled') {
        setTodayStats(results[1].value.data.estadisticas);
      }

      if (results[2].status === 'fulfilled') {
        setRecentOrders(results[2].value.data.ordenes);
      }

      if (results[3] && results[3].status === 'fulfilled') {
        setLowStockItems(results[3].value.data.inventarioBajoStock?.slice(0, 5) || []);
      }

    } catch (err) {
      setError('Error cargando datos del dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Componente de tarjeta métrica mejorada
  const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'amber', change, trend, link }) => (
    <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100 group-hover:from-${color}-100 group-hover:to-${color}-200 transition-colors duration-300`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
              change > 0
                ? 'text-green-700 bg-green-50'
                : 'text-red-700 bg-red-50'
            }`}>
              {change > 0 ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        <div className="mb-3">
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
        </div>

        {subtitle && (
          <p className="text-xs text-gray-400 mb-3">{subtitle}</p>
        )}

        {trend && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FiActivity className="h-3 w-3" />
            {trend}
          </div>
        )}

        {link && (
          <Link to={link} className="absolute inset-0 z-10" aria-label={title} />
        )}
      </div>

      {link && (
        <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FiEye className="h-4 w-4 text-gray-300" />
        </div>
      )}
    </div>
  );

  // Componente de gráfico de barras simple
  const SimpleBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.ventas));

    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <FiBarChart2 className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-3">
          {data.slice(-8).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 text-xs font-medium text-gray-400 text-right">
                {item.hora}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(item.ventas / maxValue) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium text-gray-300 min-w-[60px] text-right">
                    ${(item.ventas / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <FiRefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 font-medium">Cargando dashboard...</p>
          <p className="text-sm text-gray-400 mt-2">Obteniendo datos de La Waffleria</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <FiAlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">Error cargando dashboard</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header del Dashboard */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 mb-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              🧇 Dashboard de La Waffleria
            </h1>
            <p className="text-gray-300 mt-1">
              ¡Bienvenido, {user?.nombre}! • {new Date().toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
            title="Actualizar datos"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Ventas de Hoy"
            value={formatCurrency(todayStats?.totalVentas || 0)}
            subtitle={`${todayStats?.cantidadOrdenes || 0} órdenes • Ticket promedio: ${formatCurrency(todayStats?.ticketPromedio || 0)}`}
            icon={FiDollarSign}
            color="green"
            change={dashboard?.ventasHoy?.comparacionAyer?.porcentajeCambio}
            trend="vs. ayer"
            link="/reports"
          />

          <MetricCard
            title="Órdenes Hoy"
            value={todayStats?.cantidadOrdenes || 0}
            subtitle="Órdenes procesadas"
            icon={FiShoppingBag}
            color="blue"
            trend="Última orden hace 10 min"
            link="/orders"
          />

          <MetricCard
            title="Ventas del Mes"
            value={formatCurrency(dashboard?.ventasMes?.total || 0)}
            subtitle={`${dashboard?.ventasMes?.cantidadOrdenes || 0} órdenes este mes`}
            icon={FiTrendingUp}
            color="purple"
            change={dashboard?.ventasMes?.comparacionMesAnterior?.porcentajeCambio}
            trend="vs. mes anterior"
            link="/reports"
          />

          <MetricCard
            title="Productos Vendidos"
            value={dashboard?.productosPopulares?.reduce((sum, p) => sum + p.cantidadVendida, 0) || 0}
            subtitle="Productos vendidos hoy"
            icon={FiUsers}
            color="amber"
            trend="Productos activos"
            link="/products"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de ventas por hora */}
          {todayStats?.ventasPorHora && (
            <SimpleBarChart
              data={todayStats.ventasPorHora}
              title="Ventas por Hora (Hoy)"
            />
          )}

          {/* Productos más vendidos */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Productos Populares</h3>
              <FiPieChart className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {dashboard?.productosPopulares?.slice(0, 5).map((product, index) => (
                <div key={product._id} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{product.nombre}</p>
                    <p className="text-sm text-gray-400">{product.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{product.cantidadVendida}</p>
                    <p className="text-xs text-gray-400">vendidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(product.ingresos)}</p>
                    <p className="text-xs text-gray-400">ingresos</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="mt-4 block text-center text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
            >
              Ver todos los productos →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Órdenes recientes */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Órdenes Recientes</h3>
              <FiClock className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors duration-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    #{order.numeroOrden?.slice(-3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {new Date(order.fecha).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} • {order.cajero?.nombre}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.metodoPago === 'efectivo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.metodoPago === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{order.items?.length} items</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/orders"
              className="mt-4 block text-center text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
            >
              Ver todas las órdenes →
            </Link>
          </div>

          {/* Alertas de inventario (solo para managers) */}
          {isManager && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Alertas de Inventario</h3>
                <FiAlertTriangle className="h-5 w-5 text-amber-500" />
              </div>

              {dashboard?.inventarioCritico?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.inventarioCritico.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-amber-900/20 border border-amber-600/30">
                      <div className="w-10 h-10 bg-amber-800/50 rounded-lg flex items-center justify-center">
                        <FiAlertTriangle className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{item.nombre}</p>
                        <p className="text-sm text-gray-300">
                          Stock: {item.stockActual} {item.unidad} (mín: {item.stockMinimo})
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-800/50 text-amber-300">
                          Stock Bajo
                        </span>
                      </div>
                    </div>
                  ))}

                  <Link
                    to="/inventory"
                    className="block text-center text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
                  >
                    Gestionar inventario →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiDollarSign className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-gray-300 font-medium">¡Todo el inventario está bien!</p>
                  <p className="text-sm text-gray-400 mt-1">No hay productos con stock bajo</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;