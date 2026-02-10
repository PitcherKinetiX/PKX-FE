import apiClient from './client';
import type { UpdateProfileRequest, UserProfile } from '../types/auth.types';

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get<{ data: UserProfile }>('/users/me');
    return response.data.data;
  },

  updateProfile: async (payload: UpdateProfileRequest) => {
    const response = await apiClient.put<{ data: UserProfile }>('/users/me', payload);
    return response.data.data;
  },
};

