'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Files, 
  Code2, 
  Repeat, 
  Network, 
  Layers, 
  DoorOpen 
} from 'lucide-react';
import { HealthMetrics } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface RepositoryHealthProps {
  health?: HealthMetrics | null;
  evidenceSources: string[];
}

export default function RepositoryHealth({ health, evidenceSources }: RepositoryHealthProps) {
  if (!health) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Code Metrics Grid */}
      <Card className="lg:col-span-2 bg-white border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Codebase Metrics & Telemetry</span>
            </CardTitle>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-mono text-xs">
              Health Grade {health.health_grade} ({health.health_score}/100)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface/50 border border-border/80 space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted block flex items-center gap-1">
                <Files className="w-3 h-3 text-primary" /> Files
              </span>
              <span className="text-lg font-black text-gray-900">{health.total_files.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface/50 border border-border/80 space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted block flex items-center gap-1">
                <Code2 className="w-3 h-3 text-purple-600" /> Functions
              </span>
              <span className="text-lg font-black text-gray-900">{health.total_functions.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface/50 border border-border/80 space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted block flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-600" /> Classes
              </span>
              <span className="text-lg font-black text-gray-900">{health.total_classes.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface/50 border border-border/80 space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted block flex items-center gap-1">
                <Network className="w-3 h-3 text-orange-600" /> AST Nodes
              </span>
              <span className="text-lg font-black text-gray-900">{health.total_ast_nodes.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sources & Provenance */}
      <Card className="bg-white border-border shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-foreground">
            Analysis Evidence Sources
          </CardTitle>
          <p className="text-xs text-muted">Artifacts parsed to construct this intelligence layer.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            {evidenceSources.map((src, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-surface/40 border border-border/70 font-mono text-[11px] text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="truncate">{src}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
