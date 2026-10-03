import React, { useState } from 'react';
import { 
  ArrowRight, 
  Plus, 
  Banknote, 
  CreditCard,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatINR, formatDate } from '../utils/currency';
import { getMerchantBrand, MerchantAvatar } from './MerchantIcon';

export const RecentTransactionsCard = ({ 
  transactions = [], 
  onOpenAddTransaction 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('latest'); // 'latest' or 'upcoming'

  // Default transactions fallback with real brands (Swiggy, Zomato, Apple, Spotify, Uber)
  const defaultTransactions = [
    {
      id: 'd-1',
      description: 'Swiggy order',
      time: '14 hrs ago',
      category: 'Food',
      payment: 'Cash payment',
      amount: -450,
      type: 'expense'
    },
    {
      id: 'd-2',
      description: 'Zomato Dining',
      time: '1 day ago',
      category: 'Food',
      payment: 'UPI payment',
      amount: -890,
      type: 'expense'
    },
    {
      id: 'd-3',
      description: 'App store purchase',
      time: '2 days ago',
      category: 'Entertainment',
      payment: 'Apple pay',
      amount: -299,
      type: 'expense'
    },
    {
      id: 'd-4',
      description: 'Swiggy Refund',
      time: '1 week ago',
      category: 'Food',
      payment: 'Cash payment',
      amount: 450,
      type: 'income'
    },
    {
      id: 'd-5',
      description: 'Spotify membership',
      time: '5 hrs ago',
      category: 'Entertainment',
      payment: 'Mastercard payment',
      amount: -119,
      type: 'expense'
    },
    {
      id: 'd-6',
      description: 'Uber ride',
      time: '3 days ago',
      category: 'Travel',
      payment: 'Cash payment',
      amount: -340,
      type: 'expense'
    }
  ];

  const list = transactions && transactions.length > 0
    ? transactions.slice(0, 5).map((t) => ({
        id: t.id,
        description: t.description,
        category: t.category,
        time: formatDate(t.date, 'short'),
        payment: t.payment_method || getMerchantBrand(t.description, t.category).defaultPayment,
        amount: t.type === 'income' ? t.amount : -t.amount,
        type: t.type
      }))
    : defaultTransactions;

  return (
    <div className="bg-[#13161C] border border-white/[0.06] p-6 sm:p-7 rounded-3xl h-full flex flex-col justify-between">
      
      {/* Top Header with Tabs and Actions */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Transactions</h3>
          <div className="flex items-center space-x-4 mt-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('latest')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'latest' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Latest
              {activeTab === 'latest' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A3FF12] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'upcoming' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add transaction</span>
          </button>

          <button
            onClick={() => navigate('/transactions')}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-slate-200 transition-colors shadow-sm"
            title="View All Transactions"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Transaction Rows */}
      <div className="space-y-4 flex-1">
        {list.map((txn) => {
          const isIncome = txn.amount > 0;
          const brand = getMerchantBrand(txn.description, txn.category);

          return (
            <div
              key={txn.id}
              className="flex items-center justify-between py-1 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
            >
              {/* Brand logo/avatar & name */}
              <div className="flex items-center space-x-3.5 min-w-0">
                <MerchantAvatar 
                  description={txn.description} 
                  category={txn.category} 
                  size="md" 
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    {txn.description}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {txn.time}
                  </p>
                </div>
              </div>

              {/* Payment method */}
              <div className="hidden sm:flex items-center space-x-1.5 text-slate-400 text-xs font-medium">
                <span>{txn.payment || brand.defaultPayment}</span>
              </div>

              {/* Amount */}
              <div className={`text-xs sm:text-sm font-bold tracking-tight ${
                isIncome ? 'text-[#A3FF12]' : 'text-[#EF4444]'
              }`}>
                {isIncome ? '+' : '-'}{formatINR(Math.abs(txn.amount))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
