import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceDot
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatINR } from '../utils/currency';

export const AnalyticsCard = ({ data = [] }) => {
  const [activeTab, setActiveTab] = useState('savings'); // 'savings' or 'spendings'
  const [period, setPeriod] = useState('6_months');

  // Fallback demo sequence if monthly trend is empty
  const defaultMonths = [
    { short_month: 'JAN', savings: 5500, expense: 8200 },
    { short_month: 'FEB', savings: 14200, expense: 9100 },
    { short_month: 'MAR', savings: 11300, expense: 12000 },
    { short_month: 'APR', savings: 19747, expense: 7400 },
    { short_month: 'MAY', savings: 10800, expense: 11500 },
    { short_month: 'JUN', savings: 15200, expense: 9800 },
  ];

  const chartData = data && data.length > 0 ? data.slice(-6).map((d, i) => ({
    short_month: d.short_month ? d.short_month.toUpperCase() : defaultMonths[i % 6].short_month,
    savings: Number(d.savings) || 0,
    expense: Number(d.expense) || 0
  })) : defaultMonths;

  // Find max point to highlight with pill badge
  const activeKey = activeTab === 'savings' ? 'savings' : 'expense';
  const peakItem = chartData.reduce((max, item) => (item[activeKey] > (max[activeKey] || 0) ? item : max), chartData[0] || {});

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#13161C] border border-white/[0.1] px-3 py-1.5 rounded-xl shadow-xl text-xs">
          <span className="text-slate-400 mr-2">{label}:</span>
          <span className="text-[#A3FF12] font-bold">{formatINR(payload[0].value)}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#13161C] border border-white/[0.06] p-6 sm:p-7 rounded-3xl h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Analytics</h3>
          {/* Tabs */}
          <div className="flex items-center space-x-5 mt-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('savings')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'savings' ? 'text-[#A3FF12]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Savings
              {activeTab === 'savings' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A3FF12] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('spendings')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'spendings' ? 'text-[#A3FF12]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Spendings
              {activeTab === 'spendings' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A3FF12] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Period dropdown */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 text-xs font-medium rounded-xl pl-3.5 pr-8 py-2 focus:outline-none cursor-pointer"
          >
            <option value="6_months" className="bg-[#13161C]">Last 6 months</option>
            <option value="3_months" className="bg-[#13161C]">Last 3 months</option>
            <option value="this_year" className="bg-[#13161C]">This year</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Recharts Curved Line Chart */}
      <div className="w-full h-56 relative pt-2">
        
        {/* Peak highlight pill label */}
        {peakItem && peakItem.short_month && (
          <div className="absolute top-1 right-28 bg-[#A3FF12]/20 border border-[#A3FF12]/40 text-[#A3FF12] px-2.5 py-0.5 rounded-full text-[11px] font-bold z-10 hidden sm:block">
            {formatINR(peakItem[activeKey])}
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1F2B" vertical={false} />
            <XAxis 
              dataKey="short_month" 
              stroke="#525866" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#525866" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => v === 0 ? '0' : `${Math.round(v / 1000)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="natural" 
              dataKey={activeKey} 
              stroke="#A3FF12" 
              strokeWidth={2.5} 
              dot={{ r: 3, fill: '#A3FF12', stroke: '#0B0D11', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#A3FF12', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
