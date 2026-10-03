import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  trendLabel = 'vs last cycle',
  accentColor = 'emerald',
  badge,
  onClick
}) => {
  const colorConfig = {
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      glow: 'hover:shadow-glow-lime'
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
      badgeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      glow: 'hover:shadow-glow-danger'
    },
    indigo: {
      border: 'hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
      badgeBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      glow: 'hover:shadow-glow'
    },
    purple: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
      badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      glow: 'hover:shadow-glow-purple'
    },
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
      badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      glow: 'hover:shadow-glow'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      glow: 'hover:shadow-glow'
    }
  };

  const current = colorConfig[accentColor] || colorConfig.emerald;

  return (
    <div 
      onClick={onClick}
      className={`glass-panel p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${current.border} ${current.glow}`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 sm:p-2.5 rounded-xl border ${current.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mb-1.5 sm:mb-2">
        <div className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] sm:text-xs mt-1">
        {subtitle && (
          <span className="text-slate-400 font-medium truncate max-w-[140px]">{subtitle}</span>
        )}

        {trend && (
          <div className="flex items-center space-x-1 ml-auto">
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span className={`font-bold ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {trendValue}
            </span>
          </div>
        )}

        {badge && (
          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] sm:text-[11px] border ml-auto ${current.badgeBg}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
