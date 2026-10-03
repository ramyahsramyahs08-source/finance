import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, CheckCircle2, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { goalService } from '../services/goalService';
import { GoalCard } from '../components/GoalCard';
import { GoalModal } from '../components/GoalModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';

export const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({
    total_goals: 0,
    completed_goals: 0,
    total_target_amount: 0,
    total_saved_amount: 0,
    overall_progress: 0,
    total_monthly_needed: 0
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error } = useToast();

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoals();
      if (res.success && res.data) {
        setGoals(res.data.goals || []);
        setSummary(res.data.summary || {});
      }
    } catch (err) {
      error(err.message || 'Failed to fetch financial goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await goalService.deleteGoal(deleteId);
      success('Financial goal deleted successfully');
      setDeleteId(null);
      fetchGoals();
    } catch (err) {
      error(err.message || 'Failed to delete goal');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Financial Goals & Targets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track milestone objectives, emergency reserves, and recommended monthly contributions
          </p>
        </div>

        <button
          onClick={() => { setSelectedGoal(null); setModalOpen(true); }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Calculating goal progress & timeline projections..." />
      ) : (
        <>
          {/* Top Aggregated Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Goals</span>
              <span className="text-2xl font-extrabold text-slate-100 mt-1 block">
                {summary.completed_goals} / {summary.total_goals}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Completed targets</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Accumulated</span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                {formatINR(summary.total_saved_amount)}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">of {formatINR(summary.total_target_amount)} total</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Overall Progress</span>
              <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">
                {summary.overall_progress}%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Weighted portfolio average</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Monthly Target Savings</span>
              <span className="text-2xl font-extrabold text-purple-400 mt-1 block">
                {formatINR(summary.total_monthly_needed)}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Required to meet deadlines</span>
            </div>

          </div>

          {/* Goals Grid */}
          {goals.length === 0 ? (
            <EmptyState
              title="No financial goals created"
              description="Define short-term and long-term milestones like an Emergency Fund, New Laptop, Vacation, or House."
              actionLabel="Create First Goal"
              onAction={() => { setSelectedGoal(null); setModalOpen(true); }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Goal Modal (Add / Edit) */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedGoal(null); }}
        goal={selectedGoal}
        onSuccess={fetchGoals}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Financial Goal"
        message="Are you sure you want to delete this financial goal? Tracking for this milestone will be removed."
        confirmLabel="Delete Goal"
        confirmVariant="danger"
        loading={deleteLoading}
      />

    </div>
  );
};
