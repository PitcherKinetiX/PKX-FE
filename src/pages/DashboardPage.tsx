import { downloadPdf } from '../utils/downloadPdf';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import AnalysisReport from '../components/dashboard/AnalysisReport';
import { useAnalysisList, useAnalysisDetail } from '../hooks/useAnalysis';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: listData, isLoading: isListLoading, error: listError } = useAnalysisList(0, 1);
  const latestAnalysis = listData?.items?.[0] ?? null;

  const { data: detail, isLoading: isDetailLoading } = useAnalysisDetail(
    latestAnalysis?.analysisId ?? null,
  );

  const isLoading = isListLoading || (!!latestAnalysis && isDetailLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (listError) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            대시보드 데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      </div>
    );
  }

  if (!latestAnalysis) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg mb-2">아직 분석 기록이 없습니다.</p>
            <Link to="/upload" className="text-cyan-400 hover:text-cyan-300 text-sm underline">
              첫 영상을 업로드해보세요
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = detail?.result;

  const displayFilename = detail?.videoFilename ?? latestAnalysis.videoFilename;
  const displayCreatedAt = detail?.createdAt
    ? format(new Date(detail.createdAt), 'yyyy년 M월 d일 HH:mm')
    : format(new Date(latestAnalysis.createdAt), 'yyyy년 M월 d일 HH:mm');

  const isProcessing = latestAnalysis.status === 'PROCESSING' || latestAnalysis.status === 'PENDING';

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100">
      <Header />
      <main id="dashboard-report" className="max-w-6xl mx-auto px-6 py-8">

        {/* ── 헤더 ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold mb-1">최신 분석 리포트</h1>
            <p className="text-sm text-slate-400">{displayCreatedAt}</p>
            <p className="text-xs text-slate-500">{displayFilename}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/history"
              className="px-4 py-2 text-sm border border-slate-700 rounded-lg text-slate-200 hover:bg-navy-800 transition-colors"
            >
              전체 리포트 보기
            </Link>
            <button
              onClick={() => downloadPdf('dashboard-report', '분석리포트.pdf')}
              className="px-4 py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              PDF 다운받기
            </button>
          </div>
        </div>

        {/* 분석 진행중 배너 */}
        {isProcessing && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-4 py-3 rounded-lg mb-6 text-sm">
            현재 분석이 진행 중입니다. 완료되면 결과가 표시됩니다.
          </div>
        )}

        {result ? (
          <AnalysisReport result={result} />
        ) : (
          <div className="bg-navy-800 border border-slate-700 rounded-lg p-12 text-center text-slate-400">
            {isProcessing ? (
              <p>분석이 진행 중입니다. 잠시 후 다시 확인해주세요.</p>
            ) : (
              <p>분석 결과가 아직 없습니다.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
