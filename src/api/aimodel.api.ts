import apiClient from './client';
import type { ModelStatusResponse, TrainResponse } from '../types/aimodel.types';

export const aiModelApi = {
  /**
   * Get current AI model status
   */
  getStatus: async (): Promise<ModelStatusResponse> => {
    const response = await apiClient.get<{ data: ModelStatusResponse }>('/ai-models/status');
    return response.data.data;
  },

  /**
   * Train user-specific AI model by uploading training videos (min 10).
   */
  train: async (files: File[]): Promise<TrainResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await apiClient.post<{ data: TrainResponse }>('/ai-models/train', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 600000, // 영상 다수 업로드 — 넉넉한 타임아웃
    });
    return response.data.data;
  },
};
