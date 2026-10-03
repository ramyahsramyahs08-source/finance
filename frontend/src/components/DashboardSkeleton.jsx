import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800/60 rounded-xl" />
          <div className="h-4 w-72 bg-slate-800/40 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-36 bg-slate-800/60 rounded-xl" />
          <div className="h-10 w-36 bg-slate-800/60 rounded-xl" />
        </div>
      </div>

      {/* 6 Top Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-800 rounded" />
              <div className="w-8 h-8 rounded-xl bg-slate-800" />
            </div>
            <div className="h-7 w-28 bg-slate-800 rounded-lg" />
            <div className="h-3 w-24 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Main 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 h-80 space-y-4">
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-slate-800 rounded" />
              <div className="h-8 w-44 bg-slate-800 rounded-xl" />
            </div>
            <div className="h-48 w-full bg-slate-800/40 rounded-xl" />
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 h-96 space-y-4">
            <div className="flex justify-between">
              <div className="h-5 w-36 bg-slate-800 rounded" />
              <div className="h-8 w-28 bg-slate-800 rounded-xl" />
            </div>
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-14 w-full bg-slate-800/40 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 h-64 space-y-4">
            <div className="h-5 w-40 bg-slate-800 rounded" />
            <div className="h-36 w-full bg-slate-800/40 rounded-2xl" />
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 h-52 space-y-4">
            <div className="h-5 w-28 bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800/40 rounded" />
            <div className="h-12 w-full bg-slate-800/40 rounded-xl" />
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 h-52 space-y-4">
            <div className="h-5 w-32 bg-slate-800 rounded" />
            <div className="h-20 w-full bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
