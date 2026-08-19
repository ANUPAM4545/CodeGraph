'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Layers, 
  Sparkles, 
  ActivitySquare, 
  Search, 
  Bell, 
  ArrowUpRight, 
  Box, 
  Code2, 
  FileCode, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  ChevronRight,
  GitBranch,
  Terminal,
  Database,
  Compass
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: 'graph', label: 'Knowledge Graph', icon: Network, badge: '48 Nodes' },
  { id: 'architecture', label: 'Architecture Hotspots', icon: Layers, badge: '4 Subsystems' },
  { id: 'ai', label: 'Grounded AI Copilot', icon: Sparkles, badge: 'Graph-RAG' },
  { id: 'analytics', label: 'Blast Radius & Health', icon: ActivitySquare, badge: 'Score: 84' },
];

const GRAPH_ENTITIES = [
  {
    initials: 'DO',
    name: 'DisputeOrchestrator',
    subtext: 'src/services/dispute.ts · Class',
    tag: 'HIGH RISK',
    tagType: 'danger',
    callers: 14,
    dependencies: 6,
    subsystem: 'Engine Core'
  },
  {
    initials: 'EP',
    name: 'executeRulePipeline()',
    subtext: 'src/rules/pipeline.ts · Function',
    tag: 'FAN-IN: 12',
    tagType: 'warning',
    callers: 12,
    dependencies: 4,
    subsystem: 'Rules Pipeline'
  },
  {
    initials: 'LC',
    name: 'LedgerClient.reconcile()',
    subtext: 'src/db/ledger.ts · Method',
    tag: 'GROUNDED',
    tagType: 'success',
    callers: 8,
    dependencies: 2,
    subsystem: 'Database'
  },
  {
    initials: 'VS',
    name: 'validateSignature()',
    subtext: 'src/crypto/auth.ts · Function',
    tag: 'SECURE',
    tagType: 'neutral',
    callers: 6,
    dependencies: 1,
    subsystem: 'Security'
  },
];

const ARCH_SUBSYSTEMS = [
  {
    initials: 'EC',
    name: 'Engine Core Subsystem',
    subtext: '14 Files · 48 Symbols · 3 Entry Points',
    tag: 'HIGH COUPLING',
    tagType: 'danger',
    instability: '0.42 (Balanced)',
    loops: '0 Loops'
  },
  {
    initials: 'RP',
    name: 'Rules Heuristic Pipeline',
    subtext: '8 Files · 24 Symbols · 1 Entry Point',
    tag: 'MODERATE',
    tagType: 'warning',
    instability: '0.31 (Stable)',
    loops: '0 Loops'
  },
  {
    initials: 'DB',
    name: 'Database & Balance Sheet',
    subtext: '12 Files · 36 Symbols · Double-Entry Ledger',
    tag: 'CRITICAL',
    tagType: 'danger',
    instability: '0.18 (Highly Stable)',
    loops: '0 Loops'
  },
  {
    initials: 'SC',
    name: 'Security & Auth Tokens',
    subtext: '6 Files · 18 Symbols · PKCE & HMAC Signatures',
    tag: 'VERIFIED',
    tagType: 'success',
    instability: '0.12 (Isolated)',
    loops: '0 Loops'
  },
];

const AI_CHATS = [
  {
    initials: 'AI',
    name: 'Dispute Lifecycle State Machine',
    subtext: 'Query: "Explain state transitions in DisputeOrchestrator"',
    tag: '99% GROUNDED',
    tagType: 'success',
    cypher: 'MATCH (d:Class {name:"DisputeOrchestrator"})-[:CALLS]->(l:Class) RETURN d, l',
    answer: 'DisputeOrchestrator manages 6 deterministic lifecycle states. Atomic double-entry settlement is guaranteed via LedgerClient.reconcile().'
  },
  {
    initials: 'AI',
    name: 'Blast Radius Simulation',
    subtext: 'Query: "What breaks if LedgerClient.reconcile() changes?"',
    tag: 'BLAST SCORE: 84',
    tagType: 'danger',
    cypher: 'MATCH (caller)-[:CALLS*1..2]->(target:Function {name:"reconcile"}) RETURN caller',
    answer: 'Directly impacts DisputeOrchestrator.executeResolution(), WebhookDispatcher.notifyPayout(), and /api/v1/ledger/reconcile.'
  },
  {
    initials: 'AI',
    name: 'Circular Dependency Verification',
    subtext: 'Query: "Are there any cyclic loops between Engine and Rules?"',
    tag: 'DAG CLEAN',
    tagType: 'success',
    cypher: 'MATCH path = (n)-[:CALLS*2..6]->(n) RETURN path LIMIT 1',
    answer: 'Zero circular loops detected across the knowledge graph. The dependency graph strictly conforms to a Directed Acyclic Graph.'
  },
];

const HEALTH_METRICS = [
  {
    initials: 'DAG',
    name: 'Directed Acyclic Graph Integrity',
    subtext: 'Tarjan cycle detection algorithm executed across 48 AST nodes',
    tag: '100% CLEAN',
    tagType: 'success'
  },
  {
    initials: 'CD',
    name: 'Cross-Subsystem Coupling Drift',
    subtext: '28 cross-boundary function calls monitored in CI pipeline',
    tag: 'STABLE',
    tagType: 'success'
  },
  {
    initials: 'AST',
    name: 'Grammar Coverage (Tree-sitter)',
    subtext: 'Lossless AST syntax tree extraction for Python & TypeScript',
    tag: '100% COVERED',
    tagType: 'success'
  },
  {
    initials: 'RAG',
    name: 'Graph-RAG Vector Confidence',
    subtext: 'Qdrant HNSW cosine similarity score with AST context payloads',
    tag: '0.98 COSINE',
    tagType: 'success'
  },
];

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState('graph');
  const [selectedEntity, setSelectedEntity] = useState(GRAPH_ENTITIES[0]);

  return (
    <section id="product" className="py-14 md:py-24 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>INTERACTIVE PRODUCT EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            A live architectural window into your repository.
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
            Explore topological relationships, blast radius, and grounded code evidence in real-time.
          </p>
        </div>

        {/* Product Window Shell */}
        <div className="rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden">
          
          {/* Top Browser Bar with Center Address Pill */}
          <div className="h-12 bg-background/80 backdrop-blur-sm border-b border-border px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
            </div>

            {/* Address Bar Pill */}
            <div className="px-5 py-1 rounded-full bg-surface border border-border font-mono text-[11px] text-muted shadow-2xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>codegraph.dev/app/MarketPlace-Dispute-Engine</span>
            </div>

            <div className="w-10" />
          </div>

          {/* Product Interior Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            
            {/* Left Sidebar Navigation */}
            <div className="md:col-span-4 lg:col-span-3 border-r border-border p-5 bg-background flex flex-col justify-between">
              <div className="space-y-6">
                {/* Brand Header */}
                <div className="flex items-center gap-2.5 px-2">
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Network className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-sm text-foreground font-mono">
                    CodeGraph
                  </span>
                </div>

                {/* Navigation Tab Links with Animated Background Pill */}
                <nav className="space-y-1 relative">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-colors relative z-10 ${
                          isActive ? 'text-white' : 'text-muted hover:text-foreground hover:bg-surface'
                        }`}
                      >
                        {/* Smooth Motion Background Pill */}
                        {isActive && (
                          <motion.div
                            layoutId="activePreviewTabPill"
                            className="absolute inset-0 bg-black rounded-full -z-10 shadow-sm"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}

                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted'}`} />
                          <span>{tab.label}</span>
                        </div>

                        {tab.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-neutral-800 text-white' : 'bg-surface text-muted'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer Live Status */}
              <div className="p-3 rounded-2xl border border-border bg-surface space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted">AST SYNC</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </span>
                </div>
                <div className="text-[10px] text-muted truncate">
                  SHA: 7f8a92 · 14 files indexed
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-8 lg:col-span-9 p-6 sm:p-8 bg-surface/30 flex flex-col justify-between space-y-6">
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    MarketPlace-Dispute-Engine
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live · Branch: main · San Francisco Cluster</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-muted hover:text-foreground shadow-2xs transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-muted hover:text-foreground shadow-2xs transition-colors relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                    CG
                  </div>
                </div>
              </div>

              {/* Dynamic Inner Table Container */}
              <div className="rounded-2xl border border-border bg-background p-5 shadow-xs flex-1">
                
                {/* Directory Header Bar */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/80">
                  <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                    {activeTab === 'graph' && 'AST Symbol Directory'}
                    {activeTab === 'architecture' && 'Architectural Subsystems'}
                    {activeTab === 'ai' && 'Grounded Multi-Turn Dialogues'}
                    {activeTab === 'analytics' && 'System Health & Graph Telemetry'}
                  </div>

                  <button className="text-xs font-bold px-4 py-1.5 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors shadow-2xs flex items-center gap-1.5">
                    <span>{activeTab === 'ai' ? 'Ask Copilot' : 'Simulate Blast Radius'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Animated Tab Body Content */}
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: KNOWLEDGE GRAPH */}
                  {activeTab === 'graph' && (
                    <motion.div
                      key="graph-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {GRAPH_ENTITIES.map((item) => (
                        <div
                          key={item.name}
                          onClick={() => setSelectedEntity(item)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-full bg-surface border border-border font-mono font-bold text-xs text-foreground flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                              {item.initials}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-foreground font-mono flex items-center gap-2">
                                <span>{item.name}</span>
                              </div>
                              <div className="text-[11px] text-muted font-mono">
                                {item.subtext}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono ${
                              item.tagType === 'danger' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                              item.tagType === 'warning' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                              item.tagType === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                              'bg-surface text-foreground border border-border'
                            }`}>
                              {item.tag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* TAB 2: ARCHITECTURE */}
                  {activeTab === 'architecture' && (
                    <motion.div
                      key="arch-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {ARCH_SUBSYSTEMS.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-full bg-surface border border-border font-mono font-bold text-xs text-foreground flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                              {item.initials}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-foreground font-mono">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-muted font-mono">
                                {item.subtext}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono ${
                              item.tagType === 'danger' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                              item.tagType === 'warning' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                              'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            }`}>
                              {item.tag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* TAB 3: GROUNDED AI */}
                  {activeTab === 'ai' && (
                    <motion.div
                      key="ai-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {AI_CHATS.map((item) => (
                        <div
                          key={item.name}
                          className="flex flex-col p-3.5 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center shadow-2xs">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-foreground font-mono">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-muted font-mono">
                                  {item.subtext}
                                </div>
                              </div>
                            </div>

                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              {item.tag}
                            </span>
                          </div>

                          <p className="text-xs font-sans text-muted pl-11 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* TAB 4: ANALYTICS & HEALTH */}
                  {activeTab === 'analytics' && (
                    <motion.div
                      key="analytics-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {HEALTH_METRICS.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-full bg-surface border border-border font-mono font-bold text-[10px] text-foreground flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                              {item.initials}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-foreground font-mono">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-muted font-mono">
                                {item.subtext}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {item.tag}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
