interface GaugeBarProps {
  /** 0–100 값 */
  value: number;
  /** 게이지 색상 (Tailwind 클래스) */
  colorClassName?: string;
}

export default function GaugeBar({ value, colorClassName }: GaugeBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const colorClasses = colorClassName ?? 'from-emerald-400 to-emerald-500';

  return (
    <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colorClasses} shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

