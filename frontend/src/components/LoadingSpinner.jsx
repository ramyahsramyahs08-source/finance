import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading analytics & insights...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 min-h-[250px]">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <span className="text-xs font-medium text-slate-400 animate-pulse">{label}</span>
    </div>
  );
};
