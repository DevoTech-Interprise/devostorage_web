import apiClient from './api';
import type { LoginCredentials, AuthResponse, User, CreateUserData, UpdateUserData } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.getClient().post<AuthResponse>('/api/users/login', credentials);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.getClient().get<User>('/api/users/me');
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async register(userData: CreateUserData): Promise<User> {
    try {
      const response = await apiClient.getClient().post<User>('/api/users', userData);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async listUsers(): Promise<User[]> {
    try {
      const response = await apiClient.getClient().get<User[]>('/api/users');
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async getUser(id: string): Promise<User> {
    try {
      const response = await apiClient.getClient().get<User>(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await apiClient.getClient().patch<User>(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.getClient().delete(`/api/users/${id}`);
    } catch (error) {
      return apiClient.handleError(error);
    }
  },
};
