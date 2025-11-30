import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { produtoService } from '../services/produto';
import QuickMovModal from '../components/QuickMovModal';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useToast } from '../contexts/ToastContext';
import type { Produto } from '../types';
import { ProdutoModal } from '../components/ProdutoModal';


export const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickModalProduto, setQuickModalProduto] = useState<Produto | null>(null);
  const toast = useToast();
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    const handler = async (e: Event) => {
      try {
        const custom = e as CustomEvent;
        const detail = custom.detail as { id: string; produto?: any } | undefined;
        if (!detail || !detail.id) return;
        const id = detail.id;
        // If backend returned product object already, use it; otherwise fetch
        if (detail.produto) {
          setProdutos(prev => prev.map(p => (p.id === id ? detail.produto : p)));
        } else {
          try {
            const updated = await produtoService.getProduto(id);
            setProdutos(prev => prev.map(p => (p.id === id ? updated : p)));
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('produto-quantidade-atualizada', handler as EventListener);
    return () => window.removeEventListener('produto-quantidade-atualizada', handler as EventListener);
  }, []);

  const loadProdutos = async () => {
    try {
      setIsLoading(true);
      const data = await produtoService.listProdutos();
      setProdutos(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Confirmação',
      text: 'Tem certeza que deseja deletar este produto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await produtoService.deleteProduto(id);
      setProdutos(produtos.filter(p => p.id !== id));
      toast.success('Produto deletado com sucesso');
      setError('');
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Erro ao deletar produto';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedProduto(null);
    setIsModalOpen(true);
  };

  const handleRowDoubleClick = (produto: Produto) => {
    setQuickModalProduto(produto);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedProduto) {
        const updated = await produtoService.updateProduto(selectedProduto.id, data);
        setProdutos(produtos.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await produtoService.createProduto(data);
        setProdutos([...produtos, created]);
        toast.success('Produto criado com sucesso');
      }
      setIsModalOpen(false);
      setSelectedProduto(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto');
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar produto');
    }
  };

  const filteredProdutos = produtos.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Produtos</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Gerencie seu inventário de produtos</p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Novo Produto
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
            placeholder="Buscar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {filteredProdutos.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-300">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProdutos.map((produto) => {
                    const total = parseFloat(produto.preco.toString()) * parseFloat(produto.quantidade.toString());
                    return (
                      <tr
                        key={produto.id}
                        onDoubleClick={() => handleRowDoubleClick(produto)}
                        onClick={() => { setActiveRow(produto.id); setTimeout(() => setActiveRow(null), 700); }}
                        className={`transition-colors ${activeRow === produto.id ? 'bg-indigo-50 dark:bg-indigo-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{produto.nome}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{produto.categoria}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            parseFloat(produto.quantidade.toString()) < 5
                              ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                              : 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                          }`}>
                            {produto.quantidade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          R$ {parseFloat(produto.preco.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(produto)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-md transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(produto.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProdutoModal
          produto={selectedProduto}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Quick Movimentação Modal (double-click row) */}
      {quickModalProduto && (
        <QuickMovModal
          produto={quickModalProduto}
          onClose={() => setQuickModalProduto(null)}
        />
      )}
    </div>
  );
};
