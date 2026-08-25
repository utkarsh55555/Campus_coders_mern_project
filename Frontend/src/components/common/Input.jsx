import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder:text-white/35 shadow-sm transition-all duration-200 hover:border-white/20 focus:border-violet-400/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-fuchsia-400/60 focus:border-fuchsia-400 focus:ring-fuchsia-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-fuchsia-300">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
