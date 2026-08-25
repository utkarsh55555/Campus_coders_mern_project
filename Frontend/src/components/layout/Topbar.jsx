import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { motion } from 'framer-motion';

export function Topbar({ onMenuClick, title }) {
  const { currentUser } = useAuth();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-[#05020d]/75 px-4 backdrop-blur-xl sm:gap-x-6 sm:px-6 lg:px-8"
    >
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        className="-m-2.5 p-2.5 text-white/70 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </motion.button>

      <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch">
        <h1 className="truncate font-display text-xl font-semibold text-white">{title}</h1>

        <NavLink
          to="/profile"
          className="flex items-center gap-x-3 rounded-full border border-white/10 bg-white/5 p-1 pr-3 transition hover:bg-white/10"
        >
          <Avatar src={currentUser?.avatar} name={currentUser?.name} size="sm" />
          <span className="hidden text-sm font-medium text-white/80 lg:block">{currentUser?.name}</span>
        </NavLink>
      </div>
    </motion.header>
  );
}
