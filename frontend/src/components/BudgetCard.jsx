import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatINR } from '../utils/currency';

export const BudgetCard = ({ 
  monthlyIncome = 0, 
  monthlyExpense = 0,
  monthlyTrend = []
}) => {
  const [period, setPeriod] = useState('this_month');

  let income = monthlyIncome !== undefined && monthlyIncome !== null ? Number(monthlyIncome) : 0;
  let expense = monthlyExpense !== undefined && monthlyExpense !== null ? Number(monthlyExpense) : 0;

  if (period === 'last_month' && monthlyTrend && monthlyTrend.length > 1) {
    const prev = monthlyTrend[monthlyTrend.length - 2];
    if (prev) {
      income = Number(prev.income) || 0;
      expense = Number(prev.expense) || 0;
    }
  }

  const remaining = Math.max(0, income - expense);

  return (
    <div className="bg-[#13161C] border border-white/[0.06] p-6 sm:p-7 rounded-3xl flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white tracking-tight">Budget</h3>

        {/* Period dropdown */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 text-xs font-medium rounded-xl pl-3 pr-7 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="this_month" className="bg-[#13161C]">This month</option>
            <option value="last_month" className="bg-[#13161C]">Last month</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Mini Circular Gauges for Income & Expense */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        
        {/* Total Income */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#22C55E]/40 flex items-center justify-center flex-shrink-0 bg-[#22C55E]/10">
            <ArrowUpRight className="w-4 h-4 text-[#22C55E] stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Total Income</span>
            <span className="text-xs sm:text-sm font-extrabold text-white block mt-0.5">
              {formatINR(income)}
            </span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#EF4444]/40 flex items-center justify-center flex-shrink-0 bg-[#EF4444]/10">
            <ArrowDownRight className="w-4 h-4 text-[#EF4444] stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Total Expense</span>
            <span className="text-xs sm:text-sm font-extrabold text-white block mt-0.5">
              {formatINR(expense)}
            </span>
          </div>
        </div>

      </div>

      {/* Remaining Budget */}
      <div className="pt-2 border-t border-white/[0.04]">
        <span className="text-[11px] font-medium text-slate-500 block">Remaining budget</span>
        <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5 block">
          {formatINR(remaining)}
        </span>
      </div>

    </div>
  );
};
