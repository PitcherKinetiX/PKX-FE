import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import RadarChart from '../components/dashboard/RadarChart';
import StatusBadge from '../components/ui/StatusBadge';
import GaugeBar from '../components/ui/GaugeBar';
import { useAnalysisList } from '../hooks/useAnalysis';
import type { AnalysisListItem } from '../types/analysis.types';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data, isLoading, error } = useAnalysisList(0, 1);
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisListItem | null>(null);

  useEffect(() => {
    if (data?.content && data.content.length > 0) {
      setLatestAnalysis(data.content[0]);
    }
  }, [data]);

  const mockJointMetrics = {
    shoulderStress: 25,
    elbowLoad: 30,
    wristLoad: 20,
    spineAngle: 35,
    kneeStability: 28,
    hipRotation: 32,
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            대시보드 데이터를 불러오는데 실패했습니다
          </div>
        </div>
      </div>
    );
  }

  const dummyOverall = 28;
  const dummyConsistency = 87;
  const dummyMedical = 22;

  const displayFilename = latestAnalysis?.videoFilename ?? 'fastball_session_01.mp4';
  const displayCreatedAt =
    latestAnalysis?.createdAt
      ? format(new Date(latestAnalysis.createdAt), 'yyyy년 M월 d일 오전 h:mm')
      : '2025년 12월 19일 오전 10:30';

  const displayOverall = latestAnalysis?.overallRiskScore ?? dummyOverall;

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
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
            <button className="px-4 py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              PDF 다운받기
            </button>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg px-6 py-7 mb-6 flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="font-semibold mb-2">위험도 등급</h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              전반적으로 안정한 투구 폼을 보이고 있습니다. 어깨와 팔꿈치의 각도가 이상적이며, 하체의 안정성도 우수합니다.
              현재 상태를 유지하면서 꾸준한 컨디셔닝을 권장합니다.
            </p>
          </div>
          <StatusBadge status="GOOD" />
        </div>

        {/* Three Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm text-slate-300">전체 위험도</span>
            </div>
            <div className="text-4xl font-bold mb-3">
              {displayOverall}
              <span className="text-lg text-slate-400"> / 100</span>
            </div>
            <GaugeBar value={displayOverall} colorClassName="from-emerald-400 to-emerald-500" />
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm text-slate-300">투구 일관성</span>
            </div>
            <div className="text-4xl font-bold mb-3">
              {dummyConsistency}
              <span className="text-lg text-slate-400"> / 100</span>
            </div>
            <GaugeBar value={dummyConsistency} colorClassName="from-sky-400 to-cyan-500" />
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-slate-300">의학적 위험</span>
            </div>
            <div className="text-4xl font-bold mb-3">
              {dummyMedical}
              <span className="text-lg text-slate-400"> / 100</span>
            </div>
            <GaugeBar value={dummyMedical} colorClassName="from-emerald-400 to-lime-400" />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">관절별 위험도 분석</h3>
          <RadarChart jointMetrics={mockJointMetrics} />
        </div>

        {/* Critical Zone + Recommendations */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="font-semibold">Critical Zone</h3>
            </div>
            <p className="text-sm text-slate-400">위험 구간이 발견되지 않았습니다.</p>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="font-semibold">권장 사항</h3>
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
              { name: '어깨 스트레스', value: 25, color: 'bg-status-good' },
              { name: '팔꿈치 부담', value: 30, color: 'bg-cyan-500' },
              { name: '손목 부하', value: 20, color: 'bg-status-good' },
              { name: '척추 각도', value: 35, color: 'bg-cyan-500' },
              { name: '무릎 안정성', value: 28, color: 'bg-status-good' },
              { name: '고관절 회전', value: 32, color: 'bg-cyan-500' },
            ].map((metric) => (
              <div key={metric.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{metric.name}</span>
                  <span className="text-2xl font-bold">{metric.value}</span>
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
      </main>
    </div>
  );
}
