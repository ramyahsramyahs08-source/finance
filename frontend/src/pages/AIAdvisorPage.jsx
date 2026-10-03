import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  Sliders, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import { advisorService } from '../services/advisorService';
import { RecommendationCard } from '../components/RecommendationCard';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatINR } from '../utils/currency';

export const AIAdvisorPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Interactive "What-If" Simulation state
  const [shoppingCut, setShoppingCut] = useState(2000);
  const [diningCut, setDiningCut] = useState(1500);
  const [entertainmentCut, setEntertainmentCut] = useState(1000);

  const fetchAdvisorData = async () => {
    setLoading(true);
    try {
      const [recRes, scoreRes] = await Promise.all([
        advisorService.getRecommendations(),
        advisorService.getHealthScore()
      ]);
      if (recRes.success && recRes.data) {
        setRecommendations(recRes.data);
      }
      if (scoreRes.success && scoreRes.data) {
        setHealthScore(scoreRes.data);
      }
    } catch (err) {
      console.error('Advisor fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorData();
  }, []);

  // Filter recommendations by tab
  const filteredRecs = recommendations.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'alerts') return r.type === 'critical' || r.type === 'warning';
    if (activeTab === 'suggestions') return r.type === 'suggestion';
    if (activeTab === 'positive') return r.type === 'positive';
    return true;
  });

  // What-If Simulation calculations
  const totalPotentialSavings = Number(shoppingCut) + Number(diningCut) + Number(entertainmentCut);
  const curIncome = healthScore?.metrics?.total_income || 85000;
  const curSavings = healthScore?.metrics?.net_savings || 20000;
  const projectedSavings = curSavings + totalPotentialSavings;
  const projectedRate = curIncome > 0 ? (projectedSavings / curIncome) * 100 : 0;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-indigo-950/30 shadow-glow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Smart Heuristic Wealth Advisor Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Personalized AI Financial Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Continuous algorithmic analysis evaluating monthly variance, discretionary burn rate, overspending spikes, and optimal savings pathways.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-slate-100">{healthScore?.score || 50}</span>
              <span className="text-[10px] text-slate-400 block font-bold">HEALTH SCORE</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-800" />
            <div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 block mb-1">
                {healthScore?.status || 'Active'}
              </span>
              <span className="text-[11px] text-slate-400">{recommendations.length} Active Insights</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Running rule-based AI recommendation heuristics..." />
      ) : (
        <>
          {/* Main Insights Tabs & List */}
          <div className="space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'all' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Insights ({recommendations.length})
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'alerts' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Alerts & Overspending
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'suggestions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Savings Optimizations
                </button>
                <button
                  onClick={() => setActiveTab('positive')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'positive' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Positive Habits
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecs.length > 0 ? (
                filteredRecs.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))
              ) : (
                <div className="col-span-2 glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
                  No insights in this category. Your budget is running smoothly!
                </div>
              )}
            </div>

          </div>

          {/* Interactive "What-If" Budget Simulator */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/80 to-slate-900/40">
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Interactive "What-If" Wealth Simulator</h3>
                <p className="text-xs text-slate-400">See how minor reductions in lifestyle spending compound into higher monthly savings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
              
              {/* Sliders Form */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Shopping Reduction */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Trim Monthly Shopping By</span>
                    <span className="text-indigo-400 font-bold">{formatINR(shoppingCut)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={shoppingCut}
                    onChange={(e) => setShoppingCut(e.target.value)}
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Food & Dining Reduction */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Trim Food & Dining Delivery By</span>
                    <span className="text-indigo-400 font-bold">{formatINR(diningCut)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8000"
                    step="500"
                    value={diningCut}
                    onChange={(e) => setDiningCut(e.target.value)}
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Entertainment & Subscriptions */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Trim Entertainment & Subscriptions By</span>
                    <span className="text-indigo-400 font-bold">{formatINR(entertainmentCut)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="250"
                    value={entertainmentCut}
                    onChange={(e) => setEntertainmentCut(e.target.value)}
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

              </div>

              {/* Simulation Result Projection Card */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                  Simulated Monthly Surplus
                </span>

                <div className="text-3xl font-black text-emerald-400">
                  +{formatINR(totalPotentialSavings)} / mo
                </div>

                <div className="pt-3 border-t border-indigo-500/20 text-xs text-slate-300 space-y-1">
                  <div>
                    Projected Total Monthly Savings:{' '}
                    <strong className="text-slate-100">{formatINR(projectedSavings)}</strong>
                  </div>
                  <div>
                    Projected Annual Wealth Accumulation:{' '}
                    <strong className="text-emerald-300">{formatINR(totalPotentialSavings * 12)} / yr</strong>
                  </div>
                  <div className="text-indigo-400 font-semibold pt-1">
                    Boosts savings rate to ~{projectedRate.toFixed(1)}%
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Full Health Score Diagnostic Breakdown */}
          <div>
            <HealthScoreCard healthScoreDetail={healthScore} />
          </div>
        </>
      )}

    </div>
  );
};
