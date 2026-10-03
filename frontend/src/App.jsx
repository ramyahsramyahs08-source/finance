import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CsvUploadPage } from './pages/CsvUploadPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AIAdvisorPage } from './pages/AIAdvisorPage';
import { GoalsPage } from './pages/GoalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TransactionModal } from './components/TransactionModal';
import { LoadingSpinner } from './components/LoadingSpinner';

// Protected Layout Route
const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addTxnModalOpen, setAddTxnModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B11] flex items-center justify-center">
        <LoadingSpinner label="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Responsive Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        <Navbar 
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddTransaction={() => setAddTxnModalOpen(true)}
        />

        <main className="flex-1 px-6 lg:px-10 py-6 max-w-[1600px] w-full mx-auto">
          <Outlet context={{ refreshSignal: Date.now() }} />
        </main>
      </div>

      {/* Global Quick Transaction Modal */}
      <TransactionModal
        isOpen={addTxnModalOpen}
        onClose={() => setAddTxnModalOpen(false)}
        onSuccess={() => {
          // Trigger reload or update
          window.location.reload();
        }}
      />
    </div>
  );
};

// Public Only Route (e.g. login, register when already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

            {/* Protected SaaS App Pages */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/csv-upload" element={<CsvUploadPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/advisor" element={<AIAdvisorPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
