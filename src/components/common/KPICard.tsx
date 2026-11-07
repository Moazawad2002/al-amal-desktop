import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'gold' | 'emerald' | 'crimson' | 'slate' | 'amber';
  tooltip?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'gold',
  tooltip,
  trend,
}) => {
  const variantStyles = {
    gold: {
      border: 'border-gold-300/80',
      bg: 'bg-white',
      iconBg: 'bg-gold-100 text-gold-700',
      valueColor: 'text-bronze-900',
    },
    emerald: {
      border: 'border-emerald-200',
      bg: 'bg-white',
      iconBg: 'bg-emerald-100 text-emerald-700',
      valueColor: 'text-emerald-800',
    },
    crimson: {
      border: 'border-red-200',
      bg: 'bg-white',
      iconBg: 'bg-red-100 text-red-700',
      valueColor: 'text-red-800',
    },
    amber: {
      border: 'border-amber-200',
      bg: 'bg-white',
      iconBg: 'bg-amber-100 text-amber-700',
      valueColor: 'text-amber-800',
    },
    slate: {
      border: 'border-bronze-200',
      bg: 'bg-white',
      iconBg: 'bg-cream-200 text-bronze-800',
      valueColor: 'text-bronze-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      title={tooltip}
      className={`rounded-xl border ${style.border} ${style.bg} p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-bronze-600 line-clamp-1">{title}</span>
        <div className={`p-2 rounded-lg ${style.iconBg} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className={`text-xl sm:text-2xl font-black ${style.valueColor} tracking-tight`}>
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-bronze-500">
            {trend && (
              <span className={`font-bold ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {subtitle && <span className="truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
