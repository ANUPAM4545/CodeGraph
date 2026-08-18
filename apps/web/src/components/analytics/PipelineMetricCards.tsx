'use client';

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Share2, Network, FileText, Zap, CheckCircle2 } from 'lucide-react';
import { PipelineMetrics } from '../../types/analytics';
import { formatRelativeTime } from '../../lib/utils/formatDate';

interface Props {
  metrics?: PipelineMetrics;
  isLoading?: boolean;
}

export default function PipelineMetricCards({ metrics, isLoading }: Props) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse bg-surface/50">
            <CardContent className="p-5 space-y-3">
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-7 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-36 bg-gray-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const durationText = metrics.last_analysis_duration_seconds !== null 
    ? `${metrics.last_analysis_duration_seconds}s execution` 
    : 'Live indexed';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Knowledge Graph Entities */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Code Entities</span>
            <Share2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.total_entities.toLocaleString()}
          </div>
          <div className="text-xs text-muted flex items-center space-x-1.5">
            <span className="text-blue-700 font-medium font-mono">AST Nodes in Neo4j</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Graph Structural Relationships */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Graph Relationships</span>
            <Network className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.total_relationships.toLocaleString()}
          </div>
          <div className="text-xs text-muted flex items-center space-x-1.5">
            <span className="text-purple-700 font-medium font-mono">Imports & Definitions</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Indexed Files */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Parsed Source Files</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.total_files_indexed.toLocaleString()}
          </div>
          <div className="text-xs text-muted flex items-center space-x-1.5">
            <span className="text-emerald-700 font-medium">100% Tree-sitter parsed</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Analysis Pipeline Health & Duration */}
      <Card className="hover:border-border/80 transition-colors shadow-2xs">
        <CardContent className="p-5 space-y-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Pipeline Performance</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {metrics.success_rate}%
          </div>
          <div className="text-xs text-muted flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-foreground font-medium">{durationText}</span>
            <span>•</span>
            <span>{formatRelativeTime(metrics.last_analyzed_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
