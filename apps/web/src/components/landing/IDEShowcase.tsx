'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Code2, 
  Layers, 
  Sparkles, 
  ShieldAlert, 
  ActivitySquare, 
  ArrowRight,
  CheckCircle2,
  Box,
  FileCode
} from 'lucide-react';
import { Button } from '../ui/Button';

export default function IDEShowcase() {
  return (
    <section id="ide" className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
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
            <span>VS CODE EXTENSION & IDE PROTOCOL</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Intelligence in your editor.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Never context-switch to the browser. CodeGraph delivers ambient architectural CodeLens annotations, blast-radius hovers, and an AI copilot sidebar inside VS Code.
          </p>
        </div>

        {/* macOS Style VS Code Window */}
        <div className="rounded-3xl border border-border bg-background overflow-hidden shadow-2xl font-mono text-xs max-w-5xl mx-auto">
          
          {/* Editor Header Bar */}
          <div className="h-12 bg-surface border-b border-border px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <span className="text-muted ml-3 hidden sm:inline">Visual Studio Code · <span className="text-foreground font-bold">src/services/dispute.ts</span></span>
            </div>
            <span className="text-[10px] text-muted font-bold bg-background px-2.5 py-0.5 rounded-full border border-border">
              CodeGraph VS Code Extension v1.0
            </span>
          </div>

          {/* Editor Body Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            
            {/* Code Editor Column (8 cols) */}
            <div className="lg:col-span-8 p-6 sm:p-8 space-y-4 border-b lg:border-b-0 lg:border-r border-border bg-background">
              
              {/* CodeLens Annotation 1 */}
              <div className="flex items-center gap-3 text-[11px] text-muted bg-surface px-3 py-1.5 rounded-xl border border-border w-fit shadow-2xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <ActivitySquare className="w-3.5 h-3.5 text-red-500" />
                  <span>Blast Radius: 14 Callers</span>
                </span>
                <span>·</span>
                <span className="text-red-600 font-bold">HIGH RISK</span>
                <span>·</span>
                <span className="text-purple-600 font-bold">Ask AI Copilot ➔</span>
              </div>

              {/* Code Block Snippet */}
              <div className="space-y-1 text-xs text-foreground font-mono leading-relaxed pl-2 border-l-2 border-emerald-500/60">
                <div><span className="text-purple-600 font-bold">export class</span> <span className="font-black text-foreground">DisputeOrchestrator</span> &#123;</div>
                <div className="pl-4 text-muted">{'// Manages dispute transitions & double-entry reconciliation'}</div>
                <div className="pl-4"><span className="text-purple-600 font-bold">public async</span> <span className="font-bold text-blue-600">executeResolution</span>(disputeId: <span className="text-amber-600">string</span>) &#123;</div>
                <div className="pl-8 text-muted">const ledger = await LedgerClient.reconcile(disputeId);</div>
                <div className="pl-8 text-muted">return this.dispatchWebhook(disputeId, ledger);</div>
                <div className="pl-4">&#125;</div>
                <div>&#125;</div>
              </div>

              {/* Hover Tooltip Box */}
              <div className="p-4 rounded-2xl border border-border bg-surface space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-emerald-500" />
                    <span>DisputeOrchestrator · Node Telemetry</span>
                  </span>
                  <span className="text-[10px] text-muted">Subsystem: Engine Core</span>
                </div>
                <p className="text-[11px] text-muted font-sans leading-snug">
                  Incoming fan-in calls from <strong className="text-foreground">37 REST endpoints</strong>. Direct dependency on <strong className="text-foreground">LedgerClient</strong>.
                </p>
              </div>

            </div>

            {/* Sidebar Copilot Column (4 cols) */}
            <div className="lg:col-span-4 p-6 bg-surface/40 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>CodeGraph Copilot</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">CONNECTED</span>
                </div>

                <div className="p-3.5 rounded-2xl border border-border bg-background space-y-2 shadow-2xs">
                  <div className="text-[10px] text-muted uppercase font-bold">Active File Context</div>
                  <div className="font-bold text-foreground text-xs">src/services/dispute.ts</div>
                  <div className="text-[10px] text-muted">Cypher Node ID: #8492</div>
                </div>

                <div className="p-3.5 rounded-2xl border border-border bg-background space-y-2 shadow-2xs">
                  <div className="text-[10px] text-purple-600 uppercase font-bold">Suggested Refactor</div>
                  <p className="text-[11px] text-muted font-sans leading-snug">
                    Extract <code className="text-foreground font-bold">LedgerClient.reconcile()</code> into an asynchronous task queue to isolate transaction locks.
                  </p>
                </div>
              </div>

              <a 
                href="https://marketplace.visualstudio.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-full block"
              >
                <Button size="sm" className="w-full text-xs font-bold rounded-full h-10 bg-black text-white hover:bg-neutral-800 shadow-xs">
                  <span>Install VS Code Extension</span>
                </Button>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
