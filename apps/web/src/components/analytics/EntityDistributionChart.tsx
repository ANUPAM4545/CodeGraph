'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EntityDistribution } from '../../types/analytics';

interface Props {
  distribution: EntityDistribution[];
  isLoading?: boolean;
}

export default function EntityDistributionChart({ distribution, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="shadow-2xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalEntities = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="shadow-2xs h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-foreground">Entity Type Distribution</CardTitle>
            <span className="text-xs text-muted font-mono">{totalEntities.toLocaleString()} total nodes</span>
          </div>
          <p className="text-xs text-muted mt-0.5">AST node breakdown parsed into the knowledge graph</p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Multi-segment visual bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-surface border border-border/80 shadow-2xs">
            {distribution.map(item => (
              <div
                key={item.entity_type}
                style={{
                  width: `${Math.max(item.percentage, 1)}%`,
                  backgroundColor: item.color
                }}
                title={`${item.entity_type}: ${item.count} (${item.percentage}%)`}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full hover:opacity-85"
              />
            ))}
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2 divide-y divide-border/60">
            {distribution.map(item => (
              <div key={item.entity_type} className="flex items-center justify-between pt-2 first:pt-0">
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-foreground">{item.entity_type}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-foreground">
                    {item.count.toLocaleString()}
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-mono py-0 h-4 px-1.5 bg-surface text-muted border border-border">
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
