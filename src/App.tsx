import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Produtos } from './pages/Produtos';
import { Usuarios } from './pages/Usuarios';
import { Relatorios } from './pages/Relatorios';
import { Movimentacoes } from './pages/Movimentacoes';
import './App.css';

function App() {
  return (
    <Router basename="/devostorange">
      <ToastProvider>
      <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Produtos />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/usuarios"
            element={
              <PrivateRoute requiredRole="administrador">
                <Usuarios />
              </PrivateRoute>
            }
          />

          <Route
            path="/movimentacoes"
            element={
              <PrivateRoute>
                <Movimentacoes />
              </PrivateRoute>
            }
          />

          <Route
            path="/relatorios"
            element={
              <PrivateRoute requiredRole="administrador">
                <Relatorios />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
