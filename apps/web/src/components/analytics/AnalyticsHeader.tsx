'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RefreshCw, Activity, Github, GitCommit } from 'lucide-react';
import { Repository } from '../../lib/api/repositories';

interface Props {
  repositories: Repository[];
  selectedRepoId: string | null;
  onSelectRepo: (repoId: string) => void;
  commitSha: string | null;
  branch: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function AnalyticsHeader({
  repositories,
  selectedRepoId,
  onSelectRepo,
  commitSha,
  branch,
  isRefreshing,
  onRefresh
}: Props) {
  const commitShort = commitSha ? commitSha.substring(0, 7) : 'latest';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
      <div>
        <div className="flex items-center space-x-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Codebase Analytics
          </h1>
          <Badge variant="secondary" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 flex items-center gap-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Live</span>
          </Badge>
        </div>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Deep architectural metrics, knowledge graph distribution, dependency fan-in, and code density.
        </p>
      </div>

      <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
        {/* Repository Dropdown */}
        {repositories.length > 0 && (
          <div className="relative">
            <select
              value={selectedRepoId || ''}
              onChange={e => onSelectRepo(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-surface hover:bg-surface/80 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs cursor-pointer"
            >
              {repositories.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {commitSha && (
          <Badge variant="outline" className="text-xs font-mono py-1 px-2.5 gap-1.5 flex items-center shadow-2xs">
            <GitCommit className="w-3.5 h-3.5 text-muted" />
            <span>{branch || 'main'}</span>
            <span className="text-muted">•</span>
            <span className="text-foreground font-semibold">{commitShort}</span>
          </Badge>
        )}

        {/* Live Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground bg-surface hover:bg-surface/80 border border-border rounded-lg transition-colors disabled:opacity-50 select-none shadow-2xs"
          title="Refresh analytics data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-foreground' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Live Sync'}</span>
        </button>
      </div>
    </div>
  );
}
