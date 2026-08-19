'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  Network, 
  Layers, 
  BrainCircuit, 
  Cuboid, 
  ShieldAlert, 
  Search, 
  FileCode, 
  Code2, 
  Box, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  GitBranch,
  Globe,
  Database,
  Terminal,
  Activity,
  Orbit,
  Cpu
} from 'lucide-react';

interface PreviewTab {
  id: string;
  name: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}

const TABS: PreviewTab[] = [
  { id: 'repo', name: 'Repository', icon: FolderGit2, title: 'Multi-Language AST Extraction', desc: 'Lossless Tree-sitter parsing for Python & TypeScript' },
  { id: 'arch', name: 'Architecture', icon: Layers, title: 'Subsystem & Module Boundaries', desc: 'Automatic clustering of engine, API, persistence, and external layers' },
  { id: 'graph', name: 'Graph Explorer', icon: Network, title: 'Topological Property Graph', desc: 'Neo4j property graph with typed CALLS and IMPORTS edges' },
  { id: 'intel', name: 'Repository Intelligence', icon: Sparkles, title: 'Automated Codebase Synthesis', desc: 'Purpose, stack, REST routes, and schemas derived directly from code' },
  { id: 'ai', name: 'AI Assistant', icon: BrainCircuit, title: 'Source-Grounded Copilot', desc: 'Graph-RAG answers with exact file citations and line ranges' },
  { id: 'universe', name: '3D Universe', icon: Cuboid, title: 'Spatial Codebase Exploration', desc: 'Interactive 3D WebGL viewport with gravitational density' },
];

export default function ProductPreview() {
  const [activeTabId, setActiveTabId] = useState('repo');
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance through tabs every 4.5 seconds (pauses on user hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveTabId((current) => {
        const idx = TABS.findIndex((t) => t.id === current);
        return TABS[(idx + 1) % TABS.length].id;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <section id="preview" className="py-24 md:py-32 bg-surface/40 border-b border-border relative overflow-hidden">
      
      {/* Background Architectural Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-[11px] font-mono font-bold text-neutral-800 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>PLATFORM PREVIEW</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            The Living Architecture Platform.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Explore every dimension of your software — from AST-level syntax trees to architectural topologies and grounded AI reasoning.
          </p>
        </div>

        {/* Top Feature Switcher Pills */}
        <div 
          className="flex justify-center mb-8 overflow-x-auto pb-2 scrollbar-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-border shadow-xs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:text-foreground hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Browser-Style Product Showcase Window */}
        <div 
          className="rounded-3xl border border-border bg-white shadow-2xl overflow-hidden max-w-6xl mx-auto font-mono text-xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* macOS Browser Header */}
          <div className="h-12 bg-neutral-50 border-b border-border px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
            </div>

            {/* Centered URL Pill */}
            <div className="px-4 py-1 rounded-full bg-white border border-border font-mono text-[11px] text-muted flex items-center gap-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>codegraph.dev/app/marketplace-engine/{activeTab.id}</span>
            </div>

            <div className="flex items-center gap-2 text-muted text-[11px]">
              <span className="hidden sm:inline font-bold text-foreground">{activeTab.title}</span>
            </div>
          </div>

          {/* Dynamic Content Viewport with Individual Dedicated Design for Each Tab */}
          <div className="min-h-[460px] bg-white">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: REPOSITORY & CONCRETE AST EXTRACTION */}
              {activeTabId === 'repo' && (
                <motion.div
                  key="repo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]"
                >
                  {/* Left Directory Tree (4 cols) */}
                  <div className="md:col-span-4 border-r border-border p-5 bg-neutral-50/60 space-y-4">
                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border">
                      <span className="font-extrabold text-foreground">DIRECTORY TREE</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        PARSED 100%
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-neutral-700" />
                        <span>marketplace-engine/</span>
                      </div>
                      <div className="pl-4 space-y-1 text-muted">
                        <div className="p-1 rounded bg-neutral-200/80 text-foreground font-bold flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-blue-600" />
                          <span>src/services/dispute.ts</span>
                        </div>
                        <div className="p-1 rounded flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-purple-600" />
                          <span>src/domain/arbitration.ts</span>
                        </div>
                        <div className="p-1 rounded flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                          <span>src/db/ledger.ts</span>
                        </div>
                        <div className="p-1 rounded flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-amber-600" />
                          <span>src/api/routes.py</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-1 text-[10px] text-muted">
                      <div>Parser: <strong className="text-foreground">Tree-sitter TSX & Python</strong></div>
                      <div>Symbol Nodes: <strong className="text-foreground">1,452 AST Tokens</strong></div>
                    </div>
                  </div>

                  {/* Center Concrete AST Hierarchy (5 cols) */}
                  <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-border space-y-4">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center justify-between">
                      <span>Concrete AST Structure</span>
                      <span className="text-[10px] text-purple-600 font-bold">src/services/dispute.ts</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-1">
                        <div className="font-bold text-purple-900 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>ClassDeclaration: DisputeOrchestrator</span>
                        </div>
                        <div className="text-[10px] text-purple-700 pl-5">Line 14–112 · Exported Class</div>
                      </div>

                      <div className="pl-4 space-y-2">
                        <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-0.5">
                          <div className="font-bold text-blue-900 flex items-center gap-1.5">
                            <Code2 className="w-3 h-3 text-blue-600" />
                            <span>MethodDefinition: executeResolution()</span>
                          </div>
                          <div className="text-[10px] text-blue-700 pl-4">Line 24–68 · Async Public Method</div>
                        </div>

                        <div className="pl-4">
                          <div className="p-2 rounded-lg border border-emerald-200 bg-emerald-50/50">
                            <div className="font-bold text-emerald-900 text-[11px] flex items-center gap-1.5">
                              <Box className="w-3 h-3 text-emerald-600" />
                              <span>CallExpression: LedgerClient.reconcile()</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right File Telemetry (3 cols) */}
                  <div className="md:col-span-3 p-5 bg-neutral-50/40 space-y-3">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border">
                      AST Metrics
                    </div>
                    <div className="p-3.5 rounded-2xl border border-border bg-white space-y-2 shadow-2xs">
                      <div className="text-xs font-bold text-foreground">dispute.ts</div>
                      <div className="text-[10px] text-muted">Lines of Code: <strong className="text-foreground">184 LOC</strong></div>
                      <div className="text-[10px] text-muted">Methods: <strong className="text-foreground">4 Defined</strong></div>
                      <div className="text-[10px] text-muted">Imports: <strong className="text-foreground">3 External</strong></div>
                      <div className="text-[10px] text-emerald-600 font-bold pt-1 border-t border-border">Syntax Validated</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ARCHITECTURE & MODULE BOUNDARIES */}
              {activeTabId === 'arch' && (
                <motion.div
                  key="arch"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]"
                >
                  {/* Subsystems List (4 cols) */}
                  <div className="md:col-span-4 border-r border-border p-5 bg-neutral-50/60 space-y-3">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border">
                      Architectural Subsystems (4)
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl border border-black bg-white shadow-xs space-y-0.5">
                        <div className="font-bold text-foreground">Engine Subsystem</div>
                        <div className="text-[10px] text-muted">Core orchestration & arbitration</div>
                      </div>
                      <div className="p-3 rounded-2xl border border-border bg-white space-y-0.5">
                        <div className="font-bold text-foreground">API Layer</div>
                        <div className="text-[10px] text-muted">FastAPI & REST routing</div>
                      </div>
                      <div className="p-3 rounded-2xl border border-border bg-white space-y-0.5">
                        <div className="font-bold text-foreground">Persistence ORM</div>
                        <div className="text-[10px] text-muted">PostgreSQL & SQLAlchemy</div>
                      </div>
                    </div>
                  </div>

                  {/* Architecture Diagram Canvas (5 cols) */}
                  <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-border space-y-4 flex flex-col justify-between">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center justify-between">
                      <span>Module Boundaries Map</span>
                      <span className="text-[10px] text-emerald-600 font-bold">STRICT DAG</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-auto">
                      <div className="p-4 rounded-2xl border-2 border-purple-400 bg-purple-50/60 text-center space-y-1">
                        <div className="font-extrabold text-foreground text-xs">Engine Core</div>
                        <div className="text-[10px] text-purple-700">14 Inbound Calls</div>
                      </div>
                      <div className="p-4 rounded-2xl border border-border bg-neutral-50 text-center space-y-1">
                        <div className="font-extrabold text-foreground text-xs">API Router</div>
                        <div className="text-[10px] text-muted">5 Endpoints</div>
                      </div>
                      <div className="p-4 rounded-2xl border border-border bg-neutral-50 text-center space-y-1">
                        <div className="font-extrabold text-foreground text-xs">Persistence</div>
                        <div className="text-[10px] text-muted">9 ORM Models</div>
                      </div>
                      <div className="p-4 rounded-2xl border border-border bg-neutral-50 text-center space-y-1">
                        <div className="font-extrabold text-foreground text-xs">External SDKs</div>
                        <div className="text-[10px] text-muted">Stripe & Neo4j</div>
                      </div>
                    </div>

                    <div className="text-[10px] text-muted font-sans text-center">
                      Auto-clustered via dependency graph analysis without manual configuration.
                    </div>
                  </div>

                  {/* Coupling Metrics (3 cols) */}
                  <div className="md:col-span-3 p-5 bg-neutral-50/40 space-y-3">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border">
                      Coupling Telemetry
                    </div>
                    <div className="p-3.5 rounded-2xl border border-border bg-white space-y-2">
                      <div className="text-[10px] text-muted">Afferent Coupling: <strong className="text-foreground">14</strong></div>
                      <div className="text-[10px] text-muted">Efferent Coupling: <strong className="text-foreground">3</strong></div>
                      <div className="text-[10px] text-muted">Instability Index: <strong className="text-foreground">0.18</strong></div>
                      <div className="text-[10px] text-emerald-600 font-bold pt-1 border-t border-border">0 Circular Loops</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: GRAPH EXPLORER (NEO4J PROPERTY GRAPH) */}
              {activeTabId === 'graph' && (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]"
                >
                  {/* Left Sidebar (3 cols) */}
                  <div className="md:col-span-3 border-r border-border p-4 bg-neutral-50/60 space-y-3">
                    <div className="text-[10px] text-muted uppercase font-bold tracking-wider">
                      Cypher Query Filter
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-900 text-purple-300 text-[10px] leading-relaxed">
                      MATCH (c:Class &#123;name: &quot;DisputeService&quot;&#125;) RETURN c
                    </div>
                    <div className="pt-2 border-t border-border space-y-1 text-[10px] text-muted">
                      <div>Nodes: <strong className="text-foreground">1,452</strong></div>
                      <div>Relationships: <strong className="text-foreground">3,890</strong></div>
                      <div>Query Latency: <strong className="text-emerald-600">0.4ms</strong></div>
                    </div>
                  </div>

                  {/* Center Graph Canvas (6 cols) */}
                  <div className="md:col-span-6 relative h-[460px] bg-dot-pattern flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border select-none overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                      <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                      <line x1="50%" y1="50%" x2="50%" y2="82%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                    </svg>

                    <div className="absolute left-[10%] top-[15%] p-2.5 rounded-xl border border-purple-200 bg-purple-50 font-bold text-[11px]">
                      calculateRiskScore()
                    </div>
                    <div className="absolute right-[10%] top-[15%] p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 font-bold text-[11px]">
                      LedgerClient
                    </div>
                    <div className="p-4 rounded-2xl border-2 border-black bg-white shadow-xl ring-4 ring-black/5 z-10 text-center">
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5 justify-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>DisputeService</span>
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">Class · Engine Subsystem</div>
                      <div className="text-[9px] text-red-600 font-bold mt-1">HIGH RISK (Fan-in: 14)</div>
                    </div>
                    <div className="absolute bottom-[10%] p-2.5 rounded-xl border border-blue-200 bg-blue-50 font-bold text-[11px]">
                      dispute_router.py
                    </div>
                  </div>

                  {/* Right Inspector (3 cols) */}
                  <div className="md:col-span-3 p-5 bg-neutral-50/40 space-y-3">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border">
                      Node Properties
                    </div>
                    <div className="p-3.5 rounded-2xl border border-border bg-white space-y-2">
                      <div className="text-xs font-bold text-foreground">DisputeService</div>
                      <div className="text-[10px] text-muted">File: src/services/dispute.ts</div>
                      <div className="text-[10px] text-muted">AST Depth: 4</div>
                      <div className="text-[10px] text-emerald-600 font-bold pt-1 border-t border-border">ACID Committed</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: REPOSITORY INTELLIGENCE (AUTOMATED SYNTHESIS) */}
              {activeTabId === 'intel' && (
                <motion.div
                  key="intel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <h3 className="font-extrabold text-base text-foreground">
                        Synthesized Executive Intelligence
                      </h3>
                      <p className="text-xs text-muted font-sans mt-0.5">
                        Derived purpose, database models, and active REST API routes
                      </p>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold text-xs">
                      HEALTH: 96/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl border border-border bg-neutral-50/50 space-y-1.5">
                      <div className="font-bold text-xs text-foreground uppercase">Purpose</div>
                      <p className="text-xs font-sans text-muted leading-relaxed">
                        Arbitration engine handling dynamic dispute state transitions and balance reconciliation.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-neutral-50/50 space-y-1.5">
                      <div className="font-bold text-xs text-foreground uppercase">Discovered APIs</div>
                      <div className="text-[11px] text-muted space-y-1">
                        <div>POST /api/v1/disputes</div>
                        <div>POST /api/v1/ledger/reconcile</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-neutral-50/50 space-y-1.5">
                      <div className="font-bold text-xs text-foreground uppercase">DB Schemas</div>
                      <div className="text-[11px] text-muted space-y-1">
                        <div>DisputeRecord (PostgreSQL)</div>
                        <div>LedgerEntry (PostgreSQL)</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: AI ASSISTANT (GRAPH-RAG COPILOT) */}
              {activeTabId === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]"
                >
                  <div className="md:col-span-7 p-6 border-b md:border-b-0 md:border-r border-border space-y-4">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center justify-between">
                      <span>Source-Grounded AI Copilot</span>
                      <span className="text-[10px] text-emerald-600 font-bold">100% GROUNDED</span>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-black text-white p-3.5 rounded-2xl rounded-br-none space-y-1">
                        <div className="text-[9px] text-neutral-400 font-bold uppercase">User Prompt</div>
                        <div className="text-xs font-sans">
                          &quot;How does dispute resolution reconcile double-entry ledger balances?&quot;
                        </div>
                      </div>

                      <div className="bg-neutral-50 border border-border p-4 rounded-2xl rounded-tl-none space-y-2">
                        <div className="text-[10px] text-purple-700 font-bold">CodeGraph Reasoning</div>
                        <p className="text-xs font-sans text-foreground leading-relaxed">
                          `DisputeOrchestrator` invokes `LedgerClient.reconcile()` inside an ACID PostgreSQL transaction during the `SETTLED` state transition.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 p-6 bg-neutral-50/40 space-y-3">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border">
                      Verified Citations
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl border border-border bg-white">
                        <div className="font-bold text-foreground text-xs">src/services/dispute.ts</div>
                        <div className="text-[10px] text-muted">Lines 48–112 · DisputeOrchestrator</div>
                      </div>
                      <div className="p-3 rounded-xl border border-border bg-white">
                        <div className="font-bold text-foreground text-xs">src/db/ledger.ts</div>
                        <div className="text-[10px] text-muted">Lines 76–134 · LedgerClient.reconcile()</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: 3D UNIVERSE (SPATIAL WEBGL EXPLORER) */}
              {activeTabId === 'universe' && (
                <motion.div
                  key="universe"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]"
                >
                  <div className="md:col-span-8 relative h-[460px] bg-neutral-950 text-white flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-neutral-800 overflow-hidden select-none">
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none" 
                      style={{ 
                        backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
                        backgroundSize: '28px 28px' 
                      }} 
                    />

                    {/* Concentric Orbits */}
                    <div className="relative w-72 h-72 rounded-full border border-neutral-800 flex items-center justify-center">
                      <div className="absolute inset-10 rounded-full border border-neutral-800/60" />
                      
                      {/* Sun Core */}
                      <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-center shadow-2xl z-10">
                        <Cuboid className="w-6 h-6 text-white" />
                      </div>

                      {/* Orbiting Planet 1 */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div style={{ transform: 'translate(100px, 0)' }} className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-[10px] text-emerald-400 font-bold whitespace-nowrap">
                          ● Engine Core
                        </div>
                      </motion.div>

                      {/* Orbiting Planet 2 */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div style={{ transform: 'translate(-120px, 0)' }} className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-[10px] text-purple-400 font-bold whitespace-nowrap">
                          ● Rules Engine
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-4 left-6 right-6 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between text-[10px] text-neutral-300">
                      <span>Density-based spatial positioning</span>
                      <span>Three.js / WebGL</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 p-5 bg-neutral-50/40 space-y-3">
                    <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border">
                      Spatial HUD Controls
                    </div>
                    <div className="p-3.5 rounded-2xl border border-border bg-white space-y-2">
                      <div className="text-[10px] text-muted">Selected Body: <strong className="text-foreground">Engine Core</strong></div>
                      <div className="text-[10px] text-muted">Orbital Radius: <strong className="text-foreground">100px</strong></div>
                      <div className="text-[10px] text-muted">Density Score: <strong className="text-foreground">0.94</strong></div>
                      <div className="text-[10px] text-blue-600 font-bold pt-1 border-t border-border">Planetary Zoom 1.0x</div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
