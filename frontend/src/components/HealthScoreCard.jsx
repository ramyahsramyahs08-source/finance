import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HealthScoreCard = ({ healthScoreDetail }) => {
  const navigate = useNavigate();

  const score = healthScoreDetail?.score || 89;
  const status = score >= 80 ? 'Excellent' : score >= 60 ? 'Healthy' : 'Needs Attention';

  return (
    <div 
      onClick={() => navigate('/advisor')}
      className="bg-[#13161C] border border-white/[0.06] p-5 sm:p-6 rounded-3xl flex items-center justify-between cursor-pointer hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-center space-x-4">
        {/* Pulse / Activity Icon in Circular Container */}
        <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 flex-shrink-0">
          <Activity className="w-5 h-5 text-slate-300 stroke-[2]" />
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Financial Health Score
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Holistic multi-factor financial fitness assessment
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-4 py-1.5 rounded-full bg-[#0E2E1B] border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold tracking-wide">
        {status}
      </div>
    </div>
  );
};
