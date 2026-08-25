import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';

import { DashboardLayout } from './components/layout/DashboardLayout';
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

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <FinanceProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/add" element={<AddTransaction />} />
                <Route path="/transactions/edit/:id" element={<AddTransaction />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/create" element={<CreateGroup />} />
                <Route path="/groups/:groupId" element={<GroupDetails />} />
                <Route path="/groups/:groupId/add-expense" element={<AddGroupExpense />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="flex h-screen items-center justify-center flex-col">
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
                  <p className="text-slate-600 mb-4">Page not found</p>
                  <a href="/" className="text-indigo-600 hover:text-indigo-500">Go back home</a>
                </div>
              } />
            </Routes>
          </FinanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
