import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import SimpleLogin from './components/auth/SimpleLogin';

// Importar páginas (por ahora crearemos placeholders)
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import CashRegister from './pages/CashRegister';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Test from './pages/Test';

// Componente de página no encontrada
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="text-6xl mb-4">🧇</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-4">Página no encontrada</p>
      <a href="/dashboard" className="btn btn-primary">
        Volver al Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
          {/* Configuración de toasts */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1f2937',
                fontSize: '14px',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Ruta de login */}
            <Route path="/login" element={<SimpleLogin />} />

            {/* Redirigir raíz al dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Rutas protegidas con layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pos"
              element={
                <ProtectedRoute>
                  <Layout>
                    <POS />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/*"
              element={
                <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                  <Layout>
                    <Products />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory/*"
              element={
                <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                  <Layout>
                    <Inventory />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cash-register/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CashRegister />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/*"
              element={
                <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/*"
              element={
                <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings/*"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Ruta de test */}
            <Route path="/test" element={<Test />} />

            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;