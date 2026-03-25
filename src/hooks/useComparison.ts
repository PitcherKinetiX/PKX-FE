import { useQuery } from '@tanstack/react-query';
import { comparisonApi } from '../api/comparison.api';

/**
 * React Query hook for comparing two analyses
 * @param baselineId - The baseline analysis ID
 * @param currentId - The current analysis ID to compare against baseline
 * @returns Query result with comparison data
 */
export const useComparison = (baselineId: number | null, currentId: number | null) => {
  return useQuery({
    queryKey: ['comparison', baselineId, currentId],
    queryFn: () => comparisonApi.compare(baselineId!, currentId!),
    enabled: !!baselineId && !!currentId, // Only run query when both IDs are available
  });
};
