import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Sparkles,
  Bot
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { formatINR, formatDate } from '../utils/currency';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('monthly'); // 'monthly' or 'yearly'
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(8);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { error, info } = useToast();

  const fetchReport = async () => {
    setLoading(true);
    try {
      let res;
      if (reportType === 'monthly') {
        res = await reportService.getMonthlyReport(year, month);
      } else {
        res = await reportService.getYearlyReport(year);
      }
      if (res.success && res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      error(err.message || 'Failed to generate financial report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, year, month]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 print:p-0 print:space-y-4">
      
      {/* Top Header & Selectors (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Financial Statements & Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export monthly summaries or annual financial dossiers
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Controls (Hidden on Print) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
        
        {/* Toggle Monthly / Yearly */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setReportType('monthly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportType === 'monthly' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Statement
          </button>
          <button
            onClick={() => setReportType('yearly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportType === 'yearly' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yearly Dossier
          </button>
        </div>

        {/* Month & Year Selectors */}
        <div className="flex items-center space-x-3">
          {reportType === 'monthly' && (
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="glass-input px-3 py-1.5 rounded-xl bg-slate-900 text-slate-200"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          )}

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="glass-input px-3 py-1.5 rounded-xl bg-slate-900 text-slate-200"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
        </div>

      </div>

      {loading ? (
        <LoadingSpinner label="Compiling report statement..." />
      ) : reportData ? (
        
        /* Printable Report Document Card */
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 bg-[#0E131F] space-y-8 print:bg-white print:text-black print:p-4 print:border-none print:shadow-none">
          
          {/* Statement Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 print:border-black/20">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-slate-100 tracking-tight print:text-black">
                  SmartFinance <span className="text-indigo-400 print:text-indigo-600">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30 print:border-black/30 print:text-black">
                  OFFICIAL STATEMENT
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-100 mt-2 print:text-black">
                {reportData.report_type} Financial Summary — {reportData.period}
              </h2>
              <p className="text-xs text-slate-400 print:text-black/60 mt-1">
                Account Holder: <strong className="text-slate-200 print:text-black">{reportData.user?.name}</strong> ({reportData.user?.email})
              </p>
            </div>

            <div className="mt-4 sm:mt-0 text-right text-xs text-slate-400 print:text-black/60">
              <div>Generated on: {reportData.generated_at}</div>
              <div>Currency: INR (₹)</div>
            </div>
          </div>

          {/* Key Statement Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 print:border-black/20 print:bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 print:text-black/60 uppercase block">Total Inflow</span>
              <span className="text-xl font-extrabold text-emerald-400 print:text-emerald-700 mt-1 block">
                {formatINR(reportData.summary?.total_income)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 print:border-black/20 print:bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 print:text-black/60 uppercase block">Total Outflow</span>
              <span className="text-xl font-extrabold text-rose-400 print:text-rose-700 mt-1 block">
                {formatINR(reportData.summary?.total_expense)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 print:border-black/20 print:bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 print:text-black/60 uppercase block">Net Savings</span>
              <span className="text-xl font-extrabold text-indigo-400 print:text-indigo-700 mt-1 block">
                {formatINR(reportData.summary?.net_savings)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 print:border-black/20 print:bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 print:text-black/60 uppercase block">Savings Rate</span>
              <span className="text-xl font-extrabold text-slate-100 print:text-black mt-1 block">
                {reportData.summary?.savings_rate}%
              </span>
            </div>
          </div>

          {/* Health Score Rating Banner */}
          {reportData.health_score && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between print:border-black/20">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-indigo-400 print:text-indigo-700" />
                <div>
                  <span className="text-xs font-bold text-slate-200 print:text-black">
                    Financial Health Score: {reportData.health_score.score} / 100 ({reportData.health_score.status})
                  </span>
                  <p className="text-[11px] text-slate-400 print:text-black/70">{reportData.health_score.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Comparison Table (for Yearly Dossier) */}
          {reportType === 'yearly' && reportData.monthly_table && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
                Month-by-Month Financial Trajectory
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 print:border-black/20">
                  <thead className="bg-slate-900/60 print:bg-slate-100 text-slate-400 print:text-black font-semibold">
                    <tr className="border-b border-slate-800 print:border-black/20">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3 text-right">Income</th>
                      <th className="py-2.5 px-3 text-right">Expenses</th>
                      <th className="py-2.5 px-3 text-right">Net Savings</th>
                      <th className="py-2.5 px-3 text-right">Savings Rate</th>
                      <th className="py-2.5 px-3 text-right">Transactions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-black/10">
                    {reportData.monthly_table.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">{m.month}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 print:text-emerald-700">{formatINR(m.income)}</td>
                        <td className="py-2.5 px-3 text-right text-rose-400 print:text-rose-700">{formatINR(m.expense)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-100 print:text-black">{formatINR(m.savings)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-indigo-400 print:text-indigo-700">{m.savings_rate}%</td>
                        <td className="py-2.5 px-3 text-right text-slate-400 print:text-black/60">{m.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category Spending Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
              Category-Wise Spending Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {reportData.category_summary?.map((c, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800 print:border-black/10 print:bg-slate-50">
                  <span className="font-semibold text-slate-200 print:text-black">{c.category} ({c.count} txns)</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-100 print:text-black">{formatINR(c.amount)}</span>
                    <span className="text-[11px] text-slate-400 print:text-black/60 ml-2">({c.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Transactions (for Monthly Report) */}
          {reportType === 'monthly' && reportData.top_transactions?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
                Recorded Transactions Ledger ({reportData.top_transactions.length} items)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 print:border-black/20">
                  <thead className="bg-slate-900/60 print:bg-slate-100 text-slate-400 print:text-black font-semibold">
                    <tr className="border-b border-slate-800 print:border-black/20">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Payment</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-black/10">
                    {reportData.top_transactions.map((t) => (
                      <tr key={t.id}>
                        <td className="py-2 px-3 text-slate-400 print:text-black/70">{formatDate(t.date, 'short')}</td>
                        <td className="py-2 px-3 font-medium text-slate-200 print:text-black">{t.description}</td>
                        <td className="py-2 px-3 text-slate-300 print:text-black">{t.category}</td>
                        <td className="py-2 px-3 text-slate-400 print:text-black/60">{t.payment_method}</td>
                        <td className={`py-2 px-3 text-right font-bold ${
                          t.type === 'income' ? 'text-emerald-400 print:text-emerald-700' : 'text-slate-100 print:text-black'
                        }`}>
                          {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Advisor Strategic Takeaways */}
          {reportData.recommendations && reportData.recommendations.length > 0 && (
            <div className="pt-4 border-t border-slate-800 print:border-black/20 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" /> AI Strategic Wealth Takeaways
              </h3>
              <div className="space-y-2">
                {reportData.recommendations.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs print:border-black/10 print:bg-slate-50">
                    <strong className="text-slate-200 print:text-black block mb-0.5">{r.title}</strong>
                    <span className="text-slate-400 print:text-black/70 leading-relaxed">{r.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Signature */}
          <div className="pt-8 border-t border-slate-800 print:border-black/20 flex justify-between items-center text-[10px] text-slate-500 print:text-black/50">
            <span>Confidential Financial Document • SmartFinance AI Engine</span>
            <span>Page 1 of 1</span>
          </div>

        </div>

      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          No report data found for the selected period.
        </div>
      )}

    </div>
  );
};
