import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Package, AlertCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Package className="h-12 w-12 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DevStorage</h1>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={toggle} title="Alternar tema" className="p-2 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Acesso ao Sistema
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-200 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@local.com.br"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Conectando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-slate-800 rounded-md">
              <p className="text-xs text-blue-900 dark:text-blue-200">
                <strong>Credenciais de teste:</strong>
                <br />
                Email: admin@local.com.br
                <br />
                Senha: 123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
