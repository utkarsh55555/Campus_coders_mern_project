import React from 'react';
import { cn } from '../../utils/cn';

export function Loader({ className, size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className={cn(
          "animate-spin rounded-full border-t-indigo-600 border-slate-200", 
          sizes[size], 
          className
        )} 
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <Loader size="lg" />
    </div>
  );
}
