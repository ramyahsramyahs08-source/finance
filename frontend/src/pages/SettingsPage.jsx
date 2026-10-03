import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Sparkles, 
  Trash2, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  IndianRupee, 
  Mail,
  AlertTriangle
} from 'lucide-react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { success, error, info } = useToast();

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    currency: user?.currency || 'INR',
    monthly_budget: user?.monthly_budget || '55000'
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Demo seed & Reset states
  const [seeding, setSeeding] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        currency: user.currency || 'INR',
        monthly_budget: user.monthly_budget ? user.monthly_budget.toString() : '55000'
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userService.updateProfile(profileForm);
      if (res.success && res.data) {
        updateUser(res.data);
        success('Profile settings updated successfully');
      }
    } catch (err) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      error('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      error('New password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await userService.updatePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      success('Password updated successfully');
      setPasswordForm({ current_password: '', new_password: '', confirm_new_password: '' });
    } catch (err) {
      error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      await userService.seedDemoData();
      success('Populated 6 months of realistic transactions and goals!');
    } catch (err) {
      error(err.message || 'Failed to seed demo data');
    } finally {
      setSeeding(false);
    }
  };

  const handleResetData = async () => {
    setResetLoading(true);
    try {
      await userService.resetData();
      success('All transactions and goals have been reset');
      setResetDialogOpen(false);
    } catch (err) {
      error(err.message || 'Failed to reset data');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Account & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details, security credentials, and demonstration environments
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">User Profile</h3>
            <p className="text-xs text-slate-400">Personal details and default currency preferences</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm opacity-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Monthly Budget Target (₹)
              </label>
              <input
                type="number"
                value={profileForm.monthly_budget}
                onChange={(e) => setProfileForm({ ...profileForm, monthly_budget: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Currency
              </label>
              <select
                value={profileForm.currency}
                onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 text-slate-200"
              >
                <option value="INR">Indian Rupee (INR ₹)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all disabled:opacity-50"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password & Security Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Security & Password</h3>
            <p className="text-xs text-slate-400">Update your account authentication credentials</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              placeholder="••••••••"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password (min 6 chars)</label>
              <input
                type="password"
                required
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                placeholder="••••••••"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirm_new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_new_password: e.target.value })}
                placeholder="••••••••"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all disabled:opacity-50"
            >
              {savingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data & Environment Utilities */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Data Management & Demo Utilities</h3>
            <p className="text-xs text-slate-400">Generate realistic sample datasets or reset account records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Seed Demo Data Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-indigo-400" />
                Populate 6-Month Demo Data
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Injects 180 days of realistic Indian merchant transactions (Swiggy, Amazon, Uber, Salary, Rent, Electricity) and 4 financial goals for comprehensive exploration.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSeedDemoData}
              disabled={seeding}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all disabled:opacity-50"
            >
              {seeding ? 'Generating Transactions...' : 'Inject Demo Dataset'}
            </button>
          </div>

          {/* Wipe / Reset Data Card */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Reset Account Transactions
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permanently wipes all transactions, statements, and financial goals for your user account so you can start with a fresh clean slate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResetDialogOpen(true)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-600/80 hover:bg-rose-600 text-white transition-all"
            >
              Wipe Account Data
            </button>
          </div>

        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Financial Data?"
        message="This action will delete all your recorded transactions, uploaded CSV statements, and financial goals. Your account login credentials will remain intact."
        confirmLabel="Confirm Full Reset"
        confirmVariant="danger"
        loading={resetLoading}
      />

    </div>
  );
};
