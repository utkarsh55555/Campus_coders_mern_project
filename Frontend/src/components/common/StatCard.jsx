import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../utils/cn';

export function StatCard({ title, value, icon: Icon, trend, trendValue, className, titleClassName, valueClassName, iconClassName }) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-sm font-medium text-slate-500 dark:text-zinc-400", titleClassName)}>{title}</p>
            <p className={cn("mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white", valueClassName)}>{value}</p>
          </div>
          {Icon && (
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              trend === 'up' && !iconClassName ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
              trend === 'down' && !iconClassName ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" :
              !iconClassName ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400" : "",
              iconClassName
            )}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        {trendValue && (
          <div className="mt-4 flex items-center text-sm">
            <span className={cn(
              "font-medium",
              trend === 'up' ? "text-emerald-600 dark:text-emerald-400" :
              trend === 'down' ? "text-red-600 dark:text-red-400" :
              "text-slate-500 dark:text-zinc-400"
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
            </span>
            <span className="ml-2 text-slate-500 dark:text-zinc-400">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
