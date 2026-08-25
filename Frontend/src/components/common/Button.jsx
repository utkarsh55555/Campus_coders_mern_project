import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: 'btn-aurora border-0 text-white',
    secondary: 'bg-white/5 text-white border border-white/15 hover:bg-white/10 hover:border-white/25',
    danger: 'bg-fuchsia-600/90 text-white hover:bg-fuchsia-500 shadow-[0_0_24px_-6px_rgba(217,70,239,0.5)]',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
    success: 'bg-cyan-500/90 text-white hover:bg-cyan-400 shadow-[0_0_24px_-6px_rgba(34,211,238,0.45)]',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-sm rounded-xl',
    md: 'px-5 py-2.5 rounded-xl text-sm',
    lg: 'px-7 py-3.5 text-base rounded-2xl',
  };

  return (
    <motion.button
      ref={ref}
      disabled={isLoading || props.disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.15 }}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
