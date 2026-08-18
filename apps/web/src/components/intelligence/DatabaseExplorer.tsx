'use client';

import React from 'react';
import { 
  Database, 
  Table, 
  FileCode2, 
  Layers 
} from 'lucide-react';
import { DbModel } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DatabaseExplorerProps {
  models: DbModel[];
}

export default function DatabaseExplorer({ models }: DatabaseExplorerProps) {
  if (!models || models.length === 0) {
    return (
      <Card className="bg-white border-border shadow-xs">
        <CardContent className="p-8 text-center text-muted text-xs">
          No explicit database models or ORM schemas detected in this repository version.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Database Models & Schemas</span>
            </CardTitle>
            <p className="text-xs text-muted mt-0.5">
              ORM entities, relational tables, and schema definitions discovered across the codebase.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {models.length} Models Indexed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {models.map((model, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-surface/30 border border-border/80 hover:bg-surface hover:border-border transition-all space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Table className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold font-mono text-foreground text-xs truncate">{model.name}</span>
                </div>
                <Badge variant="outline" className="text-[9px] py-0 h-4 font-mono uppercase flex-shrink-0">
                  {model.orm_framework.split('/')[0]}
                </Badge>
              </div>

              {model.table_name && (
                <div className="text-[11px] text-muted font-mono flex items-center gap-1.5">
                  <span className="text-gray-500">Table:</span>
                  <span className="font-bold text-gray-800 bg-white px-1.5 py-0.5 rounded border border-border/60">
                    {model.table_name}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-border/60 flex items-center gap-1.5 text-[10px] text-muted font-mono">
                <FileCode2 className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="truncate">{model.source_file}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
