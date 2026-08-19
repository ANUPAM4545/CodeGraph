'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  FileCode,
  Globe,
  Server
} from 'lucide-react';

const REPO_TABS = ['Executive Summary', 'Discovered REST APIs', 'Database Schemas', 'Health Audit'];

export default function RepositoryIntelligenceShowcase() {
  const [activeTab, setActiveTab] = useState('Executive Summary');

  return (
    <section id="intelligence-module" className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
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
            <span>REPOSITORY INTELLIGENCE ⭐</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Understand before reading code.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            CodeGraph automatically extracts executive summaries, discovered REST endpoints, database schemas, and architectural health directly from code manifests and AST syntax.
          </p>
        </div>

        {/* macOS Style Window Container */}
        <div className="rounded-3xl border border-border bg-background shadow-2xl overflow-hidden max-w-5xl mx-auto font-mono text-xs">
          
          {/* Top Window Bar */}
          <div className="h-12 bg-surface border-b border-border px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
            </div>

            {/* Address Pill */}
            <div className="px-4 py-1 rounded-full bg-background border border-border font-mono text-[11px] text-muted flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>codegraph.dev/app/MarketPlace-Dispute-Engine/intelligence</span>
            </div>

            <span className="text-emerald-600 font-bold text-[10px] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              HEALTH SCORE: 94/100
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header Identity Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-foreground">MarketPlace-Dispute-Engine</div>
                  <div className="text-[11px] text-muted">Primary Language: TypeScript · 37 APIs · 9 ORM Models · 4 Subsystems</div>
                </div>
              </div>

              {/* Sub-Tab Selector */}
              <div className="flex items-center gap-1 bg-surface p-1 rounded-full border border-border">
                {REPO_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      activeTab === tab 
                        ? 'bg-black text-white shadow-xs' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Intelligence Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Executive Summary Card */}
              <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Purpose & Problem</span>
                </div>
                <p className="text-xs text-muted font-sans leading-relaxed">
                  Automated marketplace arbitration engine handling multi-party dispute transitions, chargeback proofs, and double-entry ledger adjustments.
                </p>
              </div>

              {/* Discovered APIs Card */}
              <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Discovered REST APIs</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between"><span className="text-foreground font-bold">POST /api/v1/disputes</span><span className="text-emerald-600 font-bold text-[10px]">200 OK</span></div>
                  <div className="flex items-center justify-between"><span className="text-foreground font-bold">GET /api/v1/disputes/:id</span><span className="text-emerald-600 font-bold text-[10px]">200 OK</span></div>
                  <div className="flex items-center justify-between"><span className="text-foreground font-bold">POST /api/v1/ledger/reconcile</span><span className="text-purple-600 font-bold text-[10px]">AUTH</span></div>
                </div>
              </div>

              {/* Database Models Card */}
              <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Database Entities</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between"><span className="text-foreground font-bold">DisputeRecord</span><span className="text-muted text-[10px]">PostgreSQL</span></div>
                  <div className="flex items-center justify-between"><span className="text-foreground font-bold">LedgerEntry</span><span className="text-muted text-[10px]">PostgreSQL</span></div>
                  <div className="flex items-center justify-between"><span className="text-foreground font-bold">AuditLog</span><span className="text-muted text-[10px]">PostgreSQL</span></div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
