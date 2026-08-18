'use client';

import React from 'react';
import { 
  FolderTree, 
  Layers, 
  ShieldCheck, 
  GitBranch 
} from 'lucide-react';
import { SubsystemInfo } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ArchitectureSummaryProps {
  subsystems: SubsystemInfo[];
}

export default function ArchitectureSummary({ subsystems }: ArchitectureSummaryProps) {
  if (!subsystems || subsystems.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-primary" />
              <span>Architectural Modules & Subsystems</span>
            </CardTitle>
            <p className="text-xs text-muted mt-0.5">
              High-level structural partition of files, code symbols, and component boundaries.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {subsystems.length} Subsystems
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {subsystems.map((sub, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-surface/40 border border-border/80 hover:bg-surface transition-all flex flex-col justify-between space-y-2.5 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-foreground font-mono text-xs truncate block">{sub.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-[9px] py-0 h-4 uppercase font-semibold ${
                      sub.status === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {sub.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  {sub.responsibility}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted font-mono">
                <span>{sub.files_count} files · {sub.symbols_count} symbols</span>
                <span className="font-semibold text-gray-800">Coupling: {sub.coupling_ratio}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
