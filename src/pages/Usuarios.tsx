import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useToast } from '../contexts/ToastContext';
import type { User } from '../types';
import { UserModal } from '../components/UserModal';

export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await authService.listUsers();
      setUsuarios(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Confirmação',
      text: 'Tem certeza que deseja deletar este usuário?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await authService.deleteUser(id);
      setUsuarios(usuarios.filter(u => u.id !== id));
      setError('');
      toast.success('Usuário deletado com sucesso');
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Erro ao deletar usuário';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedUser) {
        const updated = await authService.updateUser(selectedUser.id, data);
        setUsuarios(usuarios.map(u => u.id === updated.id ? updated : u));
      } else {
        const created = await authService.register(data);
        setUsuarios([...usuarios, created]);
      }
      setIsModalOpen(false);
      setSelectedUser(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar usuário');
    }
  };

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuários</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Gerencie os usuários do sistema</p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Novo Usuário
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-200 shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {filteredUsuarios.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-300">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Criado em</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsuarios.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.tipo === 'administrador'
                            ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                            : user.tipo === 'funcionario'
                            ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                            : 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                        }`}>
                          {user.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
