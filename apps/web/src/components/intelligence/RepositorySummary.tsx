'use client';

import React from 'react';
import { 
  FileText, 
  Target, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { RepoIntelligence } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface RepositorySummaryProps {
  data: RepoIntelligence;
}

export default function RepositorySummary({ data }: RepositorySummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* What it Does & Executive Summary */}
      <Card className="lg:col-span-2 bg-white border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>What this Repository Does</span>
            </CardTitle>
            <div className="flex items-center gap-1 text-[11px] text-muted font-mono">
              <span>Sources:</span>
              {data.summary_sources.map((s, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] py-0 h-4">{s}</Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-gray-700 leading-relaxed">
          <p className="text-sm font-normal text-gray-800 bg-surface/40 p-4 rounded-xl border border-border/80 leading-relaxed">
            {data.summary}
          </p>

          <div className="space-y-1.5">
            <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Core Purpose</span>
            <p className="text-muted leading-relaxed">
              {data.purpose}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Problem & Solution Card */}
      <Card className="bg-white border-border shadow-xs flex flex-col justify-between">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-600" />
            <span>Problem & Solution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3.5 text-xs">
          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span>Problem Solved</span>
            </span>
            <p className="text-orange-900 leading-relaxed">
              {data.problem_statement}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Implemented Solution</span>
            </span>
            <p className="text-emerald-900 leading-relaxed">
              {data.solution_statement}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
