import React, { useState, useEffect } from 'react';
import { X, Target, IndianRupee, Calendar, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { goalService } from '../services/goalService';

const GOAL_CATEGORIES = [
  'Emergency Fund', 'Gadget', 'Vehicle', 'Vacation', 'House', 'Education', 'Investment', 'Other'
];

export const GoalModal = ({ isOpen, onClose, goal, onSuccess }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    target_date: '',
    category: 'Emergency Fund'
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        target_amount: goal.target_amount ? goal.target_amount.toString() : '',
        current_amount: goal.current_amount ? goal.current_amount.toString() : '0',
        target_date: goal.target_date || '',
        category: goal.category || 'Emergency Fund'
      });
    } else {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 6);
      setFormData({
        name: '',
        target_amount: '',
        current_amount: '0',
        target_date: defaultDate.toISOString().split('T')[0],
        category: 'Emergency Fund'
      });
    }
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error('Please enter a goal name');
      return;
    }
    if (!formData.target_amount || Number(formData.target_amount) <= 0) {
      error('Please enter a valid target amount');
      return;
    }
    if (!formData.target_date) {
      error('Please select a target date');
      return;
    }

    setLoading(true);
    try {
      if (goal?.id) {
        await goalService.updateGoal(goal.id, formData);
        success('Financial goal updated successfully');
      } else {
        await goalService.createGoal(formData);
        success('New financial goal created!');
      }
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            {goal ? 'Edit Goal' : 'Create Financial Target'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-slate-400" /> Goal Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Emergency Fund, MacBook Pro, Europe Trip"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Target (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                placeholder="100000"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Current Saved
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.current_amount}
                onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                placeholder="0"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Target Date *
              </label>
              <input
                type="date"
                required
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500 bg-slate-900 text-slate-100"
              >
                {GOAL_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-100">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
