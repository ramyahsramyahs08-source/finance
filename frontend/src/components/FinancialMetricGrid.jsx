import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Percent, 
  Activity 
} from 'lucide-react';
import { StatCard } from './StatCard';
import { formatINR } from '../utils/currency';

export const FinancialMetricGrid = ({ metrics = {}, onCardClick }) => {
  const {
    total_balance = 0,
    monthly_income = 0,
    monthly_expense = 0,
    monthly_savings = 0,
    savings_rate = 0,
    health_score = 50,
    health_status = 'Healthy'
  } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
      
      {/* 1. Total Balance */}
      <StatCard
        title="Total Balance"
        value={formatINR(total_balance)}
        subtitle="Current available balance"
        icon={Wallet}
        accentColor="emerald"
        onClick={onCardClick ? () => onCardClick('balance') : undefined}
      />

      {/* 2. Monthly Income */}
      <StatCard
        title="Monthly Income"
        value={formatINR(monthly_income)}
        subtitle="Current cycle earnings"
        icon={TrendingUp}
        accentColor="cyan"
        onClick={onCardClick ? () => onCardClick('income') : undefined}
      />

      {/* 3. Monthly Expenses */}
      <StatCard
        title="Monthly Expenses"
        value={formatINR(monthly_expense)}
        subtitle="Total spending this month"
        icon={TrendingDown}
        accentColor="rose"
        onClick={onCardClick ? () => onCardClick('expense') : undefined}
      />

      {/* 4. Monthly Savings */}
      <StatCard
        title="Monthly Savings"
        value={formatINR(monthly_savings)}
        subtitle="Income minus expenses"
        icon={PiggyBank}
        accentColor="emerald"
        trend={monthly_savings >= 0 ? 'up' : 'down'}
        trendValue={monthly_savings >= 0 ? '+Active' : '-Deficit'}
        onClick={onCardClick ? () => onCardClick('savings') : undefined}
      />

      {/* 5. Savings Rate */}
      <StatCard
        title="Savings Rate"
        value={`${savings_rate}%`}
        subtitle="Target progress"
        icon={Percent}
        accentColor="purple"
        trend={savings_rate >= 20 ? 'up' : 'neutral'}
        trendValue={savings_rate >= 20 ? 'Target met' : 'Target >= 20%'}
        onClick={onCardClick ? () => onCardClick('goals') : undefined}
      />

      {/* 6. Financial Health Score */}
      <StatCard
        title="Health Score"
        value={`${health_score}/100`}
        subtitle="Financial Fitness"
        icon={Activity}
        accentColor={health_score >= 80 ? 'emerald' : health_score >= 60 ? 'cyan' : health_score >= 40 ? 'amber' : 'rose'}
        badge={health_status}
        onClick={onCardClick ? () => onCardClick('health') : undefined}
      />

    </div>
  );
};
