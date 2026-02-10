import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisApi } from '../api/analysis.api';

export const useAnalysisList = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['analyses', page, size],
    queryFn: () => analysisApi.getList(page, size),
  });
};

export const useAnalysisDetail = (analysisId: number | null) => {
  return useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => analysisApi.getDetail(analysisId!),
    enabled: !!analysisId,
  });
};

export const useAnalysisStatus = (analysisId: number | null, enabled = true) => {
  return useQuery({
    queryKey: ['analysisStatus', analysisId],
    queryFn: () => analysisApi.getStatus(analysisId!),
    enabled: !!analysisId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? 3000 : false;
    },
  });
};

export const useUploadAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => analysisApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
    },
  });
};

export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (analysisId: number) => analysisApi.delete(analysisId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
    },
  });
};

export const useDownloadPdf = () => {
  return useMutation({
    mutationFn: async (analysisId: number) => {
      const blob = await analysisApi.downloadPdf(analysisId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analysis-${analysisId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
