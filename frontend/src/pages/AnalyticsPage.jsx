import React, { useState, useEffect, useCallback } from 'react';
import { 
  PieChart as PieIcon, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CreditCard, 
  Zap, 
  Layers, 
  Filter, 
  DollarSign,
  ArrowDownRight,
  ShieldAlert
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { ExpenseChart } from '../components/ExpenseChart';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';
import { SpendingTrendChart } from '../components/SpendingTrendChart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatINR, formatDate } from '../utils/currency';

const FILTERS = [
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: '3_months', label: 'Last 3 Months' },
  { id: '6_months', label: 'Last 6 Months' },
  { id: 'this_year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
];

export const AnalyticsPage = () => {
  const [filter, setFilter] = useState('6_months');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getAnalytics(
        filter,
        filter === 'custom' ? startDate : null,
        filter === 'custom' ? endDate : null
      );
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const summary = data?.summary || {
    total_income: 0,
    total_expense: 0,
    net_savings: 0,
    savings_rate: 0,
    daily_avg_expense: 0,
    total_transactions: 0,
    essential_amount: 0,
    discretionary_amount: 0,
    essential_ratio: 0,
    discretionary_ratio: 0
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Filter Range Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Advanced Financial Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic aggregations and structural spending patterns across selected date horizons
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {filter === 'custom' && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <Calendar className="w-4 h-4 text-indigo-400" /> Select Custom Date Horizon:
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-lg text-xs"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-lg text-xs"
          />
          <button
            onClick={fetchAnalytics}
            className="px-4 py-1.5 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow text-xs"
          >
            Apply Horizon
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Calculating financial metrics & aggregations..." />
      ) : (
        <>
          {/* Top Summary Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Period Income</span>
              <span className="text-xl font-extrabold text-emerald-400 mt-1 block">{formatINR(summary.total_income)}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">{summary.total_transactions} txns analyzed</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Period Expenses</span>
              <span className="text-xl font-extrabold text-rose-400 mt-1 block">{formatINR(summary.total_expense)}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Burn rate</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Net Period Savings</span>
              <span className="text-xl font-extrabold text-slate-100 mt-1 block">{formatINR(summary.net_savings)}</span>
              <span className="text-[11px] text-indigo-400 font-semibold mt-1 block">{summary.savings_rate}% savings rate</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Daily Average Spend</span>
              <span className="text-xl font-extrabold text-amber-400 mt-1 block">{formatINR(summary.daily_avg_expense)}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Velocity per day</span>
            </div>

          </div>

          {/* Charts Row: Monthly Cash Flow & Trend Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-slate-100 mb-1">Income vs Expense Progression</h3>
              <p className="text-xs text-slate-400 mb-4">Monthly cash inflow compared against expenditures</p>
              <IncomeExpenseChart data={data?.monthly_trend} height={280} />
            </div>

            <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-slate-100 mb-1">Spending & Savings Velocity</h3>
              <p className="text-xs text-slate-400 mb-4">Cumulative monthly trends with surplus accumulation</p>
              <SpendingTrendChart data={data?.monthly_trend} height={280} />
            </div>

          </div>

          {/* Category Breakdown & Lifestyle Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category Donut & Table */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Category Expense Distribution</h3>
                  <p className="text-xs text-slate-400">Share of wallet across spending classifications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5">
                  <ExpenseChart data={data?.category_breakdown} height={220} />
                </div>
                <div className="sm:col-span-7 space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  {data?.category_breakdown?.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-slate-300 font-medium">{c.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-100 font-bold">{formatINR(c.amount)}</span>
                        <span className="text-[11px] text-slate-500 block">{c.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Essential vs Discretionary Allocation Card */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-1">Essential vs Discretionary Ratio</h3>
                <p className="text-xs text-slate-400 mb-4">Needs (Food, Housing, Bills, Health) vs Lifestyle Wants</p>

                {/* Progress Bar */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-indigo-400">Essential: {summary.essential_ratio}%</span>
                    <span className="text-purple-400">Discretionary: {summary.discretionary_ratio}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-500" 
                      style={{ width: `${summary.essential_ratio}%` }} 
                      title="Essential Spending"
                    />
                    <div 
                      className="bg-purple-500 h-full transition-all duration-500" 
                      style={{ width: `${summary.discretionary_ratio}%` }} 
                      title="Discretionary Spending"
                    />
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-[11px] text-indigo-300 block">Essential Spend</span>
                    <span className="text-sm font-bold text-indigo-200">{formatINR(summary.essential_amount)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <span className="text-[11px] text-purple-300 block">Discretionary Spend</span>
                    <span className="text-sm font-bold text-purple-200">{formatINR(summary.discretionary_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Payment Instrument Share</span>
                <div className="flex flex-wrap gap-2">
                  {data?.payment_breakdown?.map((pm, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300">
                      {pm.method}: <strong className="text-slate-100">{formatINR(pm.amount)}</strong>
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Top Outflow Transactions */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-slate-100 mb-1">Top Single Expense Outflows</h3>
            <p className="text-xs text-slate-400 mb-4">Highest individual debit transactions recorded during this timeframe</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {data?.top_expenses?.map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">#{idx + 1}</span>
                    <span className="text-slate-400 text-[11px]">{formatDate(t.date, 'short')}</span>
                  </div>
                  <div className="font-semibold text-slate-200 text-xs truncate" title={t.description}>
                    {t.description}
                  </div>
                  <div className="text-sm font-extrabold text-rose-400">
                    -{formatINR(t.amount)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {t.category} ({t.payment_method})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
