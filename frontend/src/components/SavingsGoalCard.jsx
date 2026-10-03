import React from 'react';
import { ArrowRight, Car, Target, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/currency';

export const SavingsGoalCard = ({ goals = [] }) => {
  const navigate = useNavigate();

  const activeGoal = goals && goals.length > 0 ? goals[0] : {
    name: 'Buy new car',
    subtitle: 'Tesla model X',
    current_amount: 25500,
    target_amount: 66490,
    progress_percentage: 38
  };

  const current = activeGoal.current_amount || 25500;
  const target = activeGoal.target_amount || 66490;
  const percent = Math.min(100, Math.round((current / target) * 100)) || 38;

  return (
    <div className="bg-[#13161C] border border-white/[0.06] p-6 sm:p-7 rounded-3xl flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white tracking-tight">Savings</h3>

        <button
          onClick={() => navigate('/goals')}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-slate-200 transition-colors shadow-sm"
          title="View Savings Goals"
        >
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Goal Item */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          
          {/* Goal Icon & Titles */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-red-500 shadow-inner">
              <Car className="w-5 h-5 fill-red-500/20" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">
                {activeGoal.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activeGoal.subtitle || activeGoal.category || 'Tesla model X'}
              </p>
            </div>
          </div>

          {/* Target Amount */}
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Target</span>
            <div className="text-xs sm:text-sm font-bold mt-0.5">
              <span className="text-slate-400 font-medium">{formatINR(current)} / </span>
              <span className="text-[#A3FF12] font-extrabold">{formatINR(target)}</span>
            </div>
          </div>

        </div>

        {/* Custom Progress Bar with Milestone Dot */}
        <div className="relative pt-2 pb-1">
          <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A3FF12] rounded-full transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          {/* Indicator Dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FF8A00] border-2 border-[#13161C] shadow-sm -ml-1.5"
            style={{ left: `${Math.min(96, Math.max(4, percent))}%` }}
          />
        </div>

      </div>

    </div>
  );
};
