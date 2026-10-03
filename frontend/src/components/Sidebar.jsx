import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  Receipt,
  CreditCard,
  PiggyBank,
  PieChart,
  BarChart2,
  LifeBuoy,
  Info,
  Settings,
  X,
  UploadCloud,
  Sparkles,
  FileText,
  CheckCircle2,
  Mail,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CardsModal } from './CardsModal';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCardsModal, setShowCardsModal] = useState(false);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'My Cards', action: () => setShowCardsModal(true), icon: CreditCard, badge: '03' },
    { name: 'Savings', path: '/goals', icon: PiggyBank },
    { name: 'Budget', path: '/analytics', icon: PieChart },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'CSV Statement', path: '/csv-upload', icon: UploadCloud, badge: 'Auto' },
    { name: 'AI Advisor', path: '/advisor', icon: Sparkles },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0E1117] border-r border-white/[0.05] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-7 py-7">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-extrabold text-white tracking-tight">MoneyTrack</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path && location.pathname === item.path && (!item.query || location.search.includes(item.query));
              
              if (item.action) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.action();
                      if (onClose) onClose();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white hover:bg-white/[0.04] text-left"
                  >
                    <div className="flex items-center space-x-3.5">
                      <Icon className="w-4 h-4 flex-shrink-0 text-slate-400 stroke-[1.8]" />
                      <span className="tracking-tight">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#A3FF12] text-black rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.name + item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#A3FF12] text-black font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-black stroke-[2.5]' : 'text-slate-400 stroke-[1.8]'}`} />
                    <span className="tracking-tight">{item.name}</span>
                  </div>
                  {item.badge && !isActive && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-white/10 text-slate-300 rounded">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Separator */}
            <div className="pt-4 pb-2">
              <div className="h-[1px] bg-white/[0.06] mx-2" />
            </div>

            {/* Secondary links */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setShowSupportModal(true);
                  if (onClose) onClose();
                }}
                className="w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors text-left"
              >
                <LifeBuoy className="w-4 h-4 text-slate-400" />
                <span>Support</span>
              </button>

              <button
                onClick={() => {
                  setShowInfoModal(true);
                  if (onClose) onClose();
                }}
                className="w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors text-left"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>App info</span>
              </button>

              <NavLink
                to="/settings"
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#A3FF12] text-black font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Settings className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    <span>Settings</span>
                  </>
                )}
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Footer info text */}
        <div className="p-6 text-center space-y-1">
          <div className="text-[11px] font-medium text-slate-500">Version 1.0.4</div>
          <div className="text-[11px] font-medium text-slate-500">Design by Gopinath B</div>
        </div>

      </aside>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#13161C] border border-white/[0.08] p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2 text-[#A3FF12]">
                <LifeBuoy className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Help & Support</h3>
              </div>
              <button 
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                Need help with statement analytics, CSV ingestion, or AI financial health scores?
              </p>
              
              <div className="p-3 bg-black/40 rounded-2xl border border-white/[0.06] space-y-2">
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <Mail className="w-4 h-4 text-[#A3FF12]" />
                  <span>support@moneytrack.ai</span>
                </div>
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <Shield className="w-4 h-4 text-[#A3FF12]" />
                  <span>256-Bit Financial Encryption</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 text-xs font-bold bg-[#A3FF12] text-black rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#13161C] border border-white/[0.08] p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2 text-[#A3FF12]">
                <Info className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">About MoneyTrack</h3>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-black/40 rounded-2xl border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Application:</span>
                  <span className="font-bold text-white">MoneyTrack Smart Finance</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Version:</span>
                  <span className="font-bold text-[#A3FF12]">v1.0.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Design:</span>
                  <span className="text-white">Gopinath B</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 text-xs font-bold bg-[#A3FF12] text-black rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards Modal */}
      <CardsModal
        isOpen={showCardsModal}
        onClose={() => setShowCardsModal(false)}
      />
    </>
  );
};
