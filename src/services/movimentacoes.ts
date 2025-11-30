import apiClient from './api';
type MovParams = { inicio?: string; fim?: string; produto_id?: string };

export const movimentacaoService = {
  async entrada(payload: { produto_id: number | string; quantidade: number }) {
    try {
      const res = await apiClient.getClient().post('/api/movimentacoes/entrada', payload);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async saida(payload: { produto_id: number | string; quantidade: number }) {
    try {
      const res = await apiClient.getClient().post('/api/movimentacoes/saida', payload);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async listMovimentacoes(params?: MovParams) {
    try {
      const qs = new URLSearchParams();
      if (params?.inicio) qs.set('inicio', params.inicio);
      if (params?.fim) qs.set('fim', params.fim);
      if (params?.produto_id) qs.set('produto_id', params.produto_id as string);
      const url = `/api/relatorios/movimentacoes${qs.toString() ? `?${qs.toString()}` : ''}`;
      const res = await apiClient.getClient().get(url);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },
};

export default movimentacaoService;
