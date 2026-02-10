interface StatusBadgeProps {
  status: 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER';
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'GOOD':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.45)]';
      case 'NORMAL':
        return 'bg-sky-500/10 text-sky-300 border-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.4)]';
      case 'CAUTION':
        return 'bg-amber-500/15 text-amber-300 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.45)]';
      case 'DANGER':
        return 'bg-rose-500/15 text-rose-300 border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.5)]';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'GOOD':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'NORMAL':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="7" strokeWidth={2} />
          </svg>
        );
      case 'CAUTION':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01" />
          </svg>
        );
      case 'DANGER':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    if (label) return label;
    return status;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}
    >
      {getStatusIcon()}
      <span className="tracking-[0.16em] uppercase">{getStatusLabel()}</span>
    </span>
  );
}
