import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { QueryProvider } from './providers/QueryProvider';

import { DashboardLayout } from './components/layout/DashboardLayout';
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/transactions/Transactions';
import AddTransaction from './pages/transactions/AddTransaction';

import Groups from './pages/groups/Groups';
import CreateGroup from './pages/groups/CreateGroup';
import GroupDetails from './pages/groups/GroupDetails';
import AddGroupExpense from './pages/groups/AddGroupExpense';

import Budgets from './pages/budgets/Budgets';
import Analytics from './pages/analytics/Analytics';
import Profile from './pages/profile/Profile';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
};

function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/transactions" element={<PageTransition><Transactions /></PageTransition>} />
          <Route path="/transactions/add" element={<PageTransition><AddTransaction /></PageTransition>} />
          <Route path="/transactions/edit/:id" element={<PageTransition><AddTransaction /></PageTransition>} />
          <Route path="/groups" element={<PageTransition><Groups /></PageTransition>} />
          <Route path="/groups/create" element={<PageTransition><CreateGroup /></PageTransition>} />
          <Route path="/groups/:groupId" element={<PageTransition><GroupDetails /></PageTransition>} />
          <Route path="/groups/:groupId/add-expense" element={<PageTransition><AddGroupExpense /></PageTransition>} />
          <Route path="/budgets" element={<PageTransition><Budgets /></PageTransition>} />
          <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        </Route>

        <Route
          path="*"
          element={
            <PageTransition>
              <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="font-display text-4xl font-bold text-white">404</h1>
                <p className="mt-2 text-white/50">Page not found</p>
                <a href="/" className="mt-4 text-violet-300 hover:text-fuchsia-300">
                  Back to ExpenseFlow
                </a>
              </div>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <FinanceProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'font-sans text-sm',
                  style: {
                    borderRadius: '12px',
                    border: '1px solid #d9e2ec',
                  },
                }}
              />
              <AppContent />
            </FinanceProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </Router>
  );
}

export default App;
