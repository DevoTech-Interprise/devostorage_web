import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User, CreateUserData, UpdateUserData } from '../types';

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (data: CreateUserData | UpdateUserData) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    nome: '',
    email: '',
    password: '',
    tipo: 'funcionario',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        password: '',
        tipo: user.tipo,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.nome || !formData.email) {
        setError('Nome e email são obrigatórios');
        setIsLoading(false);
        return;
      }

      if (!user && !formData.password) {
        setError('Senha é obrigatória para novos usuários');
        setIsLoading(false);
        return;
      }

      const dataToSave = user
        ? { nome: formData.nome, email: formData.email, tipo: formData.tipo, ...(formData.password && { password: formData.password }) }
        : formData;

      await onSave(dataToSave);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nome *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Senha {user ? '(deixe em branco para manter a atual)' : '*'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required={!user}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Tipo de Usuário *
            </label>
            <select
              id="tipo"
              name="tipo"
              required
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="funcionario">Funcionario</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
