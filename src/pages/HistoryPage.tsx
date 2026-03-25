import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '../components/layout/Header';
import StatusBadge from '../components/ui/StatusBadge';
import RadarChart from '../components/dashboard/RadarChart';
import GaugeBar from '../components/ui/GaugeBar';
import { useAnalysisList, useDeleteAnalysis, useDownloadPdf } from '../hooks/useAnalysis';
import type { AnalysisListItem, FeatureDetail } from '../types/analysis.types';

const DUMMY_FEATURES: FeatureDetail[] = [
  { index: 0, name: 'L_elbow_angle', type: 'angle', userError: 0.084, generalError: 0.046, level: '양호' },
  { index: 1, name: 'R_elbow_angle', type: 'angle', userError: 0.052, generalError: 0.038, level: '정상' },
  { index: 2, name: 'L_shoulder_angle', type: 'angle', userError: 0.121, generalError: 0.067, level: '주의' },
  { index: 3, name: 'R_shoulder_angle', type: 'angle', userError: 0.095, generalError: 0.055, level: '양호' },
  { index: 4, name: 'L_hip_angle', type: 'angle', userError: 0.145, generalError: 0.082, level: '주의' },
  { index: 5, name: 'R_hip_angle', type: 'angle', userError: 0.068, generalError: 0.041, level: '정상' },
  { index: 6, name: 'L_knee_angle', type: 'angle', userError: 0.043, generalError: 0.035, level: '정상' },
  { index: 7, name: 'R_knee_angle', type: 'angle', userError: 0.076, generalError: 0.048, level: '양호' },
  { index: 8, name: 'knee_ext_vel', type: 'velocity', userError: 0.092, generalError: 0.061, level: '양호' },
  { index: 9, name: 'pelvis_rot_vel', type: 'velocity', userError: 0.058, generalError: 0.042, level: '정상' },
  { index: 10, name: 'trunk_rot_vel', type: 'velocity', userError: 0.112, generalError: 0.073, level: '주의' },
  { index: 11, name: 'elbow_ext_vel', type: 'velocity', userError: 0.067, generalError: 0.044, level: '정상' },
  { index: 12, name: 'shoulder_ir_vel', type: 'velocity', userError: 0.188, generalError: 0.095, level: '위험' },
];

const DUMMY_ANALYSES: AnalysisListItem[] = [
  {
    analysisId: 1,
    videoFilename: 'fastball_session_01.mp4',
    videoDurationSeconds: 12,
    status: 'COMPLETED',
    createdAt: '2025-12-19T10:30:00',
    completedAt: '2025-12-19T10:31:00',
    riskGrade: 'GOOD',
    overallRiskScore: 28,
  },
  {
    analysisId: 2,
    videoFilename: 'curveball_practice.mp4',
    videoDurationSeconds: 15,
    status: 'COMPLETED',
    createdAt: '2025-12-15T14:20:00',
    completedAt: '2025-12-15T14:21:00',
    riskGrade: 'NORMAL',
    overallRiskScore: 45,
  },
  {
    analysisId: 3,
    videoFilename: 'slider_analysis.mp4',
    videoDurationSeconds: 9,
    status: 'COMPLETED',
    createdAt: '2025-12-10T21:15:00',
    completedAt: '2025-12-10T21:16:00',
    riskGrade: 'CAUTION',
    overallRiskScore: 68,
  },
];

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

  const mockJointMetrics = {
    features: DUMMY_FEATURES,
    shoulderStress: 25,
    elbowLoad: 30,
    wristLoad: 20,
    spineAngle: 35,
    kneeStability: 28,
    hipRotation: 32,
  };

  const toggleAnalysisSelection = (analysisId: number) => {
    setSelectedAnalyses(prev => {
      if (prev.includes(analysisId)) {
        return prev.filter(id => id !== analysisId);
      } else if (prev.length < 2) {
        return [...prev, analysisId];
      }
      return prev;
    });
  };

  const handleStartComparison = () => {
    setComparisonMode(true);
    setSelectedAnalyses([]);
  };

  const handleCancelComparison = () => {
    setComparisonMode(false);
    setSelectedAnalyses([]);
  };

  void deleteMutation;
  void downloadMutation;

  const getStatusBadge = (score?: number): 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER' => {
    if (!score) return 'NORMAL';
    if (score >= 80) return 'GOOD';
    if (score >= 60) return 'NORMAL';
    if (score >= 40) return 'CAUTION';
    return 'DANGER';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">Loading...</div>
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

  const apiAnalyses = data?.items || [];
  const useDummy = apiAnalyses.length === 0;

  const baseAnalyses = useDummy ? DUMMY_ANALYSES : apiAnalyses;

  const filteredAnalyses = baseAnalyses.filter((analysis) =>
    analysis.videoFilename.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const totalCount = baseAnalyses.length;
  const hasNextPage = !useDummy && baseAnalyses.length === pageSize;

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
                  onClick={handleCancelComparison}
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
                onClick={handleStartComparison}
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

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
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
          <button className="p-2.5 bg-navy-800 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {!useDummy && baseAnalyses.length === 0 ? (
          <div className="bg-navy-50/30 border border-gray-700/50 rounded-xl p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-navy-50/50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">클라우드 영상 업로드</h3>
            <p className="text-sm text-gray-400 mb-2">드래그해서 영상 파일을 올리거나</p>
            <p className="text-xs text-gray-500 mb-6">(MP4, MOV 등 일반 영상 파일 500MB)</p>
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
                  const consistencyScore = (analysis as any).consistencyScore || 87;
                  const medicalRiskScore = (analysis as any).medicalRiskScore || 22;

                  return (
                    <div
                      key={analysis.analysisId}
                      className={`bg-navy-800 border rounded-lg overflow-hidden transition-colors ${
                        comparisonMode && selectedAnalyses.includes(analysis.analysisId)
                          ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          {comparisonMode && (
                            <div className="absolute top-6 left-6">
                              <input
                                type="checkbox"
                                checked={selectedAnalyses.includes(analysis.analysisId)}
                                onChange={() => toggleAnalysisSelection(analysis.analysisId)}
                                disabled={!selectedAnalyses.includes(analysis.analysisId) && selectedAnalyses.length >= 2}
                                className="w-5 h-5 rounded border-slate-600 bg-navy-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 disabled:opacity-50"
                              />
                            </div>
                          )}
                          <div className={`flex items-start gap-3 ${comparisonMode ? 'ml-9' : ''}`}>
                            <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <h3 className="font-medium mb-1">{analysis.videoFilename}</h3>
                              <p className="text-sm text-slate-400 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {format(new Date(analysis.createdAt), 'yyyy년 M월 d일 오전 h:mm')}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={(analysis.riskGrade || getStatusBadge(analysis.overallRiskScore)) as 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER'} />
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-4">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">전체 위험도</p>
                            <p className="text-2xl font-bold">
                              {analysis.overallRiskScore?.toFixed(0) || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">투구 일관성</p>
                            <p className="text-2xl font-bold">{consistencyScore}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">의학적 위험</p>
                            <p className="text-2xl font-bold">{medicalRiskScore}</p>
                          </div>
                        </div>

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
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-slate-700 bg-navy-900/50 p-6 space-y-6">
                          {/* Risk Summary */}
                          <div className="bg-navy-800 border border-slate-700 rounded-lg px-6 py-5 flex items-start justify-between gap-6">
                            <div className="flex-1">
                              <h2 className="font-semibold mb-2">위험도 등급</h2>
                              <p className="text-sm text-slate-400 leading-relaxed">
                                전반적으로 안정한 투구 폼을 보이고 있습니다. 어깨와 팔꿈치의 각도가 이상적이며, 하체의 안정성도 우수합니다.
                              </p>
                            </div>
                            <StatusBadge status={(analysis.riskGrade || 'GOOD') as 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER'} />
                          </div>

                          {/* Three Metrics Cards */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-navy-800 border border-slate-700 rounded-lg p-5">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-xs text-slate-300">전체 위험도</span>
                              </div>
                              <div className="text-3xl font-bold mb-2">
                                {analysis.overallRiskScore}
                                <span className="text-base text-slate-400"> / 100</span>
                              </div>
                              <GaugeBar value={analysis.overallRiskScore || 28} colorClassName="from-emerald-400 to-emerald-500" />
                            </div>

                            <div className="bg-navy-800 border border-slate-700 rounded-lg p-5">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-xs text-slate-300">투구 일관성</span>
                              </div>
                              <div className="text-3xl font-bold mb-2">
                                {consistencyScore}
                                <span className="text-base text-slate-400"> / 100</span>
                              </div>
                              <GaugeBar value={consistencyScore} colorClassName="from-sky-400 to-cyan-500" />
                            </div>

                            <div className="bg-navy-800 border border-slate-700 rounded-lg p-5">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-xs text-slate-300">의학적 위험</span>
                              </div>
                              <div className="text-3xl font-bold mb-2">
                                {medicalRiskScore}
                                <span className="text-base text-slate-400"> / 100</span>
                              </div>
                              <GaugeBar value={medicalRiskScore} colorClassName="from-emerald-400 to-lime-400" />
                            </div>
                          </div>

                          {/* Radar Chart */}
                          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
                            <h3 className="font-semibold mb-4">관절별 위험도 분석</h3>
                            <RadarChart features={DUMMY_FEATURES} />
                          </div>

                          {/* Critical Zone + Recommendations */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-navy-800 border border-slate-700 rounded-lg p-5">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="font-semibold text-sm">Critical Zone</h3>
                              </div>
                              <p className="text-sm text-slate-400">위험 구간이 발견되지 않았습니다.</p>
                            </div>

                            <div className="bg-navy-800 border border-slate-700 rounded-lg p-5">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <h3 className="font-semibold text-sm">권장 사항</h3>
                              </div>
                              <ul className="space-y-1 text-sm text-slate-400">
                                <li>• 현재 폼 상태 유지</li>
                                <li>• 정기적인 스트레칭 권장</li>
                                <li>• 투구 전 충분한 워밍업</li>
                              </ul>
                            </div>
                          </div>

                          {/* Detailed Metrics */}
                          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
                            <h3 className="font-semibold mb-4">세부 지표</h3>
                            <div className="grid grid-cols-3 gap-6">
                              {[
                                { name: '어깨 스트레스', value: 25 },
                                { name: '팔꿈치 부담', value: 30 },
                                { name: '손목 부하', value: 20 },
                                { name: '척추 각도', value: 35 },
                                { name: '무릎 안정성', value: 28 },
                                { name: '고관절 회전', value: 32 },
                              ].map((metric) => (
                                <div key={metric.name}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-300">{metric.name}</span>
                                    <span className="text-xl font-bold">{metric.value}</span>
                                  </div>
                                  <div className="relative">
                                    <div className="mb-1">
                                      <GaugeBar value={metric.value} colorClassName="from-sky-400 to-cyan-500" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500">
                                      <span>0</span>
                                      <span>25</span>
                                      <span>50</span>
                                      <span>75</span>
                                      <span>100</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {!useDummy && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-400 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>
                <span className="text-sm text-slate-400">
                  페이지 {page + 1}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNextPage}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-400 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
