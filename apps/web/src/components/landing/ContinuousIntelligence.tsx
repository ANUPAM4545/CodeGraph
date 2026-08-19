'use client';

import React from 'react';
import { 
  GitCommit, 
  Webhook, 
  GitCompare, 
  Binary, 
  Database, 
  Layers, 
  Radio,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const STAGES = [
  { step: '1', title: 'GitHub Push', desc: 'Commit webhook received with SHA metadata', icon: GitCommit },
  { step: '2', title: 'Change Detector', desc: 'Diff engine isolates modified AST nodes', icon: GitCompare },
  { step: '3', title: 'Incremental Analysis', desc: 'Tree-sitter re-extracts affected symbols only', icon: Binary },
  { step: '4', title: 'Graph & Vector Sync', desc: 'Neo4j edges & Qdrant vectors updated', icon: Database },
  { step: '5', title: 'Developer Sync', desc: 'Realtime WebSocket push to Web & IDEs', icon: Radio },
];

export default function ContinuousIntelligence() {
  return (
    <section className="py-20 md:py-28 bg-surface/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>CONTINUOUS INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Your architecture evolves with your code.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            CodeGraph preserves repository versions and incrementally synchronizes architectural intelligence every time code is pushed. Never rely on stale documentation again.
          </p>
        </div>

        {/* Pipeline Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div 
                key={stage.step}
                className="p-5 rounded-xl border border-border bg-background flex flex-col justify-between space-y-4 shadow-2xs relative group hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center font-mono text-[10px] font-bold text-foreground">
                    {stage.step}
                  </span>
                  <Icon className="w-4 h-4 text-muted group-hover:text-black transition-colors" />
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-foreground">{stage.title}</div>
                  <div className="text-[11px] text-muted font-sans leading-snug">{stage.desc}</div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>AUTOMATED</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
