import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-white dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700/50 shadow-sm hover:shadow transition-shadow duration-300 overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5 border-b border-gray-50 dark:border-zinc-700/50 flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("font-semibold leading-none tracking-tight text-slate-900 dark:text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-gray-50 dark:border-zinc-700/50 flex items-center", className)} {...props}>
      {children}
    </div>
  );
}
