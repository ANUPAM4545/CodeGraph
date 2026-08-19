'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  GitCommit, 
  Webhook, 
  GitCompare, 
  Binary, 
  Database, 
  Layers, 
  Radio,
  ArrowRight,
  CheckCircle2,
  Zap,
  RefreshCw
} from 'lucide-react';

const STAGES = [
  { step: '01', title: 'GitHub Push', desc: 'Commit webhook received with SHA metadata', icon: GitCommit },
  { step: '02', title: 'Change Detector', desc: 'Diff engine isolates modified AST nodes', icon: GitCompare },
  { step: '03', title: 'Incremental Analysis', desc: 'Tree-sitter re-extracts affected symbols only', icon: Binary },
  { step: '04', title: 'Graph & Vector Sync', desc: 'Neo4j edges & Qdrant vectors updated', icon: Database },
  { step: '05', title: 'Developer Sync', desc: 'Realtime WebSocket push to Web & IDEs', icon: Radio },
];

export default function ContinuousIntelligence() {
  return (
    <section className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CONTINUOUS INTELLIGENCE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Evolves with your code.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            CodeGraph preserves repository versions and incrementally synchronizes architectural intelligence every time code is pushed. Never rely on stale documentation again.
          </p>
        </div>

        {/* 5-Stage Pipeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;

            return (
              <motion.div 
                key={stage.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 rounded-2xl border border-border bg-background flex flex-col justify-between space-y-4 shadow-2xs group hover:border-black hover:shadow-md transition-all cursor-default"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-mono text-xs font-black text-foreground group-hover:bg-black group-hover:text-white transition-colors">
                    {stage.step}
                  </span>
                  <Icon className="w-4 h-4 text-muted group-hover:text-black transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <div className="font-mono text-xs font-extrabold text-foreground">{stage.title}</div>
                  <div className="text-[11px] text-muted font-sans leading-snug">{stage.desc}</div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>Latency: &lt;1.2s</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
