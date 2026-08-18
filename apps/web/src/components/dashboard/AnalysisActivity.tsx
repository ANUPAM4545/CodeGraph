'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Clock, XCircle, AlertCircle, PlayCircle, GitCommit } from 'lucide-react';
import { AnalysisActivity as ActivityType } from '../../types/dashboard';
import { formatRelativeTime } from '../../lib/utils/formatDate';

interface Props {
  activities: ActivityType[];
  isLoading?: boolean;
}

export default function AnalysisActivity({ activities, isLoading }: Props) {
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'RUNNING':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'QUEUED':
      case 'PENDING':
        return <PlayCircle className="w-4 h-4 text-amber-600" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <Badge variant="secondary" className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 py-0 h-4">Completed</Badge>;
      case 'RUNNING':
        return <Badge variant="secondary" className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 py-0 h-4">Running</Badge>;
      case 'QUEUED':
      case 'PENDING':
        return <Badge variant="secondary" className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 py-0 h-4">Queued</Badge>;
      case 'FAILED':
        return <Badge variant="secondary" className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-100 py-0 h-4">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-[9px] font-bold py-0 h-4">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-2xs h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">Analysis Activity</CardTitle>
        <p className="text-xs text-muted mt-0.5">Real-time pipeline & indexing logs</p>
      </CardHeader>

      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-4 py-2 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-4 h-4 rounded-full bg-gray-200 mt-1" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-32 bg-gray-200 rounded" />
                  <div className="h-2.5 w-24 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-muted">
            <div className="text-xs font-medium">No analysis activity recorded yet.</div>
            <p className="text-[11px] text-muted mt-1">Start an analysis to view processing timeline.</p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {activities.map((act, idx) => {
              const commitShort = act.commit_sha ? act.commit_sha.substring(0, 7) : 'latest';
              const isLast = idx === activities.length - 1;

              return (
                <div key={act.id} className="relative flex items-start space-x-3">
                  {!isLast && (
                    <div className="absolute left-2 top-5 bottom-[-16px] w-px bg-border/80" />
                  )}

                  <div className="mt-0.5 flex-shrink-0 z-10 bg-background">
                    {getStatusIcon(act.status)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <Link 
                        href={`/repositories/${act.repository_id}`}
                        className="text-xs font-semibold text-foreground hover:underline truncate"
                      >
                        {act.repository_name}
                      </Link>
                      <span className="text-[10px] text-muted whitespace-nowrap">
                        {formatRelativeTime(act.completed_at || act.started_at || act.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 mt-1">
                      {getStatusBadge(act.status)}
                      <span className="text-[10px] font-mono text-muted flex items-center gap-0.5 bg-surface px-1.5 py-0.2 rounded border border-border">
                        <GitCommit className="w-2.5 h-2.5" />
                        <span>{commitShort}</span>
                      </span>
                      <span className="text-[10px] text-muted">• {act.job_type.replace('_', ' ')}</span>
                    </div>

                    {act.status === 'FAILED' && act.error && (
                      <p className="text-[10px] text-red-600 mt-1 bg-red-50/60 p-1.5 rounded border border-red-100 font-mono truncate">
                        {act.error}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
