import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles, 
  UploadCloud, 
  ShieldCheck, 
  PieChart, 
  Target, 
  Bot, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Zap,
  IndianRupee,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-100 tracking-tight">
              SmartFinance <span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
              >
                <span>Go to Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 lg:px-12 overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Intelligent Personal Wealth & Statement Ingestion Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight leading-[1.1] mb-6">
            Understand your money. <br />
            <span className="text-gradient">Improve your habits.</span> <br />
            Build your future.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal mb-10 leading-relaxed">
            Automatic bank statement parsing, heuristic AI recommendations, 
            multi-factor financial fitness scoring, and deep visual spending analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-glow transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Start Managing Finances</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Demo Account</span>
            </button>
          </div>

          {/* Quick Metrics Badge Strip */}
          <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-2xl font-extrabold text-slate-100">0–100</span>
              <p className="text-xs text-slate-400 mt-1">Financial Health Fitness Score</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-2xl font-extrabold text-emerald-400">100%</span>
              <p className="text-xs text-slate-400 mt-1">Automatic Categorization</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-2xl font-extrabold text-indigo-400">Pandas</span>
              <p className="text-xs text-slate-400 mt-1">Instant Bank CSV Processing</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-2xl font-extrabold text-purple-400">Real-time</span>
              <p className="text-xs text-slate-400 mt-1">Heuristic AI Advice Engine</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 px-6 lg:px-12 bg-slate-900/30 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Core Capabilities</h2>
            <p className="text-3xl font-bold text-slate-100">Engineered for Complete Financial Mastery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Bank Statement Ingestion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag and drop CSV statements from HDFC, SBI, ICICI, or any bank. Our Pandas pipeline parses, validates, and cleans data instantly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">AI Financial Advisor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get intelligent, actionable insights on overspending spikes, savings rate optimization, and essential budget allocations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Health Score Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A 0–100 financial health rating powered by savings velocity, expense control, cash flow consistency, and lifestyle ratios.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">How It Works</h2>
            <p className="text-3xl font-bold text-slate-100">From Raw Bank Statements to Actionable Intelligence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload Statement', desc: 'Drop any bank CSV file or log transactions manually.' },
              { step: '02', title: 'Auto Categorize', desc: 'Keyword engine sorts Swiggy, Uber, Rent, Netflix, and more.' },
              { step: '03', title: 'Score Fitness', desc: 'Receive dynamic 0–100 health breakdown & diagnostics.' },
              { step: '04', title: 'Scale Wealth', desc: 'Follow AI recommendations and track goal milestones.' },
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
                <span className="text-3xl font-black text-slate-700">{st.step}</span>
                <h4 className="text-sm font-bold text-slate-200 mt-2 mb-1">{st.title}</h4>
                <p className="text-xs text-slate-400">{st.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-6 lg:px-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto glass-panel p-10 rounded-3xl text-center relative overflow-hidden border border-indigo-500/30 shadow-glow">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3">
            Take Control of Your Personal Finances Today
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Join thousands of smart savers optimizing cash flow with production-grade AI financial intelligence.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-xl"
          >
            Create Your Free Account
          </button>
        </div>

        <div className="max-w-6xl mx-auto mt-16 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 SmartFinance AI Advisor. Built with Flask, React, and Python.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </section>

    </div>
  );
};
