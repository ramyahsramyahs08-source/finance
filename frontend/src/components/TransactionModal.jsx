import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, IndianRupee, Tag, CreditCard, AlignLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { transactionService } from '../services/transactionService';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Bills', 'Housing', 
  'Entertainment', 'Health', 'Education', 'Investment', 'Others', 'Income'
];

const PAYMENT_METHODS = [
  'UPI', 'Debit Card', 'Credit Card', 'Cash', 'Bank Transfer', 'Other'
];

export const TransactionModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    payment_method: 'UPI',
    notes: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description || '',
        amount: transaction.amount ? transaction.amount.toString() : '',
        type: transaction.type || 'expense',
        category: transaction.category || 'Food',
        payment_method: transaction.payment_method || 'UPI',
        notes: transaction.notes || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        payment_method: 'UPI',
        notes: ''
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      error('Please enter a description');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      error('Please enter a valid positive amount');
      return;
    }

    setLoading(true);
    try {
      if (transaction?.id) {
        await transactionService.updateTransaction(transaction.id, formData);
        success('Transaction updated successfully');
      } else {
        await transactionService.createTransaction(formData);
        success('Transaction recorded successfully');
      }
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-indigo-400" />
            {transaction ? 'Edit Transaction' : 'Record New Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Type Toggle: Expense / Income */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                type: 'expense',
                category: prev.category === 'Income' ? 'Food' : prev.category 
              }))}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'Income' }))}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 1450.00"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Description / Merchant *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Swiggy Food Delivery, Zara Shopping, Salary"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500"
            />
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500 bg-slate-900 text-slate-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm focus:border-indigo-500 bg-slate-900 text-slate-100"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} className="bg-slate-900 text-slate-100">
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details..."
              className="w-full glass-input px-3.5 py-2 rounded-xl text-sm focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : transaction ? 'Update Record' : 'Save Transaction'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
