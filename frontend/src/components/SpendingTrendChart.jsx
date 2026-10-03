import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { formatINR } from '../utils/currency';

export const SpendingTrendChart = ({ data = [], height = 280 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] text-slate-500 text-sm">
        No trend data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1">
          <div className="font-bold text-slate-200">{label}</div>
          <div className="text-indigo-400 font-semibold">
            Expenses: {formatINR(payload[0].value)}
          </div>
          {payload[1] && (
            <div className="text-emerald-400 font-semibold">
              Savings: {formatINR(payload[1].value)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis 
            dataKey="short_month" 
            stroke="#64748B" 
            fontSize={12} 
            tickLine={false} 
            axisLine={{ stroke: '#334155' }} 
          />
          <YAxis 
            stroke="#64748B" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="expense" 
            stroke="#6366F1" 
            strokeWidth={2.5} 
            fillOpacity={1} 
            fill="url(#expenseGrad)" 
            name="Expenses"
          />
          <Area 
            type="monotone" 
            dataKey="savings" 
            stroke="#10B981" 
            strokeWidth={2} 
            strokeDasharray="4 4"
            fillOpacity={1} 
            fill="url(#savingsGrad)" 
            name="Savings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
