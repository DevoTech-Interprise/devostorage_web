import { useEffect, useState } from 'react';
import { relatorioService } from '../services/relatorios';
import { produtoService } from '../services/produto';
import { useRole } from '../hooks/useRole';
import type { Produto } from '../types';
import { Package, FileText, Download } from 'lucide-react';

export const Relatorios: React.FC = () => {
  const { isAdmin } = useRole();
  const [estoque, setEstoque] = useState<any>(null);
  const [movimentacoes, setMovimentacoes] = useState<any>(null);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [produtoId, setProdutoId] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setIsLoading(true);
    try {
      const [est, prods, downs] = await Promise.all([
        relatorioService.getEstoque(),
        produtoService.listProdutos(),
        relatorioService.listDownloads(),
      ]);
      setEstoque(est);
      setProdutos(prods);
      setDownloads(downs?.arquivos || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (d: any) => {
    if (!d) return '-';
    try {
      // backend returns 'YYYY-MM-DD HH:mm:ss' — convert to ISO-like for Date
      const iso = String(d).replace(' ', 'T');
      const dt = new Date(iso);
      return dt.toLocaleString();
    } catch {
      return String(d);
    }
  };

  const computeAggregates = (list: any[]) => {
    const resumo = { total: 0, entradas: 0, saidas: 0, quantidade_total: 0 };
    if (!Array.isArray(list)) return resumo;
    resumo.total = list.length;
    for (const m of list) {
      const qtd = Number(m.quantidade || m.qtd || 0) || 0;
      resumo.quantidade_total += qtd;
      if ((m.tipo || '').toString() === 'entrada') resumo.entradas += 1;
      else if ((m.tipo || '').toString() === 'saida') resumo.saidas += 1;
    }
    return resumo;
  };

  const buscarMovimentacoes = async () => {
    setIsLoading(true);
    try {
      const data = await relatorioService.getMovimentacoes({
        inicio: inicio || undefined,
        fim: fim || undefined,
        produto_id: produtoId,
      });
      setMovimentacoes(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const gerarArquivo = async (tipo: 'estoque'|'movimentacoes', formato: 'pdf'|'excel') => {
    try {
      let res;
      if (tipo === 'estoque') {
        res = formato === 'pdf' ? await relatorioService.gerarEstoquePdf() : await relatorioService.gerarEstoqueExcel();
      } else {
        res = formato === 'pdf'
          ? await relatorioService.gerarMovimentacoesPdf({ inicio: inicio || undefined, fim: fim || undefined, produto_id: produtoId })
          : await relatorioService.gerarMovimentacoesExcel({ inicio: inicio || undefined, fim: fim || undefined, produto_id: produtoId });
      }
      if (res?.url) {
        window.open(res.url, '_blank');
      } else if (res?.arquivo) {
        window.open(res.url || res.arquivo, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-300 mx-auto mb-4"></div>
          <div className="text-gray-700 dark:text-gray-300">Carregando relatórios...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center">
          <div className="mb-4">
            <Package className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acesso Restrito</h1>
          <p className="text-gray-600 dark:text-gray-300">Apenas administradores podem acessar relatórios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">{error}</div>}

        {/* Estoque Report Section */}
        <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Relatório de Estoque</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => gerarArquivo('estoque','pdf')} className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600">Gerar PDF</button>
              <button onClick={() => gerarArquivo('estoque','excel')} className="px-3 py-1 bg-green-600 dark:bg-green-500 text-white rounded text-sm hover:bg-green-700 dark:hover:bg-green-600">Gerar Excel</button>
            </div>
          </div>
        </section>

        {/* Estoque summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-3">
            <FileText className="h-6 w-6 text-indigo-600" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Total produtos</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">{estoque?.total_produtos ?? '-'}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900 rounded"><Package className="h-5 w-5 text-indigo-700 dark:text-indigo-200" /></div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Itens em estoque</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">{estoque?.total_itens_estoque ?? '-'}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Valor total</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">R$ {estoque?.valor_total_estoque ?? '-'}</div>
            </div>
          </div>
        </div>

        {/* Movimentações filters + actions */}
        <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Relatório de Movimentações</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => gerarArquivo('movimentacoes','pdf')} className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded text-sm">Gerar PDF</button>
              <button onClick={() => gerarArquivo('movimentacoes','excel')} className="px-3 py-1 bg-green-600 dark:bg-green-500 text-white rounded text-sm">Gerar Excel</button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            <input type="date" value={fim} onChange={e => setFim(e.target.value)} className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            <select value={produtoId} onChange={e => setProdutoId(e.target.value || undefined)} className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <option value="">Todos os produtos</option>
              {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={buscarMovimentacoes} className="px-3 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded w-full">Buscar</button>
            </div>
          </div>

          <div className="mt-4">
            {movimentacoes ? (
              (() => {
                const list = movimentacoes?.movimentacoes || [];
                const periodoResp = movimentacoes?.periodo || { inicio: inicio || null, fim: fim || null };
                const aggregates = computeAggregates(list);
                return (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Período</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{periodoResp.inicio || '-'} {periodoResp.inicio || periodoResp.fim ? '—' : ''} {periodoResp.fim || ''}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500 dark:text-gray-300">Total registros</div>
                        <div className="text-xl font-semibold text-gray-900 dark:text-white">{aggregates.total}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Entradas</div>
                        <div className="px-2 py-1 rounded bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 text-sm">{aggregates.entradas}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Saídas</div>
                        <div className="px-2 py-1 rounded bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">{aggregates.saidas}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Qtd total</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{aggregates.quantidade_total}</div>
                      </div>
                    </div>

                    {list.length === 0 ? (
                      <div className="text-gray-600 dark:text-gray-300">Nenhum resultado. Ajuste os filtros e clique em Buscar.</div>
                    ) : (
                      <>
                        {/* Desktop table */}
                        <div className="hidden md:block">
                          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Data</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Produto</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Categoria</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Usuário</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Tipo</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">Quantidade</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                {list.map((m: any) => (
                                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{formatDate(m.data || m.created_at || m.date)}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{m.produto_nome}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{m.categoria || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{m.usuario_nome || '-'}</td>
                                    <td className="px-4 py-3 text-sm">
                                      <span className={"px-2 py-1 rounded text-xs " + ((m.tipo === 'entrada') ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200')}>{(m.tipo || '').toString().toUpperCase()}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-indigo-600 dark:text-indigo-300">{Number(m.quantidade ?? m.qtd ?? 0)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                          {list.map((m: any) => (
                            <div key={m.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(m.data || m.created_at || m.date)}</div>
                                  <div className="font-medium text-gray-900 dark:text-white">{m.produto_nome}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{m.categoria || ''}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{Number(m.quantidade ?? m.qtd ?? 0)}</div>
                                  <div className="mt-1">
                                    <span className={"px-2 py-1 rounded text-xs " + ((m.tipo === 'entrada') ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200')}>{(m.tipo || '').toUpperCase()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Usuário: {m.usuario_nome || '-'}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-gray-600 dark:text-gray-300">Nenhum resultado. Use os filtros e clique em Buscar.</div>
            )}
          </div>
        </section>

        {/* Downloads */}
        <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold text-gray-900 dark:text-white">Arquivos disponíveis</h2>
          <div className="mt-3 space-y-2">
            {downloads.length === 0 && <div className="text-sm text-gray-600 dark:text-gray-300">Nenhum arquivo encontrado.</div>}
            {downloads.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">{f.nome}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{f.tamanho_formatado} • {f.criado_em}</div>
                </div>
                <div>
                  <button onClick={async () => {
                    try {
                      const downloadData = await relatorioService.downloadFile(f.nome);
                      if (downloadData?.url) {
                        window.open(downloadData.url, '_blank');
                      }
                    } catch (err) {
                      setError(err instanceof Error ? err.message : String(err));
                    }
                  }} className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600">
                    <Download className="h-4 w-4" /> Baixar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};