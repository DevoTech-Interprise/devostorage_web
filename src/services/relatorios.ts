import apiClient from './api';

type PeriodoParams = { inicio?: string; fim?: string; produto_id?: string };

export const relatorioService = {
  async getEstoque() {
    try {
      const res = await apiClient.getClient().get('/api/relatorios/estoque');
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async getMovimentacoes(params?: PeriodoParams) {
    try {
      const query = new URLSearchParams();
      if (params?.inicio) query.set('inicio', params.inicio);
      if (params?.fim) query.set('fim', params.fim);
      if (params?.produto_id) query.set('produto_id', params.produto_id);
      const url = `/api/relatorios/movimentacoes${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await apiClient.getClient().get(url);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async getMovimentacoesByProduto(produtoId: string) {
    try {
      const res = await apiClient.getClient().get(`/api/relatorios/produto/${produtoId}/movimentacoes`);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async listDownloads() {
    try {
      const res = await apiClient.getClient().get('/api/downloads');
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async gerarEstoquePdf() {
    try {
      const res = await apiClient.getClient().get('/api/relatorios/estoque/pdf');
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async gerarEstoqueExcel() {
    try {
      const res = await apiClient.getClient().get('/api/relatorios/estoque/excel');
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async gerarMovimentacoesPdf(params?: PeriodoParams) {
    try {
      const query = new URLSearchParams();
      if (params?.inicio) query.set('inicio', params.inicio);
      if (params?.fim) query.set('fim', params.fim);
      if (params?.produto_id) query.set('produto_id', params.produto_id);
      const url = `/api/relatorios/movimentacoes/pdf${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await apiClient.getClient().get(url);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async gerarMovimentacoesExcel(params?: PeriodoParams) {
    try {
      const query = new URLSearchParams();
      if (params?.inicio) query.set('inicio', params.inicio);
      if (params?.fim) query.set('fim', params.fim);
      if (params?.produto_id) query.set('produto_id', params.produto_id);
      const url = `/api/relatorios/movimentacoes/excel${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await apiClient.getClient().get(url);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },

  async downloadFile(nomeArquivo: string) {
    try {
      const res = await apiClient.getClient().get(`/api/download/${nomeArquivo}`);
      return res.data;
    } catch (err) {
      return apiClient.handleError(err);
    }
  },
};