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
  GitBranch
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
  const [activeTabId, setActiveTabId] = useState('graph');
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through tabs (pauses on hover)
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

  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[2];

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
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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
          className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none"
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

        {/* Large Browser-Style Product Showcase Container */}
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
              <span className="hidden sm:inline">{activeTab.title}</span>
            </div>
          </div>

          {/* Dynamic Content Viewport based on selected tab */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px] bg-white">
            
            {/* Left Sidebar: Repository Tree (3 cols) */}
            <div className="hidden md:block md:col-span-3 border-r border-border p-5 bg-neutral-50/60 space-y-4">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border">
                <span className="font-extrabold text-foreground">PROJECT TREE</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DAG CLEAN
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-neutral-700" />
                    <span>marketplace-engine/</span>
                  </div>
                  <div className="pl-4 space-y-1 text-muted">
                    <div className="p-1 rounded bg-neutral-200/80 text-foreground font-bold flex items-center gap-1.5">
                      <FileCode className="w-3 h-3 text-blue-500" />
                      <span>src/services/</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      <div className="text-foreground font-bold">dispute.ts</div>
                      <div>arbitration.ts</div>
                      <div>payout.ts</div>
                    </div>
                    <div className="p-1 rounded flex items-center gap-1.5">
                      <FileCode className="w-3 h-3 text-purple-500" />
                      <span>src/domain/</span>
                    </div>
                    <div className="p-1 rounded flex items-center gap-1.5">
                      <FileCode className="w-3 h-3 text-emerald-500" />
                      <span>src/db/</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-1.5 text-[10px] text-muted">
                <div>Files Analyzed: <strong className="text-foreground font-bold">148</strong></div>
                <div>Topological Edges: <strong className="text-foreground font-bold">3,890</strong></div>
                <div>Risk Hotspots: <strong className="text-red-600 font-bold">0 Detected</strong></div>
              </div>
            </div>

            {/* Center Canvas: Interactive Architecture / Graph (6 cols) */}
            <div className="md:col-span-6 relative h-[440px] bg-dot-pattern flex items-center justify-center p-6 overflow-hidden border-b md:border-b-0 md:border-r border-border select-none">
              
              {/* Dynamic SVG Visualizer Grid */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <circle cx="50%" cy="50%" r="130" stroke="#EDEDED" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <circle cx="50%" cy="50%" r="70" stroke="#E5E5E5" strokeWidth="1" fill="none" />
                <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="50%" y2="82%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
              </svg>

              {/* Node 2: Risk Function */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute left-[10%] top-[15%] cursor-pointer p-3 rounded-2xl border border-purple-200 bg-purple-50/80 shadow-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                  <Code2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>calculateRiskScore()</span>
                </div>
                <div className="text-[10px] text-muted">Calls DisputeService</div>
              </motion.div>

              {/* Node 3: Ledger Client */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute right-[10%] top-[18%] cursor-pointer p-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 shadow-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                  <Box className="w-3.5 h-3.5 text-emerald-600" />
                  <span>LedgerClient</span>
                </div>
                <div className="text-[10px] text-muted">PostgreSQL Driver</div>
              </motion.div>

              {/* Node 1: Central Target Class (DisputeService) */}
              <motion.div 
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="cursor-pointer p-4 sm:p-5 rounded-2xl border-2 border-black bg-white shadow-xl ring-4 ring-black/5 z-10"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>DisputeService</span>
                </div>
                <div className="text-[11px] text-muted mt-0.5">Class · Engine Subsystem</div>
                <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted gap-3">
                  <span>Fan-in: 14</span>
                  <span className="text-red-600 font-bold">HIGH RISK</span>
                </div>
              </motion.div>

              {/* Node 4: FastAPI Router */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-[8%] cursor-pointer p-3 rounded-2xl border border-blue-200 bg-blue-50/80 shadow-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>dispute_router.py</span>
                </div>
                <div className="text-[10px] text-muted">POST /api/v1/disputes</div>
              </motion.div>

            </div>

            {/* Right Details Panel (3 cols) */}
            <div className="md:col-span-3 p-5 bg-neutral-50/40 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold text-foreground uppercase tracking-wider pb-2 border-b border-border">
                  Node Telemetry
                </div>

                <div className="p-4 rounded-2xl border border-border bg-white shadow-2xs space-y-2.5">
                  <div className="font-extrabold text-foreground text-xs">DisputeService.ts</div>
                  <div className="text-[10px] text-muted">src/services/dispute.ts</div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
                    <span className="text-muted">AST Depth:</span>
                    <strong className="text-foreground">Level 4</strong>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Direct Callers:</span>
                    <strong className="text-foreground">14 Methods</strong>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Grounded Accuracy:</span>
                    <strong className="text-emerald-600 font-bold">99.4%</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-border bg-white shadow-2xs space-y-1.5">
                  <div className="text-[10px] text-muted uppercase font-bold">Cypher Node Match</div>
                  <div className="text-[10px] text-purple-700 font-mono bg-purple-50 p-2 rounded-lg leading-tight">
                    (:Class &#123;name: &quot;DisputeService&quot;&#125;)
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-muted font-mono flex items-center justify-between pt-2 border-t border-border">
                <span>Neo4j 5 ACID</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
