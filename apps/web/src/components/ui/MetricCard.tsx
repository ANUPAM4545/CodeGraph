import React from 'react';
import { Card, CardContent } from './Card';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, trend, trendDirection = 'neutral', icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-muted tracking-tight">{title}</h3>
          {icon && <div className="text-muted">{icon}</div>}
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <p className={`text-xs flex items-center gap-1 ${
              trendDirection === 'up' ? 'text-green-600' : 
              trendDirection === 'down' ? 'text-red-600' : 'text-muted'
            }`}>
              {trendDirection === 'up' && '↗'}
              {trendDirection === 'down' && '↘'}
              {trend}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
