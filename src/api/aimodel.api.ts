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
   * Train user-specific AI model
   */
  train: async (analysisIds: number[]): Promise<TrainResponse> => {
    const response = await apiClient.post<{ data: TrainResponse }>('/ai-models/train', {
      analysisIds,
    });
    return response.data.data;
  },
};
