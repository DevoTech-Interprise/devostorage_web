import { useAuth } from '../hooks/useAuth';
import { Package, Users, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { produtoService } from '../services/produto';
import { authService } from '../services/auth';
import type { Produto, User } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [produtosData, usersData] = await Promise.all([
          produtoService.listProdutos(),
          user?.tipo === 'administrador' ? authService.listUsers() : Promise.resolve([]),
        ]);
        setProdutos(produtosData);
        setUsers(usersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar dados'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.tipo]);

  const totalProducts = produtos.length;
  const totalValue = produtos.reduce((sum, p) => sum + (parseFloat(p.preco.toString()) * parseFloat(p.quantidade.toString())), 0);
  const lowStockProducts = produtos.filter(p => parseFloat(p.quantidade.toString()) < 5).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Bem-vindo, <span className="font-semibold">{user?.nome}</span>!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Produtos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total de Produtos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-200" />
              </div>
            </div>
          </div>

          {/* Valor Total em Estoque */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Valor Total em Estoque</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
            </div>
          </div>

          {/* Produtos com Baixo Estoque */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Baixo Estoque</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{lowStockProducts}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
              </div>
            </div>
          </div>

          {/* Total de Usuários (Admin Only) */}
          {user?.tipo === 'administrador' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total de Usuários</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{users.length}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Produtos com Baixo Estoque */}
        {lowStockProducts > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Produtos com Baixo Estoque</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {produtos.filter(p => parseFloat(p.quantidade.toString()) < 5).map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{produto.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{produto.categoria}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200">
                          {produto.quantidade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
