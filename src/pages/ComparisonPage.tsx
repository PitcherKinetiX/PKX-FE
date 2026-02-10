import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import StatusBadge from '../components/ui/StatusBadge';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prevId = searchParams.get('prev');
  const recentId = searchParams.get('recent');

  // Mock data - replace with actual API calls
  const prevAnalysis = {
    id: prevId,
    date: '2025년 12월 15일',
    filename: 'curveball_practice.mp4',
    status: 'NORMAL' as const,
    overallRisk: 45,
    consistency: 72,
    medicalRisk: 48,
  };

  const recentAnalysis = {
    id: recentId,
    date: '2025년 12월 19일',
    filename: 'fastball_session_01.mp4',
    status: 'GOOD' as const,
    overallRisk: 28,
    consistency: 87,
    medicalRisk: 22,
  };

  const overallImprovement = prevAnalysis.overallRisk - recentAnalysis.overallRisk;
  const improvementPercent = Math.round((overallImprovement / prevAnalysis.overallRisk) * 100);

  const radarData = [
    { joint: '어깨', 이전분석: 42, 최근분석: 25, fullMark: 100 },
    { joint: '팔꿈치', 이전분석: 55, 최근분석: 30, fullMark: 100 },
    { joint: '손목', 이전분석: 38, 최근분석: 20, fullMark: 100 },
    { joint: '척추', 이전분석: 40, 최근분석: 35, fullMark: 100 },
    { joint: '무릎', 이전분석: 45, 최근분석: 28, fullMark: 100 },
    { joint: '고관절', 이전분석: 50, 최근분석: 32, fullMark: 100 },
  ];

  const detailedMetrics = [
    { name: '어깨 스트레스', prev: 42, recent: 25, improvement: 17 },
    { name: '팔꿈치 부담', prev: 55, recent: 30, improvement: 25 },
    { name: '손목 부하', prev: 38, recent: 20, improvement: 18 },
    { name: '척추 각도', prev: 40, recent: 35, improvement: 5 },
    { name: '무릎 안정성', prev: 45, recent: 28, improvement: 17 },
    { name: '고관절 회전', prev: 50, recent: 32, improvement: 18 },
  ];

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
              <p className="font-semibold text-lg mb-2">{prevAnalysis.date}</p>
              <p className="text-sm text-slate-400 mb-4">{prevAnalysis.filename}</p>
              <div className="flex justify-center">
                <StatusBadge status={prevAnalysis.status} />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

            <div className="flex-1 text-center">
              <h3 className="text-sm text-slate-400 mb-3">최근 분석</h3>
              <p className="font-semibold text-lg mb-2">{recentAnalysis.date}</p>
              <p className="text-sm text-slate-400 mb-4">{recentAnalysis.filename}</p>
              <div className="flex justify-center">
                <StatusBadge status={recentAnalysis.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Comparison Card */}
        <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-700/50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-center mb-8">부상 위험 완화도</h2>
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">이전</p>
              <p className="text-6xl font-bold">{prevAnalysis.overallRisk}</p>
            </div>

            <div className="text-center px-8">
              <svg className="w-16 h-16 text-emerald-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <p className="text-4xl font-bold text-emerald-400 mb-1">-{overallImprovement}</p>
              <p className="text-emerald-400 font-semibold">{improvementPercent}% 개선</p>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">최근</p>
              <p className="text-6xl font-bold">{recentAnalysis.overallRisk}</p>
            </div>
          </div>
        </div>

        {/* Three Metrics Comparison */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm text-slate-400 mb-4">전체 위험도</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{prevAnalysis.overallRisk}</span>
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-3xl font-bold">{recentAnalysis.overallRisk}</span>
            </div>
            <p className="text-emerald-400 text-sm mt-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {prevAnalysis.overallRisk - recentAnalysis.overallRisk} 개선
            </p>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm text-slate-400 mb-4">투구 일관성</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{prevAnalysis.consistency}</span>
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-3xl font-bold">{recentAnalysis.consistency}</span>
            </div>
            <p className="text-emerald-400 text-sm mt-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {recentAnalysis.consistency - prevAnalysis.consistency} 개선
            </p>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm text-slate-400 mb-4">의학적 위험</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{prevAnalysis.medicalRisk}</span>
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-3xl font-bold">{recentAnalysis.medicalRisk}</span>
            </div>
            <p className="text-emerald-400 text-sm mt-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {prevAnalysis.medicalRisk - recentAnalysis.medicalRisk} 개선
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
                  <span className="text-xl font-bold w-12 text-right">{metric.prev}</span>
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-xl font-bold w-12 text-left">{metric.recent}</span>
                  <span className="text-emerald-400 text-sm font-semibold min-w-[80px] text-right flex items-center gap-1 justify-end">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    {metric.improvement} 개선
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

