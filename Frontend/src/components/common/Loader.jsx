import React from 'react';
import { cn } from '../../utils/cn';
import { LottieLoader } from './LottieIcon';

export function Loader({ className, size = 'md' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <LottieLoader size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} className={sizes[size]} />
    </div>
  );
}

export { PageLoader } from './LottieIcon';
