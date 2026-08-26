import React from 'react';

import { NavLink } from 'react-router-dom';

import { Menu, Sun, Moon } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

import { useTheme } from '../../context/ThemeContext';

import { Avatar } from '../common/Avatar';

import { motion } from 'framer-motion';



export function Topbar({ onMenuClick, title }) {

  const { currentUser } = useAuth();

  const { theme, toggleTheme } = useTheme();



  return (

    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-4 sm:gap-x-6 sm:px-6 lg:px-8">

      <button

        type="button"

        className="-m-2.5 p-2.5 text-slate-700 dark:text-zinc-200 lg:hidden"

        onClick={onMenuClick}

      >

        <span className="sr-only">Open sidebar</span>

        <Menu className="h-6 w-6" aria-hidden="true" />

      </button>



      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-between">

        {/* Page Title */}

        <div className="flex-1 flex items-center">

          <h1 className="text-xl font-semibold text-slate-900 dark:text-white truncate">

            {title}

          </h1>

        </div>



        <div className="flex items-center gap-x-4 lg:gap-x-6">

          <button 

            type="button" 

            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"

            onClick={toggleTheme}

          >

            <span className="sr-only">Toggle theme</span>

            {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}

          </button>



          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-zinc-700" aria-hidden="true" />



          {/* Profile */}

          <NavLink to="/profile" className="flex items-center gap-x-3 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800/50 p-1 pr-2 transition-colors">

            <Avatar src={currentUser?.avatar} name={currentUser?.name} size="sm" />

            <span className="hidden lg:flex lg:items-center">

              <span className="text-sm font-medium leading-6 text-slate-900 dark:text-white" aria-hidden="true">

                {currentUser?.name}

              </span>

            </span>

          </NavLink>

        </div>

      </div>

    </header>

  );

}

