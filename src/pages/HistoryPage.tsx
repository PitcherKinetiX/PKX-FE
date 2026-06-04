import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '../components/layout/Header';
import StatusBadge from '../components/ui/StatusBadge';
import AnalysisReport from '../components/dashboard/AnalysisReport';
import { useAnalysisList, useAnalysisDetail, useDeleteAnalysis, useDownloadPdf } from '../hooks/useAnalysis';
import type { AnalysisListItem } from '../types/analysis.types';

function ExpandedDetail({ analysisId }: { analysisId: number }) {
  const { data: detail, isLoading, error } = useAnalysisDetail(analysisId);

  if (isLoading) {
    return (
      <div className="border-t border-slate-700 bg-navy-900/50 p-6 flex items-center justify-center">
        <div className="text-slate-400 text-sm">분석 결과를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !detail?.result) {
    return (
      <div className="border-t border-slate-700 bg-navy-900/50 p-6 text-center">
        <p className="text-slate-400 text-sm">분석 결과를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-700 bg-navy-900/50 p-6">
      <AnalysisReport result={detail.result} />
    </div>
  );
}

export default function HistoryPage() {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<number | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState<number[]>([]);
  const pageSize = 10;
  const { data, isLoading, error } = useAnalysisList(page, pageSize);
  const deleteMutation = useDeleteAnalysis();
  const downloadMutation = useDownloadPdf();

  const toggleAnalysisSelection = (analysisId: number) => {
    setSelectedAnalyses(prev => {
      if (prev.includes(analysisId)) return prev.filter(id => id !== analysisId);
      if (prev.length < 2) return [...prev, analysisId];
      return prev;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            분석 기록을 불러오는데 실패했습니다
          </div>
        </div>
      </div>
    );
  }

  const analyses = data?.items ?? [];
  const totalCount = data?.totalElements ?? analyses.length;
  const hasNextPage = data?.hasNext ?? false;

  const filteredAnalyses = analyses.filter((analysis) =>
    analysis.videoFilename.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">히스토리</h1>
            <p className="text-slate-400 text-sm">
              {comparisonMode
                ? `두 리포트를 선택하세요 (${selectedAnalyses.length}/2 선택됨)`
                : `총 ${totalCount}개의 분석 기록`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {comparisonMode ? (
              <>
                <button
                  onClick={() => { setComparisonMode(false); setSelectedAnalyses([]); }}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-slate-200 hover:bg-navy-800 transition-colors"
                >
                  취소
                </button>
                <Link
                  to={selectedAnalyses.length === 2 ? `/comparison?prev=${selectedAnalyses[0]}&recent=${selectedAnalyses[1]}` : '#'}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedAnalyses.length === 2
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => selectedAnalyses.length !== 2 && e.preventDefault()}
                >
                  비교하기
                </Link>
              </>
            ) : (
              <button
                onClick={() => { setComparisonMode(true); setSelectedAnalyses([]); }}
                className="px-4 py-2 border border-slate-700 rounded-lg text-slate-200 hover:bg-navy-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                리포트 비교하기
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="영상 이름 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-navy-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-navy-50/30 border border-gray-700/50 rounded-xl p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-navy-50/50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">분석 기록이 없습니다</h3>
            <p className="text-sm text-gray-400 mb-6">첫 번째 투구 영상을 업로드하여 분석을 시작해보세요.</p>
            <Link
              to="/upload"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
            >
              분석 시작
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredAnalyses.length === 0 ? (
                <div className="bg-navy-50/30 border border-gray-700/50 rounded-xl p-8 text-center text-sm text-gray-400">
                  검색 결과가 없습니다.
                </div>
              ) : (
                filteredAnalyses.map((analysis: AnalysisListItem) => {
                  const isExpanded = expandedAnalysisId === analysis.analysisId;
                  const isCompleted = analysis.status === 'COMPLETED';

                  return (
                    <div
                      key={analysis.analysisId}
                      className={`bg-navy-800 border rounded-lg overflow-hidden transition-colors ${
                        comparisonMode && selectedAnalyses.includes(analysis.analysisId)
                          ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`flex items-start gap-3 ${comparisonMode ? 'ml-9' : ''}`}>
                            {comparisonMode && (
                              <div className="absolute mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={selectedAnalyses.includes(analysis.analysisId)}
                                  onChange={() => toggleAnalysisSelection(analysis.analysisId)}
                                  disabled={!selectedAnalyses.includes(analysis.analysisId) && selectedAnalyses.length >= 2}
                                  className="w-5 h-5 rounded border-slate-600 bg-navy-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 disabled:opacity-50"
                                />
                              </div>
                            )}
                            <svg className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <h3 className="font-medium mb-1">{analysis.videoFilename}</h3>
                              <p className="text-sm text-slate-400 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {format(new Date(analysis.createdAt), 'yyyy년 M월 d일 HH:mm')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {analysis.riskGrade && (
                              <StatusBadge status={analysis.riskGrade as 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER'} />
                            )}
                            {isCompleted && (
                              <button
                                onClick={() => downloadMutation.mutate(analysis.analysisId)}
                                disabled={downloadMutation.isPending}
                                className="p-2 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="PDF 다운로드"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => deleteMutation.mutate(analysis.analysisId)}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="삭제"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {analysis.overallRiskScore != null && (
                          <div className="mb-4">
                            <p className="text-xs text-slate-400 mb-1">전체 위험도</p>
                            <p className="text-2xl font-bold">{analysis.overallRiskScore.toFixed(0)}</p>
                          </div>
                        )}

                        {isCompleted ? (
                          <button
                            onClick={() => setExpandedAnalysisId(isExpanded ? null : analysis.analysisId)}
                            className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                          >
                            {isExpanded ? '접기' : '상세 리포트 보기'}
                            <svg
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        ) : (
                          <p className="text-xs text-slate-500">
                            {analysis.status === 'PROCESSING' || analysis.status === 'PENDING'
                              ? '분석 진행 중...'
                              : '분석 실패'}
                          </p>
                        )}
                      </div>

                      {isExpanded && <ExpandedDetail analysisId={analysis.analysisId} />}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-400 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              <span className="text-sm text-slate-400">페이지 {page + 1}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
                className="px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-400 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
