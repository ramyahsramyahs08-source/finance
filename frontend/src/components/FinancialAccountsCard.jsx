import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { CardsModal } from './CardsModal';

export const FinancialAccountsCard = ({ 
  totalBalance = 0, 
  userName = 'User' 
}) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const safeBalance = totalBalance !== undefined && totalBalance !== null ? Number(totalBalance) : 0;
  const safeUser = userName || 'User';

  const cards = [
    {
      id: 1,
      name: 'Platinum Debit',
      balance: safeBalance,
      number: '6785 XXXX 2XX6 8836',
      holder: safeUser,
      expiry: '12/24',
      type: 'mastercard',
      gradient: 'from-[#13161C] to-[#0B0D11]'
    },
    {
      id: 2,
      name: 'Vault Reserve',
      balance: Math.max(0, safeBalance * 0.65),
      number: '4192 XXXX 8YY3 1104',
      holder: safeUser,
      expiry: '09/26',
      type: 'visa',
      gradient: 'from-[#064E3B] to-[#0B0D11]'
    },
    {
      id: 3,
      name: 'Shopping Virtual',
      balance: Math.max(0, safeBalance * 0.35),
      number: '5520 XXXX 9ZZ1 7729',
      holder: safeUser,
      expiry: '11/27',
      type: 'mastercard',
      gradient: 'from-[#4C1D95] to-[#0B0D11]'
    }
  ];

  const card = cards[currentCard];

  return (
    <>
      <div className="bg-[#13161C] border border-white/[0.06] p-6 sm:p-7 rounded-3xl h-full flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#A3FF12] transition-colors">
              My cards
            </h3>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-[#A3FF12] text-black rounded-full shadow-sm">
              03
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-slate-200 transition-all shadow-sm"
            title="Open Card Manager"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Clickable Physical Fintech Card Mockup */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className={`bg-[#0B0D11] border border-white/[0.08] p-5 rounded-2xl relative overflow-hidden shadow-xl mb-4 cursor-pointer hover:border-white/[0.2] transition-all duration-300 hover:scale-[1.01]`}
        >
          {/* Top: Balance & Mastercard Logo */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Balance</span>
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5 block">
                {formatINR(card.balance)}
              </span>
            </div>

            {/* Mastercard Logo (Overlapping red and yellow-orange circles) */}
            <div className="flex items-center -space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-[#EB001B] opacity-90" />
              <div className="w-5 h-5 rounded-full bg-[#FF5F00] opacity-80" />
            </div>
          </div>

          {/* Chip Icon */}
          <div className="w-7 h-5 rounded bg-gradient-to-r from-amber-200 to-amber-400 border border-amber-500/40 mb-4 flex items-center justify-center opacity-85">
            <div className="w-4 h-3 border-t border-b border-amber-700/60" />
          </div>

          {/* Card Number */}
          <div className="font-mono text-xs text-slate-300 tracking-widest mb-3">
            {card.number}
          </div>

          {/* Card Holder & Expiry */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-200">{card.holder}</span>
            <span className="font-mono text-[11px] text-slate-400">{card.expiry}</span>
          </div>
        </div>

        {/* Card switcher arrows and indicators */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-1.5">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentCard(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentCard === i ? 'w-5 bg-[#A3FF12]' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentCard(currentCard === 0 ? cards.length - 1 : currentCard - 1)}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              title="Previous Card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentCard((currentCard + 1) % cards.length)}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              title="Next Card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Full Cards & Limit Management Modal */}
      <CardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalBalance={totalBalance}
        userName={userName}
      />
    </>
  );
};
