import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow hover:-translate-y-0.5 active:scale-95',
    secondary: 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 hover:shadow active:scale-95',
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95',
    ghost: 'bg-transparent text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 active:scale-95',
    success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-5 py-2.5 rounded-lg',
    lg: 'px-8 py-3.5 text-lg rounded-xl'
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-sm',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
