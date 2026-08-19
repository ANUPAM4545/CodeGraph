'use client';

import React, { useState } from 'react';
import { 
  ActivitySquare, 
  ShieldAlert, 
  ArrowRight, 
  Code2, 
  FileCode, 
  Layers, 
  CheckCircle, 
  Zap,
  GitBranch
} from 'lucide-react';

export default function ImpactShowcase() {
  const [selectedDepth, setSelectedDepth] = useState<number>(2);

  return (
    <section className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>CHANGE IMPACT SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Change with confidence.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            CodeGraph computes topological blast radius before you modify a function or merge a pull request, preventing unforeseen production regressions.
          </p>
        </div>

        {/* Interactive Impact Card */}
        <div className="border border-border rounded-xl bg-surface p-6 sm:p-8 shadow-xl space-y-8 font-mono text-xs">
          
          {/* Target Symbol Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-background">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground">QRCodeService.generate()</div>
                <div className="text-[11px] text-muted">src/services/qr/generator.ts (Lines 14–48)</div>
              </div>
            </div>

            {/* Depth Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">Analysis Depth:</span>
              <div className="flex items-center border border-border rounded-md bg-surface p-0.5">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDepth(d)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedDepth === d ? 'bg-black text-white font-bold' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {d} Hop{d > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blast Radius Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-border bg-background space-y-1">
              <div className="text-[10px] text-muted uppercase font-bold">Direct Callers</div>
              <div className="text-2xl font-black text-foreground">12</div>
              <div className="text-[10px] text-muted font-sans">Across 4 endpoints</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-background space-y-1">
              <div className="text-[10px] text-muted uppercase font-bold">Dependencies</div>
              <div className="text-2xl font-black text-foreground">8</div>
              <div className="text-[10px] text-muted font-sans">Internal & external packages</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-background space-y-1">
              <div className="text-[10px] text-muted uppercase font-bold">Affected Files</div>
              <div className="text-2xl font-black text-foreground">4</div>
              <div className="text-[10px] text-muted font-sans">In 3 separate modules</div>
            </div>

            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 space-y-1">
              <div className="text-[10px] text-red-600 uppercase font-bold">Risk Score</div>
              <div className="text-2xl font-black text-red-600">84 / 100</div>
              <div className="text-[10px] text-red-600/80 font-sans font-bold">HIGH BLAST RADIUS</div>
            </div>
          </div>

          {/* Downstream Call Chain Simulation */}
          <div className="p-5 rounded-lg border border-border bg-background space-y-3">
            <div className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Downstream Caller Chain
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded bg-surface border border-border text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="font-bold text-foreground">PaymentRouter.initiate()</span>
                  <span className="text-muted text-[10px]">/api/v1/payments.py</span>
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded">DIRECT CALLER</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-surface border border-border text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-foreground">CheckoutOrchestrator.checkout()</span>
                  <span className="text-muted text-[10px]">src/services/checkout.ts</span>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">2ND HOP CALLER</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-surface border border-border text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-foreground">WebhookDispatcher.notify()</span>
                  <span className="text-muted text-[10px]">src/events/dispatcher.ts</span>
                </div>
                <span className="text-[10px] font-bold text-muted bg-surface px-2 py-0.5 rounded border border-border">EVENT LISTENER</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
