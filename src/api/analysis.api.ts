import apiClient from './client';
import type { AnalysisDetail, AnalysisListItem, AnalysisStatus } from '../types/analysis.types';

export const analysisApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/analyses/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getStatus: async (analysisId: number) => {
    const response = await apiClient.get<{ data: AnalysisStatus }>(`/analyses/${analysisId}/status`);
    return response.data.data;
  },

  getDetail: async (analysisId: number) => {
    const response = await apiClient.get<{ data: AnalysisDetail }>(`/analyses/${analysisId}`);
    return response.data.data;
  },

  getList: async (page = 0, size = 10) => {
    const response = await apiClient.get<{ data: { content: AnalysisListItem[] } }>('/analyses', {
      params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data.data;
  },

  delete: async (analysisId: number) => {
    const response = await apiClient.delete(`/analyses/${analysisId}`);
    return response.data;
  },

  downloadPdf: async (analysisId: number) => {
    const response = await apiClient.get(`/analyses/${analysisId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
