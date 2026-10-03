import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIInsightsCard = ({ recommendations = [] }) => {
  const navigate = useNavigate();

  const primaryRec = recommendations && recommendations.length > 0 ? recommendations[0] : {
    badge: 'WEALTH ACCELERATOR',
    impact: 'Medium'
  };

  const badgeText = primaryRec.badge ? primaryRec.badge.toUpperCase() : 'WEALTH ACCELERATOR';
  const impactText = primaryRec.impact || 'Medium';

  return (
    <div 
      onClick={() => navigate('/advisor')}
      className="bg-[#13161C] border border-white/[0.06] p-5 sm:p-6 rounded-3xl flex flex-col justify-between cursor-pointer hover:border-white/[0.12] transition-colors"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            AI Wealth Intelligence
          </h3>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/advisor');
          }}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
        >
          <span>View All Insights</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom row with badge & impact */}
      <div className="flex items-center justify-between pl-14 pt-1">
        <span className="px-3.5 py-1 rounded-full bg-[#0E2E1B] border border-[#22C55E]/30 text-[#22C55E] text-[11px] font-bold tracking-wider">
          {badgeText}
        </span>

        <span className="text-xs font-medium text-slate-400">
          Impact: <span className="text-slate-200 font-bold">{impactText}</span>
        </span>
      </div>
    </div>
  );
};
