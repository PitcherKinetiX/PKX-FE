import RadarChart from './RadarChart';
import VelocityChart from './VelocityChart';
import StatusBadge from '../ui/StatusBadge';
import GaugeBar from '../ui/GaugeBar';
import type { AnalysisResult } from '../../types/analysis.types';

function ScoreCard({
  icon,
  label,
  value,
  unit = '/ 100',
  colorClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  colorClassName: string;
}) {
  return (
    <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <div className="text-4xl font-bold mb-3">
        {value}
        <span className="text-lg text-slate-400"> {unit}</span>
      </div>
      <GaugeBar value={value} colorClassName={colorClassName} />
    </div>
  );
}

function gradeToStatus(riskGrade: string): 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER' {
  const g = riskGrade.toUpperCase();
  if (g === 'GOOD') return 'GOOD';
  if (g === 'NORMAL') return 'NORMAL';
  if (g === 'CAUTION') return 'CAUTION';
  if (g === 'DANGER') return 'DANGER';
  return 'NORMAL';
}

/**
 * 분석 리포트 본문 — 대시보드와 히스토리 상세보기에서 공용으로 사용.
 */
export default function AnalysisReport({ result }: { result: AnalysisResult }) {
  const features = result.features ?? [];
  const velocityFeatures = features.filter((f) => f.type === 'velocity');
  const criticalFeatures = features.filter((f) => f.level === '위험' || f.level === '주의');
  const riskGrade = result.riskGrade ? gradeToStatus(result.riskGrade) : 'NORMAL';

  const overallScore = result.overallRiskScore ?? 0;
  const consistencyScore = result.consistencyScore ?? 0;
  const medicalScore = result.medicalRiskScore ?? 0;
  const modelAccuracy = result.modelAccuracy != null ? Math.round(Number(result.modelAccuracy)) : 0;

  return (
    <>
      {/* ── 위험도 등급 요약 ── */}
      <div className="bg-navy-800 border border-slate-700 rounded-lg px-6 py-5 mb-6 flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-semibold">위험도 등급</h2>
            <StatusBadge status={riskGrade} />
            {result.criticalZoneDetected && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-medium">
                위험 구간 감지됨
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            {result.riskSummary || '분석 결과 요약이 없습니다.'}
          </p>
          {result.criticalZoneDescription && (
            <p className="text-xs text-red-400/80 mt-2 leading-relaxed">
              {result.criticalZoneDescription}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-500 mb-1">모델</div>
          <div className="text-xs text-slate-300 font-medium">{result.modelType}</div>
        </div>
      </div>

      {/* ── 4개 핵심 점수 ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <ScoreCard
          label="최종 점수"
          value={overallScore}
          colorClassName="from-emerald-400 to-emerald-500"
          icon={
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <ScoreCard
          label="투구 일관성"
          value={consistencyScore}
          colorClassName="from-sky-400 to-cyan-500"
          icon={
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <ScoreCard
          label="의학적 안전"
          value={medicalScore}
          colorClassName="from-purple-400 to-violet-500"
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <ScoreCard
          label="분석 신뢰도"
          value={modelAccuracy}
          colorClassName="from-amber-400 to-orange-400"
          icon={
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          }
        />
      </div>

      {/* ── 속도 분석 (바 차트) ── */}
      {velocityFeatures.some((f) => f.peakValue != null) && (
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-1">속도 분석 (5개 부위)</h3>
          <p className="text-xs text-slate-500 mb-5">
            X축: 위험 임계값 대비 비율 (1.0 = 위험 임계값, 값이 클수록 부상 위험 증가)
          </p>
          <VelocityChart velocityFeatures={velocityFeatures} />
        </div>
      )}

      {/* ── 레이더 차트 ── */}
      <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-1">13개 생체역학 특징 분석</h3>
        <p className="text-xs text-slate-500 mb-4">관절 각도 8개 + 각속도 5개 · 높을수록 안전</p>
        <RadarChart features={features} />
      </div>

      {/* ── 주의 항목 + 권장 사항 ── */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-semibold">주의 필요 항목</h3>
            {criticalFeatures.length > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{criticalFeatures.length}개</span>
            )}
          </div>
          {criticalFeatures.length > 0 ? (
            <ul className="space-y-2">
              {criticalFeatures.map((f) => (
                <li key={f.index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{f.name}</span>
                  <span className={f.level === '위험' ? 'text-red-400 font-medium' : 'text-amber-400 font-medium'}>
                    {f.level} (일반 대비 {f.generalError > 0 ? Math.round((f.userError / f.generalError) * 100) : 0}%)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">위험 구간이 발견되지 않았습니다.</p>
          )}
        </div>

        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="font-semibold">권장 사항</h3>
          </div>
          {result.recommendations && result.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-cyan-500 mt-0.5 shrink-0">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• 현재 폼 상태 유지</li>
              <li>• 정기적인 스트레칭 권장</li>
              <li>• 투구 전 충분한 워밍업</li>
            </ul>
          )}
        </div>
      </div>

      {/* ── 세부 지표 테이블 ── */}
      <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
        <h3 className="font-semibold mb-1">세부 지표 전체 (13개)</h3>
        <p className="text-xs text-slate-500 mb-4">
          일반 대비: 일반 모델 오차 대비 내 모델 오차 비율 · 100% 미만일수록 내 투구 패턴을 잘 반영
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="text-left py-2 px-3">#</th>
                <th className="text-left py-2 px-3">특징</th>
                <th className="text-left py-2 px-3">유형</th>
                <th className="text-right py-2 px-3">일반 대비</th>
                <th className="text-right py-2 px-3">피크 속도</th>
                <th className="text-right py-2 px-3">위험 비율</th>
                <th className="text-center py-2 px-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.index} className="border-b border-slate-700/50 hover:bg-navy-900/30">
                  <td className="py-2 px-3 text-slate-500">{f.index}</td>
                  <td className="py-2 px-3 text-slate-200">{f.name}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      f.type === 'angle'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {f.type === 'angle' ? '각도' : '속도'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {(() => {
                      const rel = f.generalError > 0 ? (f.userError / f.generalError) * 100 : 0;
                      const cls =
                        rel >= 135 ? 'text-red-400' :
                        rel >= 110 ? 'text-amber-400' :
                        rel >= 95 ? 'text-cyan-400' :
                        'text-emerald-400';
                      return <span className={cls}>{Math.round(rel)}%</span>;
                    })()}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400">
                    {f.peakValue != null ? `${f.peakValue.toFixed(1)} deg/s` : '—'}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {f.dangerRatio != null ? (
                      <span className={
                        f.dangerRatio >= 1 ? 'text-red-400 font-medium' :
                        f.dangerRatio >= 0.7 ? 'text-amber-400' :
                        'text-emerald-400'
                      }>
                        {f.dangerRatio.toFixed(2)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      f.level === '정상' ? 'bg-emerald-500/10 text-emerald-400' :
                      f.level === '양호' ? 'bg-cyan-500/10 text-cyan-400' :
                      f.level === '주의' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {f.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
