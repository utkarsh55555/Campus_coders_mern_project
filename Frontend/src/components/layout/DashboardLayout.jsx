import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export function DashboardLayout() {
  const { currentUser } = useAuth();
  const { refresh } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    refresh().catch(() => {
      /* toast handled in FinanceContext */
    });
  }, [refresh]);

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/transactions')) return 'Transactions';
    if (path.startsWith('/groups')) return 'Groups';
    if (path.startsWith('/budgets')) return 'Budgets';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/profile')) return 'Profile';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#05020d]">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex lg:hidden">
            <div className="fixed inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex w-full max-w-xs flex-1 flex-col"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto h-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
