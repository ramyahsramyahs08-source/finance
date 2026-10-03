import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User as UserIcon, X, CheckCircle2, Sparkles, ArrowRight, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onOpenSidebar, onOpenAddTransaction }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#0B0D11]/90 backdrop-blur-md px-6 lg:px-10 py-4 flex items-center justify-between">
      
      {/* Left Area: Mobile Menu */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Area: Bell & Avatar */}
      <div className="flex items-center space-x-4">
        
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full bg-[#13161C] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-slate-300 hover:text-white relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#A3FF12] ring-2 ring-[#0B0D11]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#13161C] border border-white/[0.08] rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 font-bold text-white">
                <span>Alerts</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] space-y-1">
                <span className="text-[#A3FF12] font-semibold">Weekly Ingestion Ready</span>
                <p className="text-slate-400 text-[11px]">Recent bank statements synced successfully.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1 rounded-full bg-[#13161C] border border-white/[0.06] hover:border-white/[0.15] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#A3FF12] to-emerald-600 flex items-center justify-center font-bold text-black text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#13161C] border border-white/[0.08] rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <p className="font-bold text-white truncate">{user?.name || 'Gopinath B'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'gopinath@moneytrack.ai'}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.04]"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
