import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export function Card({ className, children, whileHover = false, ...props }) {
  return (
    <motion.div
      initial={false}
      className={cn(
        'overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-premium backdrop-blur-sm transition-shadow duration-200 hover:border-white/15 hover:shadow-premium-hover',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 border-b border-white/5 px-6 py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('font-display font-semibold leading-none tracking-tight text-white', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pt-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center border-t border-white/5 bg-white/[0.02] px-6 py-5', className)} {...props}>
      {children}
    </div>
  );
}
