'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { CodebaseHealthMetric } from '../../types/dashboard';

interface Props {
  healthMetrics: CodebaseHealthMetric[];
  isLoading?: boolean;
}

export default function CodebaseHealth({ healthMetrics, isLoading }: Props) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge variant="secondary" className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 flex items-center gap-1 py-0 h-4">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Healthy</span>
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="secondary" className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 flex items-center gap-1 py-0 h-4">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Warning</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[9px] font-bold text-gray-400 py-0 h-4">
            Not available
          </Badge>
        );
    }
  };

  return (
    <Card className="shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground">Codebase Knowledge Health</CardTitle>
          <p className="text-xs text-muted mt-0.5">Authoritative graph indexing and relationship coverage</p>
        </div>
        <Link href="/analytics">
          <Button variant="ghost" size="sm" className="text-xs text-muted hover:text-foreground">
            <span>Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-3.5 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-2.5 w-32 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : healthMetrics.length === 0 ? (
          <div className="py-6 text-center text-muted text-xs">
            No health metrics available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((m, idx) => (
              <div 
                key={idx} 
                className="p-3.5 bg-surface/60 rounded-xl border border-border/80 space-y-2 hover:border-border transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">{m.metric_name}</span>
                  {getStatusBadge(m.status)}
                </div>

                <div className="text-xl font-bold text-foreground tracking-tight">
                  {m.value}
                </div>

                {m.explanation && (
                  <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                    {m.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
