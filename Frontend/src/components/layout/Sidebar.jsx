import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, PieChart, User, LogOut, WalletCards } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Budgets', href: '/budgets', icon: WalletCards },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar({ className, onClose }) {
  const { logout, currentUser } = useAuth();

  return (
    <div className={cn("flex h-full flex-col bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shadow-sm w-64", className)}>
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-50 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-500">
          <WalletCards className="h-8 w-8" />
          <span className="text-xl font-bold dark:text-white">ExpenseFlow</span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl",
                  isActive 
                    ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400" 
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={cn(
                        "mr-3 h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-zinc-500 group-hover:text-primary-500 dark:group-hover:text-primary-400"
                      )} 
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t border-gray-50 dark:border-zinc-800 p-4">
        <div className="flex items-center mb-4 px-2">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-zinc-700 ring-offset-2 dark:ring-offset-zinc-900">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{currentUser?.name}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 truncate w-32">{currentUser?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-600" />
          Log out
        </button>
      </div>
    </div>
  );
}
