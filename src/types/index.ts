// User types
export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'administrador' | 'funcionario';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateUserData {
  nome: string;
  email: string;
  password: string;
  tipo: 'administrador' | 'funcionario';
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  tipo?: 'administrador' | 'funcionario';
  password?: string;
}

// Product types
export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: string | number;
  preco: string | number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateProdutoData {
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
}

export interface UpdateProdutoData {
  nome?: string;
  categoria?: string;
  quantidade?: number;
  preco?: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: CreateUserData) => Promise<void>;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
}

// API Error
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
