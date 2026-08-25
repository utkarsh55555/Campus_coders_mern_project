import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';

export function DashboardLayout() {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get title from path
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
    <div className="h-screen flex overflow-hidden bg-[#fafafb] dark:bg-zinc-900">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80 dark:bg-black/80" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-zinc-900">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
