import apiClient from './api';
import type { Produto, CreateProdutoData, UpdateProdutoData } from '../types';

export const produtoService = {
  async listProdutos(): Promise<Produto[]> {
    try {
      const response = await apiClient.getClient().get<Produto[]>('/api/produtos');
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async getProduto(id: string): Promise<Produto> {
    try {
      const response = await apiClient.getClient().get<Produto>(`/api/produtos/${id}`);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async createProduto(data: CreateProdutoData): Promise<Produto> {
    try {
      const response = await apiClient.getClient().post<Produto>('/api/produtos', data);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async updateProduto(id: string, data: UpdateProdutoData): Promise<Produto> {
    try {
      const response = await apiClient.getClient().put<Produto>(`/api/produtos/${id}`, data);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async deleteProduto(id: string): Promise<void> {
    try {
      await apiClient.getClient().delete(`/api/produtos/${id}`);
    } catch (error) {
      return apiClient.handleError(error);
    }
  },
};
