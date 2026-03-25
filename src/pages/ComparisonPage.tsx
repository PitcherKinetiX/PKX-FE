import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import StatusBadge from '../components/ui/StatusBadge';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { useComparison } from '../hooks/useComparison';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const baselineId = searchParams.get('prev');
  const currentId = searchParams.get('recent');

  // Fetch comparison data from API
  const { data: comparison, isLoading, error } = useComparison(
    baselineId ? Number(baselineId) : null,
    currentId ? Number(currentId) : null
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 text-slate-100">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-slate-400">비교 데이터를 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !comparison) {
    return (
      <div className="min-h-screen bg-navy-900 text-slate-100">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-400 mb-4">비교 데이터를 불러오는데 실패했습니다.</p>
              <button
                onClick={() => navigate('/history')}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Prepare data for UI
  const { baseline, current, improvementSummary, coreMetrics, jointMetrics } = comparison;

  // Prepare radar chart data
  const radarData = Object.entries(jointMetrics).map(([_key, metric]) => ({
    joint: metric.jointName,
    이전분석: metric.baselineValue,
    최근분석: metric.currentValue,
    fullMark: 100,
  }));

  // Prepare detailed metrics
  const detailedMetrics = Object.values(jointMetrics).map((metric) => ({
    name: metric.jointName,
    prev: metric.baselineValue,
    recent: metric.currentValue,
    improvement: Math.abs(metric.change),
    status: metric.status,
  }));

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로 돌아가기
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">리포트 비교 분석</h1>
          <p className="text-slate-400 text-sm">두 리포트를 비교하여 부상 위험 감소도를 확인하세요</p>
        </div>

        {/* Two Analysis Cards */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between gap-8 max-w-4xl mx-auto">
            <div className="flex-1 text-center">
              <h3 className="text-sm text-slate-400 mb-3">이전 분석</h3>
              <p className="font-semibold text-lg mb-2">{new Date(baseline.analysisDate).toLocaleDateString('ko-KR')}</p>
              <p className="text-sm text-slate-400 mb-4">{baseline.filename}</p>
              <div className="flex justify-center">
                <StatusBadge status={baseline.riskGrade} />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

            <div className="flex-1 text-center">
              <h3 className="text-sm text-slate-400 mb-3">최근 분석</h3>
              <p className="font-semibold text-lg mb-2">{new Date(current.analysisDate).toLocaleDateString('ko-KR')}</p>
              <p className="text-sm text-slate-400 mb-4">{current.filename}</p>
              <div className="flex justify-center">
                <StatusBadge status={current.riskGrade} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Comparison Card */}
        <div className={`bg-gradient-to-br ${
          improvementSummary.status === 'IMPROVED'
            ? 'from-cyan-900/20 to-cyan-800/10 border-cyan-700/50'
            : improvementSummary.status === 'DECLINED'
            ? 'from-red-900/20 to-red-800/10 border-red-700/50'
            : 'from-slate-800/20 to-slate-700/10 border-slate-700/50'
        } border rounded-lg p-8 mb-8`}>
          <h2 className="text-xl font-bold text-center mb-8">부상 위험 완화도</h2>
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">이전</p>
              <p className="text-6xl font-bold">{baseline.overallRiskScore}</p>
            </div>

            <div className="text-center px-8">
              <svg
                className={`w-16 h-16 mx-auto mb-2 ${
                  improvementSummary.status === 'IMPROVED' ? 'text-emerald-400' :
                  improvementSummary.status === 'DECLINED' ? 'text-red-400' :
                  'text-slate-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {improvementSummary.status === 'IMPROVED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                ) : improvementSummary.status === 'DECLINED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                )}
              </svg>
              <p className={`text-4xl font-bold mb-1 ${
                improvementSummary.status === 'IMPROVED' ? 'text-emerald-400' :
                improvementSummary.status === 'DECLINED' ? 'text-red-400' :
                'text-slate-400'
              }`}>
                {improvementSummary.improvementPercentage > 0 ? '+' : ''}{improvementSummary.improvementPercentage.toFixed(1)}%
              </p>
              <p className={`font-semibold ${
                improvementSummary.status === 'IMPROVED' ? 'text-emerald-400' :
                improvementSummary.status === 'DECLINED' ? 'text-red-400' :
                'text-slate-400'
              }`}>
                {improvementSummary.message}
              </p>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">최근</p>
              <p className="text-6xl font-bold">{current.overallRiskScore}</p>
            </div>
          </div>
        </div>

        {/* Three Metrics Comparison */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm text-slate-400 mb-4">전체 위험도</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{coreMetrics.overallRiskScore.baselineValue.toFixed(1)}</span>
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-3xl font-bold">{coreMetrics.overallRiskScore.currentValue.toFixed(1)}</span>
            </div>
            <p className={`text-sm mt-3 flex items-center gap-1 ${
              coreMetrics.overallRiskScore.changeDirection === 'IMPROVED' ? 'text-emerald-400' :
              coreMetrics.overallRiskScore.changeDirection === 'DECLINED' ? 'text-red-400' :
              'text-slate-400'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {coreMetrics.overallRiskScore.changeDirection === 'IMPROVED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : coreMetrics.overallRiskScore.changeDirection === 'DECLINED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                )}
              </svg>
              {Math.abs(coreMetrics.overallRiskScore.change).toFixed(1)} {coreMetrics.overallRiskScore.changeDirection === 'IMPROVED' ? '개선' : coreMetrics.overallRiskScore.changeDirection === 'DECLINED' ? '악화' : '변화없음'}
            </p>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm text-slate-400 mb-4">투구 일관성</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{coreMetrics.consistencyScore.baselineValue.toFixed(1)}</span>
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-3xl font-bold">{coreMetrics.consistencyScore.currentValue.toFixed(1)}</span>
            </div>
            <p className={`text-sm mt-3 flex items-center gap-1 ${
              coreMetrics.consistencyScore.changeDirection === 'IMPROVED' ? 'text-emerald-400' :
              coreMetrics.consistencyScore.changeDirection === 'DECLINED' ? 'text-red-400' :
              'text-slate-400'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {coreMetrics.consistencyScore.changeDirection === 'IMPROVED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : coreMetrics.consistencyScore.changeDirection === 'DECLINED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                )}
              </svg>
              {Math.abs(coreMetrics.consistencyScore.change).toFixed(1)} {coreMetrics.consistencyScore.changeDirection === 'IMPROVED' ? '개선' : coreMetrics.consistencyScore.changeDirection === 'DECLINED' ? '악화' : '변화없음'}
            </p>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm text-slate-400 mb-4">의학적 위험</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{coreMetrics.medicalRiskScore.baselineValue.toFixed(1)}</span>
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-3xl font-bold">{coreMetrics.medicalRiskScore.currentValue.toFixed(1)}</span>
            </div>
            <p className={`text-sm mt-3 flex items-center gap-1 ${
              coreMetrics.medicalRiskScore.changeDirection === 'IMPROVED' ? 'text-emerald-400' :
              coreMetrics.medicalRiskScore.changeDirection === 'DECLINED' ? 'text-red-400' :
              'text-slate-400'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {coreMetrics.medicalRiskScore.changeDirection === 'IMPROVED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : coreMetrics.medicalRiskScore.changeDirection === 'DECLINED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                )}
              </svg>
              {Math.abs(coreMetrics.medicalRiskScore.change).toFixed(1)} {coreMetrics.medicalRiskScore.changeDirection === 'IMPROVED' ? '개선' : coreMetrics.medicalRiskScore.changeDirection === 'DECLINED' ? '악화' : '변화없음'}
            </p>
          </div>
        </div>

        {/* Radar Chart Comparison */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-6">관절별 상세 비교</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsRadar data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="joint" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="이전 분석" dataKey="이전분석" stroke="#64748b" fill="#64748b" fillOpacity={0.3} />
              <Radar name="최근 분석" dataKey="최근분석" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.5} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RechartsRadar>
          </ResponsiveContainer>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
          <h3 className="font-semibold mb-6">세부 지표 비교</h3>
          <div className="space-y-4">
            {detailedMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                <span className="text-slate-300 min-w-[120px]">{metric.name}</span>
                <div className="flex items-center gap-6 flex-1 justify-end">
                  <span className="text-xl font-bold w-12 text-right">{metric.prev.toFixed(1)}</span>
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-xl font-bold w-12 text-left">{metric.recent.toFixed(1)}</span>
                  <span className={`text-sm font-semibold min-w-[80px] text-right flex items-center gap-1 justify-end ${
                    metric.status === 'IMPROVED' ? 'text-emerald-400' :
                    metric.status === 'DECLINED' ? 'text-red-400' :
                    'text-slate-400'
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {metric.status === 'IMPROVED' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      ) : metric.status === 'DECLINED' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                      )}
                    </svg>
                    {metric.improvement.toFixed(1)} {metric.status === 'IMPROVED' ? '개선' : metric.status === 'DECLINED' ? '악화' : '변화없음'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

