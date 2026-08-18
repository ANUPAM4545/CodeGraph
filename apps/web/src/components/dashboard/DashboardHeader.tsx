'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Plus, RefreshCw, Building2 } from 'lucide-react';

interface Props {
  orgName?: string;
  plan?: string;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export default function DashboardHeader({
  orgName,
  plan = 'Enterprise',
  isRefreshing,
  lastUpdated,
  onRefresh
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          {orgName && (
            <Badge variant="outline" className="text-xs font-semibold flex items-center gap-1">
              <Building2 className="w-3 h-3 text-muted" />
              <span>{orgName}</span>
            </Badge>
          )}
          <Badge variant="secondary" className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border border-blue-100">
            {plan}
          </Badge>
        </div>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Real-time code intelligence, architecture graphs, and analysis metrics.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground bg-surface hover:bg-surface/80 border border-border rounded-lg transition-colors disabled:opacity-50 select-none shadow-2xs"
          title="Refresh dashboard data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-foreground' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : lastUpdated ? 'Updated just now' : 'Refresh'}</span>
        </button>

        <Link href="/repositories/import">
          <Button size="md" className="gap-1.5 text-xs sm:text-sm font-semibold shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Add Repository</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
