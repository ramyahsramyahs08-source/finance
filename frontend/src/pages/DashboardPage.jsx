import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { goalService } from '../services/goalService';
import { useAuth } from '../context/AuthContext';

// Components
import { AnalyticsCard } from '../components/AnalyticsCard';
import { FinancialAccountsCard } from '../components/FinancialAccountsCard';
import { RecentTransactionsCard } from '../components/RecentTransactionsCard';
import { BudgetCard } from '../components/BudgetCard';
import { SavingsGoalCard } from '../components/SavingsGoalCard';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { AIInsightsCard } from '../components/AIInsightsCard';
import { TransactionModal } from '../components/TransactionModal';
import { DashboardSkeleton } from '../components/DashboardSkeleton';

export const DashboardPage = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext();
  
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [dashRes, goalsRes] = await Promise.allSettled([
        dashboardService.getDashboardData(),
        goalService.getGoals()
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.success && dashRes.value?.data) {
        setData(dashRes.value.data);
      }
      if (goalsRes.status === 'fulfilled' && goalsRes.value?.success && goalsRes.value?.data) {
        setGoals(goalsRes.value.data.goals || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, outletContext?.refreshSignal]);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  const metrics = data?.metrics || {
    total_balance: 0,
    monthly_income: 0,
    monthly_expense: 0,
    monthly_savings: 0,
    savings_rate: 0,
    health_score: 0,
    health_status: 'Healthy'
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Main Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* 2. Top Row: Analytics (Left) | My Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <AnalyticsCard data={data?.monthly_trend || []} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <FinancialAccountsCard 
            totalBalance={metrics.total_balance} 
            userName={user?.name || 'User'} 
          />
        </div>
      </div>

      {/* 3. Middle Row: Transactions (Left) | Budget & Savings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <RecentTransactionsCard 
            transactions={data?.recent_transactions || []}
            onOpenAddTransaction={() => setIsModalOpen(true)}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between space-y-6">
          <BudgetCard 
            monthlyIncome={metrics.monthly_income}
            monthlyExpense={metrics.monthly_expense}
            monthlyTrend={data?.monthly_trend || []}
          />
          <SavingsGoalCard goals={goals} />
        </div>
      </div>

      {/* 4. Bottom Row: Financial Health Score (Left) | AI Wealth Intelligence (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <HealthScoreCard healthScoreDetail={data?.health_score_detail} />
        <AIInsightsCard recommendations={data?.ai_recommendations || []} />
      </div>

      {/* Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

    </div>
  );
};
