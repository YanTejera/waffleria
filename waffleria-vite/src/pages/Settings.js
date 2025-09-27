import React, { useState } from 'react';
import { FiSettings, FiSave, FiRefreshCw, FiDatabase, FiShield } from 'react-icons/fi';

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState('General');

  const categories = [
    { id: 'General', name: 'General' },
    { id: 'Restaurante', name: 'Restaurante' },
    { id: 'Recibos', name: 'Recibos' },
    { id: 'Punto de Venta', name: 'Punto de Venta' },
    { id: 'Inventario', name: 'Inventario' },
    { id: 'Reportes', name: 'Reportes' },
    { id: 'Seguridad', name: 'Seguridad' },
    { id: 'Respaldos', name: 'Respaldos' }
  ];

  return (
    <div className="text-white">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FiSettings className="h-8 w-8 text-amber-600" />
            Configuración del Sistema
          </h1>
          <p className="text-gray-300 mt-1">Administra la configuración general de La Waffleria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menú de configuración */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-white">Categorías</h2>
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-amber-900/50 to-orange-900/50 text-amber-100 font-medium border border-amber-600/50'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Configuración general */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Overview */}
          {activeCategory === 'General' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Configuración General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-400 mb-2">🏪 Restaurante</h4>
                  <p className="text-sm text-gray-300">Información básica del negocio y configuración del restaurante</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-400 mb-2">🧾 Recibos</h4>
                  <p className="text-sm text-gray-300">Configuración de impresión y formato de recibos</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-400 mb-2">💰 Punto de Venta</h4>
                  <p className="text-sm text-gray-300">Configuración de IVA, métodos de pago y opciones de venta</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-400 mb-2">🔒 Seguridad</h4>
                  <p className="text-sm text-gray-300">Configuración de sesiones y seguridad del sistema</p>
                </div>
              </div>
            </div>
          )}

          {/* Información del restaurante */}
          {activeCategory === 'Restaurante' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white">Información del Restaurante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Restaurante</label>
                <input
                  type="text"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="La Waffleria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">NIT</label>
                <input
                  type="text"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="900123456-7"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Dirección</label>
                <input
                  type="text"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="Carrera 10 #15-25, Bogotá, Colombia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                <input
                  type="text"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="+57 1 234 5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="contacto@waffleria.com"
                />
              </div>
            </div>
          </div>
          )}

          {/* Configuración de POS */}
          {activeCategory === 'Punto de Venta' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white">Punto de Venta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">IVA (%)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="19"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Propina Sugerida (%)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="10"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tiempo Prep. Default (min)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="10"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Moneda</label>
                <select className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors">
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                <span className="text-sm text-gray-300">Permitir descuentos</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                <span className="text-sm text-gray-300">Solicitar confirmación para cancelar órdenes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                <span className="text-sm text-gray-300">Imprimir recibo automáticamente</span>
              </label>
            </div>
          </div>
          )}

          {/* Métodos de pago */}
          {activeCategory === 'Punto de Venta' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white">Métodos de Pago</h3>
            <div className="space-y-3">
              {[
                { name: 'Efectivo', enabled: true, icon: '💵' },
                { name: 'Tarjeta de Crédito', enabled: true, icon: '💳' },
                { name: 'Tarjeta de Débito', enabled: true, icon: '💳' },
                { name: 'Nequi', enabled: true, icon: '📱' },
                { name: 'DaviPlata', enabled: true, icon: '📱' },
                { name: 'PSE', enabled: false, icon: '🏦' },
                { name: 'Transferencia Bancaria', enabled: false, icon: '🏦' }
              ].map((method, i) => (
                <label key={i} className="flex items-center justify-between p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-white">{method.name}</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={method.enabled}
                      className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
          )}

          {/* Notificaciones */}
          {activeCategory === 'General' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white">Notificaciones</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Alertas de bajo inventario</span>
                <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Productos próximos a vencer</span>
                <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Reportes diarios por email</span>
                <input type="checkbox" className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Nuevas actualizaciones</span>
                <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
              </label>
            </div>
          </div>
          )}

          {/* Respaldos */}
          {activeCategory === 'Respaldos' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <FiDatabase className="h-5 w-5" />
              Respaldos y Datos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">Último respaldo</p>
                <p className="font-medium text-white">15/01/2024 - 02:00 AM</p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-2">Próximo respaldo</p>
                <p className="font-medium text-white">16/01/2024 - 02:00 AM</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors flex items-center gap-2">
                <FiRefreshCw className="h-4 w-4" />
                Respaldar Ahora
              </button>
              <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors flex items-center gap-2">
                <FiDatabase className="h-4 w-4" />
                Restaurar
              </button>
            </div>

            <div className="mt-4 p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-amber-300 mb-1">
                <span className="text-sm font-medium">⚠️ Importante</span>
              </div>
              <p className="text-sm text-amber-200">
                Los respaldos se realizan automáticamente cada día a las 2:00 AM.
                Se conservan los últimos 30 respaldos.
              </p>
            </div>
          </div>
          )}

          {/* Seguridad */}
          {activeCategory === 'Seguridad' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <FiShield className="h-5 w-5" />
              Seguridad
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tiempo de sesión (minutos)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none transition-colors"
                  defaultValue="480"
                  min="30"
                  max="1440"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                  <span className="text-sm text-gray-300">Requerir contraseña segura</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                  <span className="text-sm text-gray-300">Autenticación de dos factores</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                  <span className="text-sm text-gray-300">Registrar actividad de usuarios</span>
                </label>
              </div>
            </div>
          </div>
          )}

          {/* Configuración de Recibos */}
          {activeCategory === 'Recibos' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              🧾 Configuración de Recibos
            </h3>

            <div className="space-y-6">
              {/* Información del Negocio */}
              <div>
                <h4 className="text-md font-medium mb-3 text-amber-400">Información del Negocio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nombre del Negocio
                    </label>
                    <input
                      type="text"
                      defaultValue="LA WAFFLERIA"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      NIT
                    </label>
                    <input
                      type="text"
                      defaultValue="900123456-7"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      defaultValue="Carrera 10 #15-25"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      defaultValue="Bogotá, Colombia"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      defaultValue="+57 1 234 5678"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="contacto@lawaffleria.com"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Régimen Tributario
                    </label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white">
                      <option value="comun">Régimen Común</option>
                      <option value="simplificado">Régimen Simplificado</option>
                      <option value="gran_contribuyente">Gran Contribuyente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      defaultValue="www.lawaffleria.com"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Configuración de Impresión */}
              <div>
                <h4 className="text-md font-medium mb-3 text-amber-400">Configuración de Impresión</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ancho del Recibo (mm)
                    </label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white">
                      <option value="80">80mm (Térmica estándar)</option>
                      <option value="58">58mm (Térmica compacta)</option>
                      <option value="210">210mm (A4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Impresora Predeterminada
                    </label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white">
                      <option value="thermal">Impresora Térmica</option>
                      <option value="inkjet">Impresora de Inyección</option>
                      <option value="laser">Impresora Láser</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Abrir cajón automáticamente</span>
                    <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Imprimir automáticamente después del pago</span>
                    <input type="checkbox" className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Incluir QR de satisfacción</span>
                    <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Mostrar logo en recibos</span>
                    <input type="checkbox" defaultChecked className="text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500" />
                  </label>
                </div>
              </div>

              {/* Mensajes Personalizados */}
              <div>
                <h4 className="text-md font-medium mb-3 text-amber-400">Mensajes Personalizados</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Mensaje de Bienvenida
                    </label>
                    <textarea
                      rows="2"
                      defaultValue="¡Gracias por visitarnos!"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Mensaje de Despedida
                    </label>
                    <textarea
                      rows="2"
                      defaultValue="¡Esperamos verte pronto! 🧇"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Información de Contacto Adicional
                    </label>
                    <textarea
                      rows="2"
                      defaultValue="WhatsApp: +57 300 123 4567"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Inventario */}
          {activeCategory === 'Inventario' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Gestión de Inventario</h3>
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📦</div>
                <h4 className="text-xl font-semibold text-white mb-2">Próximamente</h4>
                <p className="text-gray-300">La configuración de inventario estará disponible en una próxima actualización.</p>
              </div>
            </div>
          )}

          {/* Reportes */}
          {activeCategory === 'Reportes' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Configuración de Reportes</h3>
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📊</div>
                <h4 className="text-xl font-semibold text-white mb-2">Próximamente</h4>
                <p className="text-gray-300">La configuración de reportes estará disponible en una próxima actualización.</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg">
              <FiSave className="h-4 w-4" />
              Guardar Cambios
            </button>
            <button className="bg-gray-700/50 text-gray-300 px-6 py-3 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">
              Cancelar
            </button>
            <button className="bg-gray-700/50 text-gray-300 px-6 py-3 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-colors">
              Restaurar Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;