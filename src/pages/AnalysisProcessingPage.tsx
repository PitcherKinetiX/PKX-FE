import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useAnalysisStatus } from '../hooks/useAnalysis';

export default function AnalysisProcessingPage() {
  const { id } = useParams<{ id: string }>();
  const analysisId = id ? Number(id) : null;
  const navigate = useNavigate();

  const { data: status } = useAnalysisStatus(analysisId);

  useEffect(() => {
    if (status?.status === 'COMPLETED') {
      navigate('/history');
    }
  }, [status?.status, navigate]);

  const progress = status?.progress ?? 0;

  const statusLabel = () => {
    switch (status?.status) {
      case 'UPLOADING': return '영상 업로드 중...';
      case 'PROCESSING': return 'AI 분석 진행 중...';
      case 'FAILED': return '분석 실패';
      default: return '분석 준비 중...';
    }
  };

  const isFailed = status?.status === 'FAILED';

  return (
    <div className="min-h-screen bg-navy-900">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        {!isFailed ? (
          <>
            <div className="w-20 h-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mb-8" />
            <h2 className="text-2xl font-bold text-white mb-2">{statusLabel()}</h2>
            <p className="text-gray-400 mb-8">분석이 완료되면 자동으로 히스토리 화면으로 이동합니다.</p>

            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress}%</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-8">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">분석 실패</h2>
            <p className="text-gray-400 mb-2">{status?.errorMessage ?? '알 수 없는 오류가 발생했습니다.'}</p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-6 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
            >
              다시 시도
            </button>
          </>
        )}
      </div>
    </div>
  );
}
