'use client';

import React from 'react';
import { 
  Terminal, 
  Code2, 
  Layers, 
  Sparkles, 
  ShieldAlert, 
  ActivitySquare, 
  ArrowRight,
  CheckCircle2,
  Box
} from 'lucide-react';
import { Button } from '../ui/Button';

export default function IDEShowcase() {
  return (
    <section id="ide" className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>VS CODE EXTENSION & IDE PROTOCOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Bring architectural intelligence into your editor.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            Never context-switch to the browser. CodeGraph delivers ambient architectural CodeLens annotations, blast-radius hovers, and an AI copilot sidebar inside VS Code.
          </p>
        </div>

        {/* VS Code Mockup Window */}
        <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-2xl font-mono text-xs">
          
          {/* Editor Header Bar */}
          <div className="h-10 bg-background border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              </div>
              <span className="text-muted ml-2">Visual Studio Code · <span className="text-foreground font-bold">src/services/dispute.ts</span></span>
            </div>
            <span className="text-[10px] text-muted">CodeGraph VS Code Extension v1.0.0</span>
          </div>

          {/* Editor Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-background min-h-[380px]">
            
            {/* Editor Code Area (8 cols) */}
            <div className="lg:col-span-8 p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-border font-mono text-xs">
              
              {/* CodeLens Annotation 1 */}
              <div className="flex items-center gap-3 text-[11px] text-muted bg-surface/80 px-2.5 py-1 rounded border border-border/80 w-fit">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <ActivitySquare className="w-3 h-3 text-red-500" />
                  <span>CodeGraph:</span>
                </span>
                <span className="text-foreground font-semibold">14 callers</span>
                <span>·</span>
                <span className="text-red-600 font-bold">High Blast Radius (Risk: 84)</span>
                <span>·</span>
                <span className="text-muted hover:text-foreground cursor-pointer underline">Show Impact Graph</span>
              </div>

              {/* Code Line 1 */}
              <div className="text-foreground">
                <span className="text-purple-600 font-bold">export class</span> <span className="text-blue-600 font-bold">DisputeOrchestrator</span> {'{'}
              </div>

              {/* Code Line 2 with Hover Popup */}
              <div className="pl-4 relative">
                
                {/* CodeLens Annotation 2 */}
                <div className="text-[10px] text-muted mb-1 flex items-center gap-2">
                  <span>8 references</span>
                  <span>·</span>
                  <span className="text-purple-600">Explain Architecture</span>
                </div>

                <div className="text-foreground">
                  <span className="text-purple-600 font-bold">async</span> <span className="text-blue-600 font-bold">executeResolution</span>(disputeId: <span className="text-emerald-600">string</span>) {'{'}
                </div>

                {/* Ambient Hover Tooltip */}
                <div className="my-2 p-3.5 rounded-lg border-2 border-black bg-surface shadow-xl max-w-md space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between border-b border-border pb-1.5">
                    <span className="font-bold text-foreground">DisputeOrchestrator.executeResolution()</span>
                    <span className="text-red-600 font-bold text-[10px] bg-red-500/10 px-1.5 py-0.5 rounded">HIGH RISK</span>
                  </div>
                  <div className="text-muted text-[10px] font-sans">
                    Modifying this method affects <strong className="text-foreground">PaymentRouter</strong>, <strong className="text-foreground">LedgerSyncWorker</strong>, and triggers 3 external webhooks.
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-muted">
                    <span>Subsystem: <strong className="text-foreground">Engine</strong></span>
                    <span>·</span>
                    <span>Fan-in: <strong className="text-foreground">14</strong></span>
                  </div>
                </div>

                <div className="text-foreground pl-4">
                  <span className="text-purple-600">const</span> record = <span className="text-purple-600">await this</span>.db.fetch(disputeId);
                </div>
                <div className="text-foreground">
                  {'}'}
                </div>
              </div>

              <div className="text-foreground">
                {'}'}
              </div>

            </div>

            {/* Editor Sidebar: CodeGraph Copilot (4 cols) */}
            <div className="lg:col-span-4 p-5 bg-surface/50 space-y-4 font-mono text-xs">
              
              <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>CodeGraph Architectural Sidebar</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="text-muted font-bold text-[10px] uppercase">Symbol Dependencies</div>
                <div className="p-2 rounded bg-background border border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-bold">LedgerClient</span>
                    <span className="text-muted text-[10px]">src/db/ledger.ts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-bold">AuditLogger</span>
                    <span className="text-muted text-[10px]">src/audit/log.ts</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-background space-y-2">
                <div className="text-[10px] font-bold text-foreground uppercase">AI Architectural Summary</div>
                <p className="text-[11px] text-muted font-sans leading-snug">
                  This class manages state transitions for buyer/seller disputes, verifying proof signatures before posting double-entry ledger adjustments.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
