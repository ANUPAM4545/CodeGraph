'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Box, 
  Code2, 
  ArrowUpRight, 
  Sparkles, 
  Search, 
  Maximize2, 
  Layers, 
  ShieldAlert, 
  GitBranch, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Compass,
  Cpu
} from 'lucide-react';

interface MockNode {
  id: string;
  label: string;
  type: 'DIRECTORY' | 'FILE' | 'CLASS' | 'FUNCTION' | 'PACKAGE';
  path: string;
  subsystem: string;
  callers: number;
  dependencies: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

const DEMO_NODES: MockNode[] = [
  { id: '1', label: 'DisputeOrchestrator', type: 'CLASS', path: 'src/services/dispute.ts', subsystem: 'Engine', callers: 8, dependencies: 6, risk: 'HIGH' },
  { id: '2', label: 'executeRulePipeline()', type: 'FUNCTION', path: 'src/rules/pipeline.ts', subsystem: 'Rules', callers: 14, dependencies: 4, risk: 'HIGH' },
  { id: '3', label: 'LedgerClient', type: 'CLASS', path: 'src/db/ledger.ts', subsystem: 'Database', callers: 5, dependencies: 2, risk: 'MEDIUM' },
  { id: '4', label: 'validateSignature()', type: 'FUNCTION', path: 'src/crypto/auth.ts', subsystem: 'Security', callers: 12, dependencies: 1, risk: 'LOW' },
  { id: '5', label: 'stripe', type: 'PACKAGE', path: 'node_modules/stripe', subsystem: 'External', callers: 3, dependencies: 0, risk: 'LOW' },
];

export default function ProductPreview() {
  const [selectedNode, setSelectedNode] = useState<MockNode>(DEMO_NODES[0]);
  const [activeTab, setActiveTab] = useState<'graph' | 'architecture' | 'ai'>('graph');

  return (
    <section id="product" className="py-12 md:py-20 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>INTERACTIVE PRODUCT EXPERIENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            A live architectural window into your repository.
          </h2>
          <p className="text-sm text-muted">
            Explore topological relationships, blast radius, and grounded code evidence in real-time.
          </p>
        </div>

        {/* Product Window Shell */}
        <div className="rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
          
          {/* Top Window Bar */}
          <div className="h-11 bg-background border-b border-border px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              </div>
              <span className="font-mono font-bold text-foreground flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-muted" />
                <span>MarketPlace-Dispute-Engine</span>
                <span className="text-[10px] text-muted font-normal">/ main (sha: 7f8a92)</span>
              </span>
            </div>

            {/* Middle Nav Tabs */}
            <div className="hidden sm:flex items-center border border-border rounded-lg bg-surface p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'graph' ? 'bg-background text-foreground font-bold shadow-2xs' : 'text-muted hover:text-foreground'
                }`}
              >
                Graph Explorer
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'architecture' ? 'bg-background text-foreground font-bold shadow-2xs' : 'text-muted hover:text-foreground'
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'ai' ? 'bg-background text-foreground font-bold shadow-2xs' : 'text-muted hover:text-foreground'
                }`}
              >
                AI Assistant
              </button>
            </div>

            {/* Sync Badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>SYNCED</span>
            </div>
          </div>

          {/* Product Body Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 h-[520px] bg-background">
            
            {/* Left Column: Repository Hierarchy Tree */}
            <div className="hidden md:block md:col-span-3 border-r border-border p-3 overflow-y-auto font-mono text-xs space-y-1 bg-surface/50">
              <div className="text-[10px] uppercase tracking-wider text-muted font-bold px-2 py-1 mb-1">
                Repository Files
              </div>
              
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 px-2 py-1 text-foreground font-medium rounded hover:bg-surface cursor-pointer">
                  <ChevronDown className="w-3 h-3 text-muted" />
                  <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span>src/services</span>
                </div>
                
                <div 
                  onClick={() => setSelectedNode(DEMO_NODES[0])}
                  className={`ml-4 flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${
                    selectedNode.id === '1' ? 'bg-black text-white font-bold' : 'text-muted hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">dispute.ts</span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1 text-foreground font-medium rounded hover:bg-surface cursor-pointer">
                  <ChevronDown className="w-3 h-3 text-muted" />
                  <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span>src/rules</span>
                </div>

                <div 
                  onClick={() => setSelectedNode(DEMO_NODES[1])}
                  className={`ml-4 flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${
                    selectedNode.id === '2' ? 'bg-black text-white font-bold' : 'text-muted hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">pipeline.ts</span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1 text-foreground font-medium rounded hover:bg-surface cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-muted" />
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>src/db</span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1 text-foreground font-medium rounded hover:bg-surface cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-muted" />
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>src/crypto</span>
                </div>
              </div>
            </div>

            {/* Middle Column: Graph Visualization Canvas */}
            <div className="col-span-12 md:col-span-6 relative p-6 flex flex-col justify-between overflow-hidden bg-dot-pattern">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-[11px] font-mono text-muted bg-surface px-2.5 py-1 rounded-lg border border-border shadow-2xs">
                  <Search className="w-3 h-3" />
                  <span>Filter: Classes, Functions, Packages</span>
                </div>
                <div className="text-[10px] font-mono text-muted">
                  Depth: 2 hops · 48 AST Nodes
                </div>
              </div>

              {/* Central Graph Node Cluster Preview */}
              <div className="relative my-auto flex flex-col items-center justify-center gap-6 py-6">
                
                {/* Top Caller Node */}
                <div 
                  onClick={() => setSelectedNode(DEMO_NODES[1])}
                  className="cursor-pointer border border-purple-500/30 bg-purple-500/5 hover:border-purple-500 px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 shadow-sm transition-all"
                >
                  <Code2 className="w-3.5 h-3.5 text-purple-500" />
                  <span className="font-bold text-foreground">executeRulePipeline()</span>
                  <span className="text-[10px] text-muted">Rules</span>
                </div>

                {/* Connecting Edge Indicator */}
                <div className="w-px h-6 bg-border relative">
                  <span className="absolute top-1 -left-4 text-[9px] font-mono text-muted bg-background px-1 border border-border rounded">CALLS</span>
                </div>

                {/* Central Focused Node */}
                <div 
                  onClick={() => setSelectedNode(DEMO_NODES[0])}
                  className="cursor-pointer border-2 border-black bg-surface px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-3 shadow-md scale-105 transition-all"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="font-extrabold text-foreground">{DEMO_NODES[0].label}</div>
                    <div className="text-[10px] text-muted">{DEMO_NODES[0].path}</div>
                  </div>
                  <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-bold">FOCUS</span>
                </div>

                {/* Connecting Edge Indicator */}
                <div className="w-px h-6 bg-border relative">
                  <span className="absolute top-1 -left-5 text-[9px] font-mono text-muted bg-background px-1 border border-border rounded">IMPORTS</span>
                </div>

                {/* Bottom Dependency Node */}
                <div 
                  onClick={() => setSelectedNode(DEMO_NODES[2])}
                  className="cursor-pointer border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 shadow-sm transition-all"
                >
                  <Box className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-bold text-foreground">LedgerClient</span>
                  <span className="text-[10px] text-muted">Database</span>
                </div>

              </div>

              {/* Bottom Legend */}
              <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-2 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Directory</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> File</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Class</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Function</span>
                </div>
                <span>React Flow Engine</span>
              </div>

            </div>

            {/* Right Column: Node Inspector & Architectural Signals */}
            <div className="hidden md:block md:col-span-3 border-l border-border p-4 overflow-y-auto font-mono text-xs space-y-4 bg-surface/30">
              <div className="text-[10px] uppercase tracking-wider text-muted font-bold pb-1 border-b border-border">
                Node Inspector
              </div>

              <div>
                <div className="text-sm font-extrabold text-foreground">{selectedNode.label}</div>
                <div className="text-[11px] text-muted break-all mt-0.5">{selectedNode.path}</div>
              </div>

              {/* Blast Radius Metrics */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-[10px] text-muted uppercase font-bold">Blast Radius Metrics</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-[10px] text-muted">Incoming Callers</div>
                    <div className="text-base font-bold text-foreground">{selectedNode.callers}</div>
                  </div>
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-[10px] text-muted">Dependencies</div>
                    <div className="text-base font-bold text-foreground">{selectedNode.dependencies}</div>
                  </div>
                </div>
              </div>

              {/* Architectural Risk Badge */}
              <div className="p-2.5 rounded-lg border border-border bg-background space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted">Architectural Risk:</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    selectedNode.risk === 'HIGH' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                    selectedNode.risk === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  }`}>
                    {selectedNode.risk} RISK
                  </span>
                </div>
                <p className="text-[10px] text-muted font-sans leading-tight">
                  High fan-in across multiple subsystems. Modifying requires regression validation.
                </p>
              </div>

              {/* Grounded AI Prompt Preview */}
              <div className="p-2.5 rounded-lg border border-border bg-background space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>AI Architecture Query</span>
                </div>
                <p className="text-[11px] text-muted font-sans leading-snug">
                  &quot;Explain how {selectedNode.label} orchestrates state changes across {selectedNode.subsystem}.&quot;
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
