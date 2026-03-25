import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { FeatureDetail } from '../../types/analysis.types';

// 13개 특징 한글 이름 매핑
const FEATURE_LABELS: Record<string, string> = {
  L_elbow_angle: '왼팔꿈치',
  R_elbow_angle: '오른팔꿈치',
  L_shoulder_angle: '왼어깨',
  R_shoulder_angle: '오른어깨',
  L_hip_angle: '왼고관절',
  R_hip_angle: '오른고관절',
  L_knee_angle: '왼무릎',
  R_knee_angle: '오른무릎',
  knee_ext_vel: '무릎신전속도',
  pelvis_rot_vel: '골반회전속도',
  trunk_rot_vel: '몸통회전속도',
  elbow_ext_vel: '팔꿈치신전속도',
  shoulder_ir_vel: '어깨내회전속도',
};

// level을 점수로 변환 (레이더 차트용 - 높을수록 안전)
function levelToScore(level: string): number {
  switch (level) {
    case '정상': return 95;
    case '양호': return 75;
    case '주의': return 45;
    case '위험': return 15;
    default: return 50;
  }
}

// level별 색상
function levelToColor(level: string): string {
  switch (level) {
    case '정상': return 'text-emerald-400';
    case '양호': return 'text-cyan-400';
    case '주의': return 'text-amber-400';
    case '위험': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

interface RadarChartProps {
  features: FeatureDetail[];
}

export default function RadarChart({ features }: RadarChartProps) {
  const data = features.map((f) => ({
    metric: FEATURE_LABELS[f.name] || f.name,
    value: levelToScore(f.level),
    level: f.level,
    userError: (f.userError * 100).toFixed(1),
    fullMark: 100,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={420}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} stroke="#374151" />
          <Radar
            name="안전도"
            dataKey="value"
            stroke="#06B6D4"
            fill="#06B6D4"
            fillOpacity={0.3}
          />
          <Tooltip
            formatter={(_value, _name, props) => {
              const { level, userError } = props.payload;
              return [`${level} (오차: ${userError}%)`, '상태'];
            }}
            contentStyle={{
              backgroundColor: '#020617',
              border: '1px solid #1f2937',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              color: '#e5e7eb',
            }}
            itemStyle={{ color: '#e5e7eb' }}
            labelStyle={{ color: '#9ca3af', fontSize: '0.7rem' }}
          />
        </RechartsRadar>
      </ResponsiveContainer>

      {/* 13개 특징 상세 그리드 */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">관절 각도 (8개)</h4>
        <div className="grid grid-cols-4 gap-3 text-sm mb-4">
          {features.filter(f => f.type === 'angle').map((f) => (
            <div key={f.index} className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
              <span className="text-gray-400">{FEATURE_LABELS[f.name] || f.name}</span>
              <span className={`font-medium ${levelToColor(f.level)}`}>{f.level}</span>
            </div>
          ))}
        </div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">각속도 (5개)</h4>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {features.filter(f => f.type === 'velocity').map((f) => (
            <div key={f.index} className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
              <span className="text-gray-400">{FEATURE_LABELS[f.name] || f.name}</span>
              <span className={`font-medium ${levelToColor(f.level)}`}>{f.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
