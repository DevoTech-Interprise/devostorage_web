import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Home, Package, Users, Menu, X, BarChart, Repeat, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Produtos', path: '/produtos', icon: Package },
    { label: 'Movimentações', path: '/movimentacoes', icon: Repeat },
    ...(user?.tipo === 'administrador'
      ? [
          { label: 'Usuários', path: '/usuarios', icon: Users },
          { label: 'Relatórios', path: '/relatorios', icon: BarChart },
        ]
      : []),
  ];

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <Package className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">DevStorage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.nome}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">{user?.tipo}</p>
            </div>
            <button onClick={toggle} title="Toggle theme" className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors items-center gap-2 ${
                    isActive(item.path)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};
