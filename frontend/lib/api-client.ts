import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: Date;
  completedAt?: Date;
  tags?: string[];
  user: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  _id: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.instance.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login or refresh token
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        this.token = storedToken;
      }
    }
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.instance.post<AuthResponse>('/auth/login', data);
    if (response.data.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await this.instance.post<AuthResponse>('/auth/register', data);
    if (response.data.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.instance.post<ApiResponse>('/auth/logout');
      this.clearToken();
      return response.data;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    const response = await this.instance.get<{success: boolean, data: any}>('/auth/me');
    return {
      id: response.data.data._id,
      name: response.data.data.name,
      email: response.data.data.email,
      role: response.data.data.role,
      avatar: response.data.data.avatar,
      createdAt: response.data.data.createdAt
    };
  }

  // User endpoints
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.instance.put<ApiResponse<User>>('/users/profile', data);
    return response.data.data!;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.instance.put<ApiResponse>('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  // Task endpoints
  async getTasks(): Promise<Task[]> {
    const response = await this.instance.get<ApiResponse<Task[]>>('/tasks');
    return response.data.data!;
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.instance.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await this.instance.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data!;
  }

  async updateTask(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    console.log('API Client - Updating task:', { id, data });
    const response = await this.instance.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    console.log('API Client - Update response:', response.data);
    return response.data.data!;
  }

  async deleteTask(id: string): Promise<ApiResponse> {
    const response = await this.instance.delete<ApiResponse>(`/tasks/${id}`);
    return response.data;
  }

  // Task status shortcuts
  async markTaskComplete(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'completed' });
  }

  async markTaskInProgress(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'in-progress' });
  }

  async markTaskPending(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'pending' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;