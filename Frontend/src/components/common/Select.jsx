import React from 'react';
import { cn } from '../../utils/cn';

export const Select = React.forwardRef(({ className, label, error, options, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-slate-200/80 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
