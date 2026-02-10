import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { JointMetrics } from '../../types/analysis.types';

interface RadarChartProps {
  jointMetrics: JointMetrics;
}

export default function RadarChart({ jointMetrics }: RadarChartProps) {
  const data = [
    {
      metric: '어깨',
      value: jointMetrics.shoulderStress,
      fullMark: 100,
    },
    {
      metric: '팔꿈치',
      value: jointMetrics.elbowLoad,
      fullMark: 100,
    },
    {
      metric: '손목',
      value: jointMetrics.wristLoad,
      fullMark: 100,
    },
    {
      metric: '척추',
      value: jointMetrics.spineAngle,
      fullMark: 100,
    },
    {
      metric: '무릎',
      value: jointMetrics.kneeStability,
      fullMark: 100,
    },
    {
      metric: '골반',
      value: jointMetrics.hipRotation,
      fullMark: 100,
    },
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} stroke="#374151" />
          <Radar
            name="관절 부하"
            dataKey="value"
            stroke="#06B6D4"
            fill="#06B6D4"
            fillOpacity={0.5}
          />
          <Tooltip
            formatter={(value: number) => [`${value} / 100`, '위험도']}
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
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
          <span className="text-gray-400">어깨 스트레스:</span>
          <span className="font-medium text-white">{jointMetrics.shoulderStress}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
          <span className="text-gray-400">팔꿈치 부하:</span>
          <span className="font-medium text-white">{jointMetrics.elbowLoad}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
          <span className="text-gray-400">손목 부하:</span>
          <span className="font-medium text-white">{jointMetrics.wristLoad}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
          <span className="text-gray-400">척추 각도:</span>
          <span className="font-medium text-white">{jointMetrics.spineAngle}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
          <span className="text-gray-400">무릎 안정성:</span>
          <span className="font-medium text-white">{jointMetrics.kneeStability}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-navy-900/50 rounded-lg">
          <span className="text-gray-400">골반 회전:</span>
          <span className="font-medium text-white">{jointMetrics.hipRotation}%</span>
        </div>
      </div>
    </div>
  );
}
