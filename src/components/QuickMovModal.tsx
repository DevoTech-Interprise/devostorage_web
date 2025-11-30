import React, { useState } from 'react';
import { X } from 'lucide-react';
import { movimentacaoService } from '../services/movimentacoes';
import { useToast } from '../contexts/ToastContext';
import type { Produto } from '../types';

interface Props {
  produto: Produto;
  onClose: () => void;
}

export const QuickMovModal: React.FC<Props> = ({ produto, onClose }) => {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [quantidade, setQuantidade] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!quantidade || quantidade <= 0) return toast.error('Quantidade deve ser maior que zero');
    setIsLoading(true);
    try {
      const payload = { produto_id: produto.id, quantidade };
      if (tipo === 'entrada') await movimentacaoService.entrada(payload);
      else await movimentacaoService.saida(payload);

      // notify other components
      try {
        // fetch updated product if possible
        const res = await fetch(`/api/produtos/${produto.id}`);
        if (res.ok) {
          const updated = await res.json();
          window.dispatchEvent(new CustomEvent('produto-quantidade-atualizada', { detail: { id: produto.id, produto: updated } }));
        } else {
          // still notify by id
          window.dispatchEvent(new CustomEvent('produto-quantidade-atualizada', { detail: { id: produto.id } }));
        }
      } catch {
        window.dispatchEvent(new CustomEvent('produto-quantidade-atualizada', { detail: { id: produto.id } }));
      }

      toast.success('Movimentação registrada com sucesso');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao registrar movimentação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Movimentação rápida</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <div className="text-sm text-gray-700 dark:text-gray-200">Produto: <span className="font-medium">{produto.nome}</span></div>
          <div className="flex gap-2 items-center">
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={tipo === 'entrada'} onChange={() => setTipo('entrada')} /> Entrada
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={tipo === 'saida'} onChange={() => setTipo('saida')} /> Saída
            </label>
          </div>
          <div>
            <input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Quantidade" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-3 py-2 bg-indigo-600 text-white rounded">{isLoading ? 'Processando...' : 'Confirmar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickMovModal;
