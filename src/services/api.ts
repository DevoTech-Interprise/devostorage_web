import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiError } from '../types';

const BASE_URL = 'https://devotech.com.br/devostorange/devostorange_api/public';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Don't redirect if it's a login attempt that failed
          const isLoginRequest = error.config?.url?.includes('/api/users/login');
          
          if (!isLoginRequest) {
            // Token expired or invalid, clear auth
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/devostorange/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  getClient() {
    return this.client;
  }

  async handleError(error: unknown): Promise<never> {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        errors: error.response?.data?.errors,
      };
      throw apiError;
    }
    throw error;
  }
}

export default new ApiClient();
