import React from 'react';
import { cn } from '../../utils/cn';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
          <Icon className="h-6 w-6 text-slate-500" />
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
