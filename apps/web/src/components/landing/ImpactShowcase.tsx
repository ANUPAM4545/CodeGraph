'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ActivitySquare, 
  ShieldAlert, 
  ArrowRight, 
  Code2, 
  FileCode, 
  Layers, 
  CheckCircle, 
  Zap,
  GitBranch,
  Search,
  CheckCircle2,
  Box
} from 'lucide-react';

export default function ImpactShowcase() {
  const [selectedDepth, setSelectedDepth] = useState<number>(2);

  const callers = [
    { name: 'DisputeOrchestrator.executeResolution()', file: 'src/services/dispute.ts', type: 'Direct Caller', risk: 'HIGH' },
    { name: 'WebhookDispatcher.notifyPayout()', file: 'src/events/payout.ts', type: 'Downstream Event', risk: 'HIGH' },
    { name: '/api/v1/ledger/reconcile', file: 'src/api/routes/ledger.py', type: 'REST Endpoint', risk: 'MEDIUM' },
  ];

  return (
    <section id="impact" className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
      {/* Background Architectural Grid */}
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
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>CHANGE IMPACT SIMULATION</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Change with confidence.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            CodeGraph computes topological blast radius before you modify a function or merge a pull request, preventing unforeseen production regressions.
          </p>
        </div>

        {/* macOS Style Impact Simulator Window */}
        <div className="rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden max-w-5xl mx-auto font-mono text-xs">
          
          {/* Top Window Bar */}
          <div className="h-12 bg-background/90 backdrop-blur-md border-b border-border px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
            </div>

            {/* Address Pill */}
            <div className="px-4 py-1 rounded-full bg-surface border border-border font-mono text-[11px] text-muted flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>codegraph.dev/app/blast-radius-simulator</span>
            </div>

            <div className="text-muted text-[11px] font-mono">
              <span>Risk Engine: AST ➔ Neo4j</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-background">
            
            {/* Target Symbol Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-surface shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Box className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-foreground">LedgerClient.reconcile()</div>
                  <div className="text-[11px] text-muted">src/db/ledger.ts · Method (Lines 76–134)</div>
                </div>
              </div>

              {/* Depth Selector Pills */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted">Blast Depth:</span>
                <div className="flex items-center border border-border rounded-full bg-background p-1">
                  {[1, 2, 3].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDepth(d)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        selectedDepth === d 
                          ? 'bg-black text-white shadow-xs' 
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      {d} {d === 1 ? 'Hop' : 'Hops'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics Gauges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-1">
                <div className="text-[10px] text-red-600 font-bold uppercase">Calculated Risk Index</div>
                <div className="text-2xl font-black text-red-600">84 / 100</div>
                <div className="text-[10px] text-muted">High fan-in cross-subsystem ripple</div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-surface space-y-1">
                <div className="text-[10px] text-muted font-bold uppercase">Direct Callers</div>
                <div className="text-2xl font-black text-foreground">14 Callers</div>
                <div className="text-[10px] text-muted">Across 3 architectural subsystems</div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-surface space-y-1">
                <div className="text-[10px] text-muted font-bold uppercase">Downstream Impact</div>
                <div className="text-2xl font-black text-foreground">6 Methods</div>
                <div className="text-[10px] text-muted">Double-entry ledger dependencies</div>
              </div>
            </div>

            {/* Caller Impact Propagation List */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Upstream Calling Chain Propagation ({callers.length})
              </div>

              <div className="space-y-2">
                {callers.map((caller) => (
                  <div key={caller.name} className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Code2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-bold text-foreground text-xs">{caller.name}</div>
                        <div className="text-[10px] text-muted">{caller.file}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted bg-background px-2 py-0.5 rounded border border-border">
                        {caller.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        caller.risk === 'HIGH' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {caller.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
