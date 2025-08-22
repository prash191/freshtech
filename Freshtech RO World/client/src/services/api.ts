import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config, endpoints } from '@/constants/config';
import { ApiResponse } from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${config.api.baseUrl}/api/${config.api.apiVersion}`,
      timeout: config.api.timeout,
      withCredentials: config.api.withCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Check for stored auth data and add Authorization header if available
        const storedAuth = localStorage.getItem('freshtech_auth');
        if (storedAuth) {
          try {
            const authData = JSON.parse(storedAuth);
            if (authData.token) {
              config.headers.Authorization = `Bearer ${authData.token}`;
            }
          } catch (error) {
            // If parsing fails, clear the invalid data
            localStorage.removeItem('freshtech_auth');
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any): void {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('freshtech_auth');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error');
    } else {
      // Other error
      console.error('Error:', error.message);
    }
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  // File upload method
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Auth API methods
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post(endpoints.auth.login, credentials),
  
  register: (userData: { name: string; email: string; password: string }) =>
    apiService.post(endpoints.auth.register, userData),
  
  logout: () => apiService.post(endpoints.auth.logout),
  
  refresh: () => apiService.post(endpoints.auth.refresh),
  
  getProfile: () => apiService.get(endpoints.auth.profile),
  
  updateProfile: (data: any) => apiService.patch(endpoints.auth.profile, data),
};

// Products API methods
export const productsAPI = {
  getAll: (params?: any) => {
    const timestamp = Date.now();
    const paramsWithTimestamp = { ...params, _t: timestamp };
    return apiService.get(endpoints.products.list, { params: paramsWithTimestamp });
  },
  
  getById: (id: string) => apiService.get(endpoints.products.detail(id)),
  
  create: (data: any) => apiService.post(endpoints.products.create, data),
  
  update: (id: string, data: any) => apiService.put(endpoints.products.update(id), data),
  
  delete: (id: string) => apiService.delete(endpoints.products.delete(id)),
  
  uploadImage: (formData: FormData) => apiService.upload('/upload', formData),
};

// Reviews API methods
export const reviewsAPI = {
  getAll: (params?: any) => apiService.get(endpoints.reviews.list, { params }),
  
  create: (data: any) => apiService.post(endpoints.reviews.create, data),
  
  update: (id: string, data: any) => apiService.put(endpoints.reviews.update(id), data),
  
  delete: (id: string) => apiService.delete(endpoints.reviews.delete(id)),
};

// Users API methods (admin only)
export const usersAPI = {
  getAll: (params?: any) => apiService.get(endpoints.users.list, { params }),
  
  getById: (id: string) => apiService.get(endpoints.users.detail(id)),
  
  update: (id: string, data: any) => apiService.put(endpoints.users.update(id), data),
  
  delete: (id: string) => apiService.delete(endpoints.users.delete(id)),
};

// Dashboard API methods (admin only)
export const dashboardAPI = {
  getStats: () => apiService.get(endpoints.dashboard.stats),
  
  getActivities: () => apiService.get(endpoints.dashboard.activities),
};

export default apiService;
