import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  X
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { TransactionModal } from '../components/TransactionModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { MerchantAvatar } from '../components/MerchantIcon';
import { CardsModal } from '../components/CardsModal';
import { useToast } from '../context/ToastContext';
import { formatINR, formatDate } from '../utils/currency';

const CATEGORIES = [
  'All', 'Food', 'Travel', 'Shopping', 'Bills', 'Housing', 
  'Entertainment', 'Health', 'Education', 'Investment', 'Others', 'Income'
];

const PAYMENT_METHODS = [
  'All', 'UPI', 'Debit Card', 'Credit Card', 'Cash', 'Bank Transfer', 'Other'
];

export const TransactionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [cardsModalOpen, setCardsModalOpen] = useState(searchParams.get('tab') === 'cards');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    if (searchParams.get('tab') === 'cards') {
      setCardsModalOpen(true);
    }
  }, [searchParams]);

  const fetchTransactions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: 15,
        search,
        type: typeFilter,
        category: categoryFilter,
        payment_method: paymentFilter,
        start_date: startDate,
        end_date: endDate,
        sort_by: sortBy
      };
      const res = await transactionService.getTransactions(params);
      if (res.success && res.data) {
        setTransactions(res.data.transactions);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, categoryFilter, paymentFilter, startDate, endDate, sortBy]);

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  const handleEdit = (txn) => {
    setSelectedTxn(txn);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await transactionService.deleteTransaction(deleteId);
      success('Transaction deleted successfully');
      setDeleteId(null);
      fetchTransactions(pagination.page);
    } catch (err) {
      error(err.message || 'Failed to delete transaction');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!transactions.length) {
      error('No transactions to export');
      return;
    }
    const headers = ['Date', 'Description', 'Amount (INR)', 'Type', 'Category', 'Payment Method', 'Notes'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.payment_method,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Transactions exported to CSV');
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setCategoryFilter('All');
    setPaymentFilter('All');
    setStartDate('');
    setEndDate('');
    setSortBy('date_desc');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, filter, and audit all recorded financial transactions ({pagination.total} records)
          </p>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={() => setCardsModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#A3FF12] hover:bg-[#B8FF33] text-black shadow-sm transition-all"
          >
            <CreditCard className="w-4 h-4 stroke-[2.5]" />
            <span>My Cards</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => { setSelectedTxn(null); setModalOpen(true); }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description, notes..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs focus:border-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:border-indigo-500"
            >
              <option value="" className="bg-slate-900">All Types</option>
              <option value="income" className="bg-slate-900">Income (+)</option>
              <option value="expense" className="bg-slate-900">Expense (-)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:border-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div className="md:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:border-indigo-500"
            >
              {PAYMENT_METHODS.map((p) => (
                <option key={p} value={p} className="bg-slate-900">{p}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Date Horizons & Sorters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
          
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" /> Date:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="glass-input px-2.5 py-1 rounded-lg text-xs"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="glass-input px-2.5 py-1 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input px-2.5 py-1 rounded-lg text-xs"
              >
                <option value="date_desc" className="bg-slate-900">Newest Date</option>
                <option value="date_asc" className="bg-slate-900">Oldest Date</option>
                <option value="amount_desc" className="bg-slate-900">Highest Amount</option>
                <option value="amount_asc" className="bg-slate-900">Lowest Amount</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

      </div>

      {/* Main Ledger Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        
        {loading ? (
          <LoadingSpinner label="Filtering transactions..." />
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No transactions found"
              description="No transactions match your current search or filter criteria."
              actionLabel="Add Transaction"
              onAction={() => { setSelectedTxn(null); setModalOpen(true); }}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((txn) => {
                    const isIncome = txn.type === 'income';
                    return (
                      <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-medium">
                          {formatDate(txn.date)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <MerchantAvatar description={txn.description} category={txn.category} size="sm" />
                            <div>
                              <div className="font-semibold text-slate-200">{txn.description}</div>
                              {txn.notes && (
                                <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{txn.notes}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/80">
                            {txn.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {txn.payment_method || 'UPI'}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            txn.source === 'csv' 
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {txn.source}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap text-sm ${
                          isIncome ? 'text-emerald-400' : 'text-slate-100'
                        }`}>
                          {isIncome ? '+' : '-'}{formatINR(txn.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(txn)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteId(txn.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-900/40 text-xs">
              <span className="text-slate-400">
                Showing page <span className="font-semibold text-slate-200">{pagination.page}</span> of{' '}
                <span className="font-semibold text-slate-200">{pagination.pages || 1}</span> ({pagination.total} transactions)
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={!pagination.has_prev}
                  onClick={() => fetchTransactions(pagination.page - 1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={!pagination.has_next}
                  onClick={() => fetchTransactions(pagination.page + 1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedTxn(null); }}
        transaction={selectedTxn}
        onSuccess={() => fetchTransactions(pagination.page)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction record? This will adjust your financial totals."
        confirmLabel="Delete Record"
        confirmVariant="danger"
        loading={deleteLoading}
      />

      {/* Cards & Limits Modal */}
      <CardsModal
        isOpen={cardsModalOpen}
        onClose={() => setCardsModalOpen(false)}
      />

    </div>
  );
};
