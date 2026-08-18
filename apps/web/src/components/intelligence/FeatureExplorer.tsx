'use client';

import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  FileCode2, 
  ShieldCheck, 
  Tag 
} from 'lucide-react';
import { FeatureItem } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface FeatureExplorerProps {
  features: FeatureItem[];
}

export default function FeatureExplorer({ features }: FeatureExplorerProps) {
  if (!features || features.length === 0) {
    return (
      <Card className="bg-white border-border shadow-xs">
        <CardContent className="p-8 text-center text-muted text-xs">
          No explicit features detected from repository documentation or AST modules.
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
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Core Features & Capabilities</span>
            </CardTitle>
            <p className="text-xs text-muted mt-0.5">
              Verified software capabilities backed by concrete source files, models, and API routes.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {features.length} Capabilities Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-white border border-border/90 hover:border-primary/50 transition-all flex flex-col justify-between space-y-3 shadow-2xs group"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-foreground text-xs leading-snug group-hover:text-primary transition-colors">
                    {feat.name}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] py-0 h-4 font-bold flex-shrink-0"
                  >
                    {feat.confidence} Confidence
                  </Badge>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>

              {/* Evidence Files */}
              {feat.evidence_files && feat.evidence_files.length > 0 && (
                <div className="pt-2 border-t border-border/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                    Verified Evidence
                  </span>
                  <div className="space-y-0.5">
                    {feat.evidence_files.map((file, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-700 truncate">
                        <FileCode2 className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="truncate">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
