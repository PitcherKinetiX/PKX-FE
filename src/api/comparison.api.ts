import apiClient from './client';
import type { ComparisonResponse } from '../types/comparison.types';

export const comparisonApi = {
  /**
   * Compare two analyses (baseline vs current)
   */
  compare: async (baselineAnalysisId: number, currentAnalysisId: number): Promise<ComparisonResponse> => {
    const response = await apiClient.post<{ data: ComparisonResponse }>('/comparisons', {
      baselineAnalysisId,
      currentAnalysisId,
    });
    return response.data.data;
  },
};
