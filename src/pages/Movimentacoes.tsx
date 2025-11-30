import { useEffect, useState } from 'react';
import { movimentacaoService } from '../services/movimentacoes';
import { produtoService } from '../services/produto';
import { useToast } from '../contexts/ToastContext';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';
import type { Produto } from '../types';

export const Movimentacoes: React.FC = () => {
  const { isAdmin } = useRole();
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoId, setProdutoId] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(0);
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [movs, setMovs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterInicio, setFilterInicio] = useState<string>('');
  const [filterFim, setFilterFim] = useState<string>('');
  const [onlyRecent, setOnlyRecent] = useState<boolean>(true);
  const [appliedFilters, setAppliedFilters] = useState<{ inicio: string; fim: string; produtoId: string }>({ inicio: '', fim: '', produtoId: '' });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const prods = await produtoService.listProdutos();
        setProdutos(prods);
        const list = await movimentacaoService.listMovimentacoes();
        const raw = Array.isArray(list) ? list : (list.movimentacoes || list.data || []);
        const items = raw.map((m: any) => ({
          id: m.id,
          date: m.data || m.created_at || m.date || '',
          produto_id: String(m.produto_id || ''),
          usuario_id: String(m.usuario_id || ''),
          usuario_nome: m.usuario_nome || '',
          produto_nome: m.produto?.nome || m.produto_nome || m.nome_produto || '',
          tipo: m.tipo || m.type || (m.entrada ? 'entrada' : m.saida ? 'saida' : ''),
          quantidade: Number(m.quantidade || m.qtd || m.valor || 0),
        }));
        setMovs(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const toast = useToast();

  const formatDate = (d: any) => {
    if (!d) return '';
    try {
      // Convert 'YYYY-MM-DD HH:mm:ss' to 'YYYY-MM-DD' for date comparison
      return String(d).split(' ')[0];
    } catch {
      return '';
    }
  };

  const formatDateTimeDisplay = (d: any) => {
    if (!d) return '';
    try {
      const parts = String(d).split(' ');
      const dateStr = parts[0]; // YYYY-MM-DD
      const timeStr = parts[1] || ''; // HH:mm:ss
      const [year, month, day] = dateStr.split('-');
      const time = timeStr.split(':').slice(0, 2).join(':'); // HH:mm
      return `${day}/${month}/${year} ${time}`;
    } catch {
      return String(d);
    }
  };

  const filterMovimentacoes = (list: any[]) => {
    let filtered = list;

    // Filter by user if not admin
    if (!isAdmin && user?.id) {
      filtered = filtered.filter((m: any) => String(m.usuario_id) === String(user.id));
    }

    // Apply date range filter
    if (appliedFilters.inicio || appliedFilters.fim) {
      filtered = filtered.filter((m: any) => {
        const mDate = formatDate(m.date);
        if (appliedFilters.inicio && mDate < appliedFilters.inicio) return false;
        if (appliedFilters.fim && mDate > appliedFilters.fim) return false;
        return true;
      });
    }

    // Apply product filter
    if (appliedFilters.produtoId) {
      filtered = filtered.filter((m: any) => String(m.produto_id) === String(appliedFilters.produtoId));
    }

    // Apply recent filter
    if (onlyRecent && filtered.length > 10) {
      filtered = filtered.slice(0, 10);
    }

    return filtered;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoId) return setError('Selecione um produto');
    if (!quantidade || quantidade <= 0) return setError('Quantidade deve ser maior que zero');
    setError('');
    setIsLoading(true);
    try {
      const payload = { produto_id: produtoId, quantidade };
      if (tipo === 'entrada') await movimentacaoService.entrada(payload);
      else await movimentacaoService.saida(payload);

      // refresh list
      const list = await movimentacaoService.listMovimentacoes();
      const raw = Array.isArray(list) ? list : (list.movimentacoes || list.data || []);
      const items = raw.map((m: any) => ({
        id: m.id,
        date: m.created_at || m.data || m.date || '',
        produto_id: m.produto_id || '',
        produto_nome: m.produto?.nome || m.produto_nome || m.nome_produto || '',
        tipo: m.tipo || m.type || (m.entrada ? 'entrada' : m.saida ? 'saida' : ''),
        quantidade: Number(m.quantidade || m.qtd || m.valor || 0),
      }));
      setMovs(items);

      // Try to refresh the affected product and notify other pages
      try {
        const updated = await produtoService.getProduto(String(produtoId));
        // dispatch global event to notify products list to update
        window.dispatchEvent(new CustomEvent('produto-quantidade-atualizada', { detail: { id: String(produtoId), produto: updated } }));
      } catch (err) {
        // ignore individual product refresh errors
      }

      // show success toast
      toast.success(`Movimentação de ${tipo} registrada com sucesso.`);

      setQuantidade(0);
      setProdutoId('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-300 mx-auto mb-4"></div>
          <div className="text-gray-700 dark:text-gray-300">Carregando movimentações...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-3 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Movimentações</h1>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Mostrar somente recentes</label>
              <input type="checkbox" checked={onlyRecent} onChange={e => setOnlyRecent(e.target.checked)} className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Quick Register Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold">Registrar Movimentação Rápida</h3>
          <form onSubmit={submit} className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Produto</label>
              <select value={produtoId} onChange={e => setProdutoId(e.target.value)} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="">Selecione um produto</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Quantidade</label>
              <input type="number" min={1} value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 dark:text-gray-300">Tipo</label>
                <div className="flex gap-3 mt-1">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" checked={tipo === 'entrada'} onChange={() => setTipo('entrada')} /> Entrada
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" checked={tipo === 'saida'} onChange={() => setTipo('saida')} /> Saída
                  </label>
                </div>
              </div>
              <div>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded">{isLoading ? 'Processando...' : 'Registrar'}</button>
              </div>
            </div>
          </form>
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">{error}</div>}

        {/* Filters Card - Only visible to admins */}
        {isAdmin && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Data início</label>
              <input type="date" value={filterInicio} onChange={e => setFilterInicio(e.target.value)} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Data fim</label>
              <input type="date" value={filterFim} onChange={e => setFilterFim(e.target.value)} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 dark:text-gray-300">Produto</label>
              <select value={produtoId} onChange={e => setProdutoId(e.target.value)} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="">Todos os produtos</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={async () => {
              setIsLoading(true);
              setAppliedFilters({ inicio: filterInicio, fim: filterFim, produtoId });
              try {
                const list = await movimentacaoService.listMovimentacoes({ inicio: filterInicio || undefined, fim: filterFim || undefined, produto_id: produtoId || undefined });
                const raw = Array.isArray(list) ? list : (list.movimentacoes || list.data || []);
                const items = raw.map((m: any) => ({ id: m.id, date: m.data || m.created_at || m.date || '', produto_id: String(m.produto_id || ''), usuario_id: String(m.usuario_id || ''), usuario_nome: m.usuario_nome || '', produto_nome: m.produto?.nome || m.produto_nome || m.nome_produto || '', tipo: m.tipo || m.type || (m.entrada ? 'entrada' : m.saida ? 'saida' : ''), quantidade: Number(m.quantidade || m.qtd || m.valor || 0) }));
                setMovs(items);
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
              } finally {
                setIsLoading(false);
              }
            }} className="px-4 py-2 bg-indigo-600 text-white rounded">Filtrar</button>
            <button onClick={() => { setFilterInicio(''); setFilterFim(''); setProdutoId(''); setAppliedFilters({ inicio: '', fim: '', produtoId: '' }); }} className="px-4 py-2 border rounded">Limpar</button>
          </div>
        </div>
        )}

        {/* Movements list as responsive cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const filtered = filterMovimentacoes(movs);
            if (filtered.length === 0) {
              return <div className="text-gray-600 dark:text-gray-400">Nenhuma movimentação encontrada.</div>;
            }
            return filtered.map(m => (
              <div key={m.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{formatDateTimeDisplay(m.date)}</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{m.produto_nome}</div>
                    {isAdmin && m.usuario_nome && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Por: {m.usuario_nome}</div>
                    )}
                    <div className="mt-2">
                      <span className={"px-3 py-1 rounded-full text-xs font-medium " + (m.tipo === 'entrada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200')}>
                        {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{m.quantidade}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">unidades</div>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

export default Movimentacoes;
