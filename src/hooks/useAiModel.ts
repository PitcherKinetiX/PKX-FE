import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiModelApi } from '../api/aimodel.api';

/**
 * React Query hook for fetching AI model status
 * Automatically polls every 3 seconds when training is in progress
 */
export const useModelStatus = () => {
  return useQuery({
    queryKey: ['aiModelStatus'],
    queryFn: aiModelApi.getStatus,
    refetchInterval: (query) =>
      query.state.data?.trainingStatus === 'TRAINING' ? 3000 : false, // Poll every 3 seconds during training
  });
};

/**
 * React Query hook for training AI model
 * Invalidates model status query on success
 */
export const useTrainModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (analysisIds: number[]) => aiModelApi.train(analysisIds),
    onSuccess: () => {
      // Invalidate and refetch model status
      queryClient.invalidateQueries({ queryKey: ['aiModelStatus'] });
    },
  });
};
