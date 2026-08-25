import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, PieChart, User, LogOut, WalletCards } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'flex h-full w-64 flex-col border-r border-white/10 bg-[#0a0618]/90 shadow-premium backdrop-blur-xl',
        className
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-white/8 px-6">
        <div className="flex items-center gap-2.5 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/40 to-violet-600/40 ring-1 ring-white/15">
            <WalletCards className="h-5 w-5 text-fuchsia-200" />
          </div>
          <span className="font-display text-lg font-bold">
            Expense<span className="aurora-text">Flow</span>
          </span>
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
                className={({ isActive }) =>
                  cn(
                    'group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-500/20 to-violet-600/15 text-white shadow-[0_0_24px_-10px_rgba(168,85,247,0.6)] ring-1 ring-violet-400/25'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('mr-3 h-5 w-5 shrink-0', isActive ? 'text-fuchsia-300' : 'text-white/35 group-hover:text-violet-300')} />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/8 p-4">
        <div className="mb-4 flex items-center px-2">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-violet-400/30 ring-offset-2 ring-offset-[#0a0618]">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{currentUser?.name}</p>
            <p className="w-32 truncate text-xs text-white/40">{currentUser?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-white/50 transition hover:bg-fuchsia-500/10 hover:text-fuchsia-300"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </button>
      </div>
    </motion.div>
  );
}
