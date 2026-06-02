import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { FeatureDetail } from '../../types/analysis.types';

const VELOCITY_LABELS: Record<string, string> = {
  knee_ext_vel: '무릎 신전속도',
  pelvis_rot_vel: '골반 회전속도',
  trunk_rot_vel: '몸통 회전속도',
  elbow_ext_vel: '팔꿈치 신전속도',
  shoulder_ir_vel: '어깨 내회전속도',
};

function getBarColor(medicalScore: number): string {
  if (medicalScore >= 100) return '#10B981';
  if (medicalScore >= 60) return '#F59E0B';
  return '#EF4444';
}

function getMedicalLabel(medicalScore: number): { text: string; cls: string } {
  if (medicalScore >= 100) return { text: '안전', cls: 'text-emerald-400 bg-emerald-500/10' };
  if (medicalScore >= 60) return { text: '주의', cls: 'text-amber-400 bg-amber-500/10' };
  return { text: '위험', cls: 'text-red-400 bg-red-500/10' };
}

interface Props {
  velocityFeatures: FeatureDetail[];
}

interface ChartEntry {
  name: string;
  rawName: string;
  dangerRatio: number;
  peakValue: number;
  medicalScore: number;
}

export default function VelocityChart({ velocityFeatures }: Props) {
  const data: ChartEntry[] = velocityFeatures
    .filter(f => f.peakValue != null && f.dangerRatio != null && f.medicalScore != null)
    .map(f => ({
      name: VELOCITY_LABELS[f.name] ?? f.name,
      rawName: f.name,
      dangerRatio: Math.round(f.dangerRatio! * 100) / 100,
      peakValue: Math.round(f.peakValue! * 10) / 10,
      medicalScore: f.medicalScore!,
    }));

  if (data.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-4 text-center">속도 분석 데이터가 없습니다.</p>
    );
  }

  const maxRatio = Math.max(...data.map(d => d.dangerRatio), 1.5);
  const xMax = Math.ceil(maxRatio * 10) / 10 + 0.1;

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, xMax]}
            tick={{ fill: '#6B7280', fontSize: 11 }}
            stroke="#374151"
            tickFormatter={v => v.toFixed(1)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#D1D5DB', fontSize: 12 }}
            stroke="none"
            width={112}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as ChartEntry;
              const label = getMedicalLabel(d.medicalScore);
              return (
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs space-y-1">
                  <p className="text-slate-300 font-medium">{d.name}</p>
                  <p className="text-slate-400">피크 속도: <span className="text-white">{d.peakValue} deg/s</span></p>
                  <p className="text-slate-400">위험 비율: <span className="text-white">{d.dangerRatio}</span></p>
                  <p className="text-slate-400">의료 점수: <span className={label.cls.split(' ')[0]}>{d.medicalScore}점 ({label.text})</span></p>
                </div>
              );
            }}
          />
          <ReferenceLine
            x={1}
            stroke="#EF4444"
            strokeDasharray="5 3"
            strokeOpacity={0.8}
            label={{ value: '위험선', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }}
          />
          <Bar dataKey="dangerRatio" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.medicalScore)} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 상세 카드 */}
      <div className="grid grid-cols-5 gap-3 mt-5">
        {data.map(d => {
          const label = getMedicalLabel(d.medicalScore);
          return (
            <div key={d.rawName} className="bg-navy-900/60 border border-slate-700/60 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-400 mb-2 leading-snug">{d.name}</p>
              <p className="text-lg font-bold text-white mb-0.5">{d.peakValue}</p>
              <p className="text-xs text-slate-500 mb-2">deg/s</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${label.cls}`}>
                {label.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-5 mt-4 text-xs text-slate-500 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500" />
          안전 (100점)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-amber-500" />
          주의 (60점)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-500" />
          위험 (20점)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block border-l-2 border-red-500 border-dashed h-4 opacity-70" />
          위험 임계값
        </div>
      </div>
    </div>
  );
}
