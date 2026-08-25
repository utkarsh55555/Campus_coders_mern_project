import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-white/10 text-white/80',
    success: 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20',
    danger: 'bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-400/20',
    warning: 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20',
    info: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20',
    indigo: 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20',
  };

  return (
    <span className={cn('inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
