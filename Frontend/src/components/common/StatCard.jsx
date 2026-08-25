import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../utils/cn';

export function StatCard({ title, value, icon: Icon, trend, trendValue, className, titleClassName, valueClassName, iconClassName }) {
  return (
    <Card className={className} whileHover={false}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn('text-sm font-medium text-white/45', titleClassName)}>{title}</p>
            <p className={cn('mt-2 font-display text-3xl font-semibold tracking-tight text-white', valueClassName)}>{value}</p>
          </div>
          {Icon && (
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-white/10',
                trend === 'up' && !iconClassName ? 'bg-cyan-500/15 text-income' :
                trend === 'down' && !iconClassName ? 'bg-fuchsia-500/15 text-expense' :
                !iconClassName ? 'bg-violet-500/15 text-violet-300' : '',
                iconClassName
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        {trendValue && (
          <div className="mt-4 flex items-center text-sm">
            <span
              className={cn(
                'font-medium',
                trend === 'up' ? 'text-income' : trend === 'down' ? 'text-expense' : 'text-white/45'
              )}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
            </span>
            <span className="ml-2 text-white/35">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
