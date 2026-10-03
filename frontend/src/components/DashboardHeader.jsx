import React from 'react';
import { UploadCloud, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = ({ onOpenAddTransaction, onRefresh, isRefreshing }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your financial overview at a glance
        </p>
      </div>

      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/80 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        )}

        <button
          onClick={() => navigate('/csv-upload')}
          className="flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all"
        >
          <UploadCloud className="w-4 h-4 text-emerald-400" />
          <span>Upload Statement</span>
        </button>

        <button
          onClick={onOpenAddTransaction}
          className="flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-glow-lime transition-all duration-200"
        >
          <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>
      </div>
    </div>
  );
};
