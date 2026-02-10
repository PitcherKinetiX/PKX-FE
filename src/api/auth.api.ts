import apiClient from './client';
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types/auth.types';

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', data);
    return response.data.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
