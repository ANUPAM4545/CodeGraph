'use client';

import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  Zap, 
  ShieldCheck, 
  FolderGit2, 
  Layers, 
  CheckCircle2, 
  ActivitySquare,
  FileCode
} from 'lucide-react';

export default function RepositoryIntelligenceShowcase() {
  return (
    <section className="py-20 md:py-28 bg-surface/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>REPOSITORY INTELLIGENCE ⭐</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Understand a repository before reading it.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            CodeGraph automatically extracts executive summaries, discovered REST endpoints, database schemas, verified features, and health metrics directly from code manifests and AST syntax.
          </p>
        </div>

        {/* Intelligence Module Preview Card */}
        <div className="border border-border rounded-xl bg-background p-6 sm:p-8 shadow-xl space-y-8 font-mono text-xs">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
                <FolderGit2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground">MarketPlace-Dispute-Engine</div>
                <div className="text-[10px] text-muted">Primary Language: TypeScript · 37 APIs · 9 ORM Models</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                HEALTH SCORE: 92/100
              </span>
            </div>
          </div>

          {/* 3 Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Purpose & Problem Card */}
            <div className="p-4 rounded-lg border border-border bg-surface space-y-2">
              <div className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs font-sans text-foreground leading-relaxed">
                Automated multi-party dispute resolution engine managing chargeback lifecycles, evidence collection, and ledger reconciliation.
              </p>
            </div>

            {/* Discovered APIs Card */}
            <div className="p-4 rounded-lg border border-border bg-surface space-y-2">
              <div className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-600" />
                <span>Discovered REST Endpoints</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-blue-500/10 text-blue-600 font-bold px-1 rounded">POST</span>
                  <span className="text-foreground">/api/v1/disputes/file</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 font-bold px-1 rounded">GET</span>
                  <span className="text-foreground">/api/v1/disputes/{'{id}'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-purple-500/10 text-purple-600 font-bold px-1 rounded">POST</span>
                  <span className="text-foreground">/api/v1/evidence/upload</span>
                </div>
              </div>
            </div>

            {/* Database Models Card */}
            <div className="p-4 rounded-lg border border-border bg-surface space-y-2">
              <div className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>Discovered Database Models</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold">DisputeRecord</span>
                  <span className="text-muted text-[10px]">14 columns</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold">EvidenceAttachment</span>
                  <span className="text-muted text-[10px]">8 columns</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold">LedgerEntry</span>
                  <span className="text-muted text-[10px]">11 columns</span>
                </div>
              </div>
            </div>

          </div>

          {/* Categorized Tech Stack Tags */}
          <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
            <div className="text-[10px] text-muted font-bold uppercase tracking-wider">
              Categorized Tech Stack Taxonomy (27 Items Detected)
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold">FastAPI</span>
              <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold">PostgreSQL</span>
              <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold">SQLAlchemy ORM</span>
              <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold">Redis Queue</span>
              <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold">Docker Compose</span>
              <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold">Pytest</span>
              <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold">Stripe SDK</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
