import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Produto } from '../types';

interface ProdutoModalProps {
  produto: Produto | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export const ProdutoModal: React.FC<ProdutoModalProps> = ({ produto, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>({
    nome: '',
    categoria: '',
    quantidade: 0,
    preco: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        categoria: produto.categoria,
        quantidade: parseFloat(produto.quantidade.toString()),
        preco: parseFloat(produto.preco.toString()),
      });
    } else {
      // ensure new produto starts with zero quantity
      setFormData((prev: any) => ({ ...prev, quantidade: 0 }));
    }
  }, [produto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'nome' || name === 'categoria' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.nome || !formData.categoria) {
        setError('Nome e categoria são obrigatórios');
        setIsLoading(false);
        return;
      }

      // For create: ensure quantidade = 0 (quantity must be adjusted via movimentacoes)
      if (!produto) {
        await onSave({
          nome: formData.nome,
          categoria: formData.categoria,
          preco: formData.preco,
          quantidade: 0,
        });
      } else {
        // For update: do not send quantidade (must be changed via movimentacoes)
        await onSave({
          nome: formData.nome,
          categoria: formData.categoria,
          preco: formData.preco,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto');
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
            {produto ? 'Editar Produto' : 'Novo Produto'}
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
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Categoria *
            </label>
            <input
              id="categoria"
              name="categoria"
              type="text"
              required
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {produto ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Quantidade atual</label>
              <input
                type="number"
                disabled
                value={formData.quantidade}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Ajuste de quantidade deve ser feito em Movimentações.</p>
            </div>
          ) : null}

          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Preço (R$) *
            </label>
            <input
              id="preco"
              name="preco"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.preco}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
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
