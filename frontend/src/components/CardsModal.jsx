import React, { useState } from 'react';
import { 
  CreditCard, 
  X, 
  Plus, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft,
  Sparkles,
  Zap
} from 'lucide-react';
import { formatINR } from '../utils/currency';
import { useToast } from '../context/ToastContext';

export const CardsModal = ({ isOpen, onClose, totalBalance = 0, userName = 'User' }) => {
  const { success } = useToast();
  const [copiedId, setCopiedId] = useState(null);
  const [showFullNumbers, setShowFullNumbers] = useState(false);
  const [frozenCards, setFrozenCards] = useState({});
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);

  if (!isOpen) return null;

  const safeBalance = totalBalance !== undefined && totalBalance !== null ? Number(totalBalance) : 0;
  const safeUser = userName || 'User';

  const cardList = [
    {
      id: 'card-1',
      name: 'Platinum Debit Card',
      bank: 'SmartFinance Platinum',
      number: showFullNumbers ? '6785 9104 2886 8836' : '6785 XXXX 2XX6 8836',
      rawNumber: '6785910428868836',
      balance: safeBalance,
      limit: 100000,
      spent: 0,
      holder: safeUser,
      expiry: '12/24',
      cvv: showFullNumbers ? '842' : '•••',
      color: 'from-[#1E293B] via-[#0F172A] to-[#0B0D11]',
      border: 'border-white/10',
      brand: 'mastercard'
    },
    {
      id: 'card-2',
      name: 'Wealth Reserve & Vault Card',
      bank: 'SmartFinance Vault',
      number: showFullNumbers ? '4192 8830 8113 1104' : '4192 XXXX 8YY3 1104',
      rawNumber: '4192883081131104',
      balance: Math.max(0, safeBalance * 0.65),
      limit: 500000,
      spent: 0,
      holder: safeUser,
      expiry: '09/26',
      cvv: showFullNumbers ? '319' : '•••',
      color: 'from-[#064E3B] via-[#022C22] to-[#0B0D11]',
      border: 'border-emerald-500/20',
      brand: 'visa'
    },
    {
      id: 'card-3',
      name: 'Digital Shopping Virtual Card',
      bank: 'SmartFinance One-Time',
      number: showFullNumbers ? '5520 4491 9121 7729' : '5520 XXXX 9ZZ1 7729',
      rawNumber: '5520449191217729',
      balance: Math.max(0, totalBalance * 0.35),
      limit: 50000,
      spent: 3450.00,
      holder: userName || 'Gopinath B',
      expiry: '11/27',
      cvv: showFullNumbers ? '108' : '•••',
      color: 'from-[#4C1D95] via-[#2E1065] to-[#0B0D11]',
      border: 'border-purple-500/20',
      brand: 'mastercard'
    }
  ];

  const handleCopy = (card) => {
    navigator.clipboard.writeText(card.rawNumber);
    setCopiedId(card.id);
    success(`Card number copied: ${card.rawNumber}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFreeze = (cardId) => {
    setFrozenCards((prev) => {
      const isCurrentlyFrozen = !!prev[cardId];
      const newState = { ...prev, [cardId]: !isCurrentlyFrozen };
      success(isCurrentlyFrozen ? 'Card unfrozen and activated!' : 'Card frozen successfully for security.');
      return newState;
    });
  };

  const activeCard = cardList[selectedCardIdx];
  const isFrozen = !!frozenCards[activeCard.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#13161C] border border-white/[0.08] p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A3FF12]/10 border border-[#A3FF12]/20 flex items-center justify-center text-[#A3FF12]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">My Cards &amp; Accounts</h2>
              <p className="text-xs text-slate-400">Manage your payment cards and limits</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#0B0D11] rounded-2xl border border-white/[0.04]">
          {cardList.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelectedCardIdx(i)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center truncate ${
                selectedCardIdx === i
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c.name.split(' ')[0]} Card
            </button>
          ))}
        </div>

        {/* Selected Card Preview */}
        <div className={`p-6 rounded-2xl bg-gradient-to-tr ${activeCard.color} border ${activeCard.border} relative overflow-hidden shadow-2xl transition-all duration-300 ${
          isFrozen ? 'grayscale opacity-75' : ''
        }`}>
          
          {isFrozen && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center flex-col gap-2 text-rose-400 font-bold">
              <Lock className="w-8 h-8" />
              <span>CARD IS CURRENTLY FROZEN</span>
            </div>
          )}

          {/* Top Row: Brand & Status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-white">
                {activeCard.bank}
              </span>
            </div>

            {/* Mastercard logo */}
            <div className="flex items-center -space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-[#EB001B] opacity-90" />
              <div className="w-6 h-6 rounded-full bg-[#FF5F00] opacity-80" />
            </div>
          </div>

          {/* Chip & Mask Toggle */}
          <div className="flex items-center justify-between mb-5">
            <div className="w-9 h-7 rounded-md bg-gradient-to-r from-amber-200 to-amber-400 border border-amber-500/40 flex items-center justify-center">
              <div className="w-5 h-4 border-t border-b border-amber-800/60" />
            </div>

            <button
              onClick={() => setShowFullNumbers(!showFullNumbers)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 hover:text-white"
            >
              {showFullNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{showFullNumbers ? 'Hide' : 'Show Details'}</span>
            </button>
          </div>

          {/* Card Number */}
          <div className="font-mono text-base sm:text-lg tracking-widest text-white mb-4 flex items-center justify-between">
            <span>{activeCard.number}</span>
            <button
              onClick={() => handleCopy(activeCard)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Copy Number"
            >
              {copiedId === activeCard.id ? <Check className="w-4 h-4 text-[#A3FF12]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Holder & Expiry / CVV */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-white/10">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Card Holder</span>
              <span className="font-bold text-white uppercase">{activeCard.holder}</span>
            </div>
            <div className="flex space-x-4 text-right">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Expires</span>
                <span className="font-mono font-bold text-white">{activeCard.expiry}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">CVV</span>
                <span className="font-mono font-bold text-white">{activeCard.cvv}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Controls & Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Card Balance */}
          <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/[0.06] space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Available Card Balance</span>
            <div className="text-xl font-extrabold text-white">
              {formatINR(activeCard.balance)}
            </div>
          </div>

          {/* Monthly Spend Limit */}
          <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/[0.06] space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Monthly Limit</span>
              <span className="text-slate-400 font-bold">{formatINR(activeCard.spent)} / {formatINR(activeCard.limit)}</span>
            </div>
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-[#A3FF12] rounded-full" 
                style={{ width: `${(activeCard.spent / activeCard.limit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <button
            onClick={() => toggleFreeze(activeCard.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isFrozen
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-lime'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
          </button>

          <button
            onClick={() => {
              success('Virtual card creation form opened');
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#A3FF12] hover:bg-[#B8FF33] text-black shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Virtual Card</span>
          </button>
        </div>

      </div>
    </div>
  );
};
