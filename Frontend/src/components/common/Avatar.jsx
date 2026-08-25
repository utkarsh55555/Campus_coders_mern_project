import React from 'react';
import { cn } from '../../utils/cn';

export function Avatar({ src, alt, name, size = 'md', className }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className={cn("relative inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold overflow-hidden shrink-0", sizes[size], className)}>
      {src ? (
        <img src={src} alt={alt || name} className="h-full w-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
