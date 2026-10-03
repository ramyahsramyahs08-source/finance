import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap
} from 'lucide-react';

export const RecommendationCard = ({ recommendation }) => {
  const navigate = useNavigate();

  if (!recommendation) return null;

  const { type = 'suggestion', badge = 'AI Insight', title = '', message = '', action, action_url, impact = 'Medium' } = recommendation;

  const typeConfig = {
    critical: {
      border: 'border-rose-500/40 bg-rose-500/5',
      badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      icon: ShieldAlert,
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      btn: 'bg-rose-500 hover:bg-rose-400 text-white shadow-glow-danger'
    },
    warning: {
      border: 'border-amber-500/40 bg-amber-500/5',
      badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      btn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
    },
    suggestion: {
      border: 'border-purple-500/30 bg-purple-500/5',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Lightbulb,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      btn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple'
    },
    positive: {
      border: 'border-emerald-500/30 bg-emerald-500/5',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      btn: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold shadow-glow-lime'
    }
  };

  const config = typeConfig[type] || typeConfig.suggestion;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 hover:border-slate-700 ${config.border} flex flex-col justify-between`}>
      
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${config.badgeBg}`}>
            {badge || 'AI Insight'}
          </span>
          {impact && (
            <span className="text-[11px] text-slate-400 font-medium">
              Impact: <span className="text-slate-200 font-bold">{impact}</span>
            </span>
          )}
        </div>

        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${config.iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">{title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>

      {action && action_url && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={() => navigate(action_url)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${config.btn}`}
          >
            <span>{action}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
};
