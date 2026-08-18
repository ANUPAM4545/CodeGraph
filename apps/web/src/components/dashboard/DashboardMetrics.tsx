'use client';

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Database, Activity, FileText, Share2 } from 'lucide-react';
import { DashboardMetrics as MetricsType } from '../../types/dashboard';

interface Props {
  metrics?: MetricsType;
  isLoading?: boolean;
}

export default function DashboardMetrics({ metrics, isLoading }: Props) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse bg-surface/50">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
              <div className="h-7 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Repositories */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Repositories</span>
            <Database className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.total_repositories.toLocaleString()}
          </div>
          <div className="text-xs text-muted flex items-center space-x-2">
            <span className="text-emerald-700 font-medium">{metrics.active_repositories} active</span>
            {metrics.analyzing_repositories > 0 && (
              <>
                <span>•</span>
                <span className="text-blue-600 font-medium">{metrics.analyzing_repositories} analyzing</span>
              </>
            )}
            {metrics.failed_repositories > 0 && (
              <>
                <span>•</span>
                <span className="text-red-600 font-medium">{metrics.failed_repositories} failed</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Analyses */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Analyses</span>
            <Activity className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.total_analyses.toLocaleString()}
          </div>
          <div className="text-xs text-muted flex items-center space-x-2">
            <span className="text-emerald-700 font-medium">{metrics.completed_analyses} completed</span>
            {metrics.running_analyses > 0 && (
              <>
                <span>•</span>
                <span className="text-blue-600 font-medium">{metrics.running_analyses} running</span>
              </>
            )}
            {metrics.failed_analyses > 0 && (
              <>
                <span>•</span>
                <span className="text-red-600 font-medium">{metrics.failed_analyses} failed</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Files Indexed */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Files Indexed</span>
            <FileText className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.total_files_indexed > 0 ? metrics.total_files_indexed.toLocaleString() : '0'}
          </div>
          <div className="text-xs text-muted">
            {metrics.total_files_indexed > 0 ? 'Across connected codebases' : 'No files indexed yet'}
          </div>
        </CardContent>
      </Card>

      {/* Code Entities */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Code Entities</span>
            <Share2 className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.total_code_entities > 0 ? metrics.total_code_entities.toLocaleString() : '0'}
          </div>
          <div className="text-xs text-muted">
            {metrics.total_code_entities > 0 ? 'Mapped in Neo4j knowledge graph' : 'No graph entities mapped'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
