import React from 'react';
import { Target, Calendar, TrendingUp, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { formatINR, formatDate } from '../utils/currency';

export const GoalCard = ({ goal, onEdit, onDelete }) => {
  if (!goal) return null;

  const {
    name,
    category,
    target_amount,
    current_amount,
    remaining_amount,
    target_date,
    progress_percentage,
    days_remaining,
    months_remaining,
    recommended_monthly_saving,
    status,
    status_color
  } = goal;

  const isCompleted = progress_percentage >= 100;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 group">
      
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            {category}
          </span>
          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Edit Goal"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Goal Name */}
        <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
          {name}
          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        </h3>

        {/* Target Amount vs Current */}
        <div className="flex items-baseline justify-between mt-3 mb-2">
          <div>
            <span className="text-2xl font-extrabold text-slate-100">{formatINR(current_amount)}</span>
            <span className="text-xs text-slate-400 block">saved of {formatINR(target_amount)}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-400">{progress_percentage}%</span>
            <span className="text-[11px] text-slate-500 block">completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden mb-4 border border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCompleted 
                ? 'bg-emerald-500 shadow-glow-success' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-glow'
            }`}
            style={{ width: `${Math.min(progress_percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Target Date & Monthly Savings Recommendation */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3" /> Target Date
          </span>
          <span className="font-semibold text-slate-200 mt-0.5 block">
            {formatDate(target_date)} ({days_remaining}d)
          </span>
        </div>
        <div>
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <TrendingUp className="w-3 h-3" /> Monthly Target
          </span>
          <span className="font-semibold text-emerald-400 mt-0.5 block">
            {isCompleted ? 'Goal Reached!' : `${formatINR(recommended_monthly_saving)} / mo`}
          </span>
        </div>
      </div>

    </div>
  );
};
