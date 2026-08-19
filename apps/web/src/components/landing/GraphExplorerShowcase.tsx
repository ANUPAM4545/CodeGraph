'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Search, 
  Filter, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Box, 
  Code2, 
  FileCode, 
  Folder,
  CheckCircle2,
  Cpu,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'FILE' | 'CLASS' | 'FUNCTION' | 'PACKAGE';
  subsystem: string;
  x: number;
  y: number;
  connections: string[];
  callers: number;
  dependencies: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

const NODES: GraphNode[] = [
  { id: '1', name: 'DisputeService', type: 'CLASS', subsystem: 'Engine Subsystem', x: 380, y: 190, connections: ['2', '3', '4'], callers: 14, dependencies: 6, risk: 'HIGH' },
  { id: '2', name: 'calculateRiskScore()', type: 'FUNCTION', subsystem: 'Rules Engine', x: 180, y: 90, connections: ['1'], callers: 12, dependencies: 4, risk: 'HIGH' },
  { id: '3', name: 'LedgerRepository', type: 'CLASS', subsystem: 'Database Client', x: 580, y: 100, connections: ['1', '5'], callers: 8, dependencies: 2, risk: 'MEDIUM' },
  { id: '4', name: 'dispute_router.py', type: 'FILE', subsystem: 'FastAPI Router', x: 380, y: 320, connections: ['1'], callers: 5, dependencies: 1, risk: 'LOW' },
  { id: '5', name: 'sqlalchemy', type: 'PACKAGE', subsystem: 'External ORM', x: 680, y: 260, connections: ['3'], callers: 4, dependencies: 0, risk: 'LOW' },
];

const FILTERS = ['ALL', 'CLASS', 'FUNCTION', 'FILE', 'PACKAGE'];

export default function GraphExplorerShowcase() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(NODES[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNodes = filterType === 'ALL' 
    ? NODES 
    : NODES.filter(n => n.type === filterType);

  return (
    <section id="architecture" className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>TOPOLOGICAL GRAPH EXPLORER</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            See the architecture behind the code.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            CodeGraph converts raw source code into an interactive, navigable architectural graph. Inspect callers, trace dependencies, and uncover coupling hotspots.
          </p>
        </div>

        {/* macOS Style Graph Window Container */}
        <div className="rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden max-w-5xl mx-auto">
          
          {/* Top Window Bar */}
          <div className="h-12 bg-background/90 backdrop-blur-md border-b border-border px-5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
            </div>

            {/* Address Pill */}
            <div className="px-4 py-1 rounded-full bg-surface border border-border font-mono text-[11px] text-muted flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>codegraph.dev/app/graph-explorer</span>
            </div>

            <div className="flex items-center gap-2 text-muted text-[11px] font-mono">
              <span className="hidden sm:inline">React Flow Engine</span>
              <ZoomIn className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Canvas Header Controls */}
          <div className="p-4 bg-background border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            {/* Search Input Simulation */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-muted w-full sm:w-64">
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px] text-foreground font-bold">{selectedNode.name}</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-full border border-border">
              {FILTERS.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    filterType === type 
                      ? 'bg-black text-white shadow-xs' 
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Graph Viewport Canvas */}
          <div className="relative h-[420px] bg-background bg-dot-pattern overflow-hidden p-6 select-none flex items-center justify-center">
            
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Curve 1: Node 1 to Node 2 */}
              <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
              {/* Curve 2: Node 1 to Node 3 */}
              <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
              {/* Curve 3: Node 1 to Node 4 */}
              <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
              {/* Curve 4: Node 3 to Node 5 */}
              <line x1="75%" y1="25%" x2="85%" y2="65%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Interactive Node Pills */}
            <div className="relative w-full h-full">
              
              {/* Node 2: Caller Function */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedNode(NODES[1])}
                className={`absolute left-[10%] sm:left-[15%] top-[15%] cursor-pointer p-3 rounded-2xl border transition-all ${
                  selectedNode.id === '1' || selectedNode.id === '2'
                    ? 'border-purple-500/40 bg-purple-500/5 shadow-md'
                    : 'border-border bg-surface opacity-70'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Code2 className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-bold text-foreground">calculateRiskScore()</span>
                </div>
                <div className="text-[10px] text-muted font-mono mt-0.5">Calls DisputeService</div>
              </motion.div>

              {/* Node 3: Database Client */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedNode(NODES[2])}
                className={`absolute right-[10%] sm:right-[15%] top-[15%] cursor-pointer p-3 rounded-2xl border transition-all ${
                  selectedNode.id === '1' || selectedNode.id === '3'
                    ? 'border-emerald-500/40 bg-emerald-500/5 shadow-md'
                    : 'border-border bg-surface opacity-70'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Box className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-foreground">LedgerRepository</span>
                </div>
                <div className="text-[10px] text-muted font-mono mt-0.5">Database Client</div>
              </motion.div>

              {/* Node 1: Central Target Class (DisputeService) */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                onClick={() => setSelectedNode(NODES[0])}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xl ${
                  selectedNode.id === '1'
                    ? 'border-black bg-surface scale-105 ring-4 ring-black/5'
                    : 'border-neutral-300 bg-background hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2.5 font-mono text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-black text-foreground">{NODES[0].name}</span>
                </div>
                <div className="text-[11px] text-muted font-mono mt-1">Class · Engine Subsystem</div>
                <div className="mt-2 pt-2 border-t border-border/80 flex items-center justify-between text-[10px] font-mono text-muted gap-3">
                  <span>Fan-in: 14</span>
                  <span className="text-red-600 font-bold">HIGH RISK</span>
                </div>
              </motion.div>

              {/* Node 4: API Router File */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedNode(NODES[3])}
                className={`absolute left-1/2 -translate-x-1/2 bottom-[12%] cursor-pointer p-3 rounded-2xl border transition-all ${
                  selectedNode.id === '1' || selectedNode.id === '4'
                    ? 'border-blue-500/40 bg-blue-500/5 shadow-md'
                    : 'border-border bg-surface opacity-70'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs">
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold text-foreground">dispute_router.py</span>
                </div>
                <div className="text-[10px] text-muted font-mono mt-0.5">FastAPI Router</div>
              </motion.div>

              {/* Node 5: External Package */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedNode(NODES[4])}
                className="absolute right-[5%] bottom-[20%] cursor-pointer p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 transition-all"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-bold text-foreground">sqlalchemy</span>
                </div>
                <div className="text-[9px] text-muted font-mono">External ORM</div>
              </motion.div>

            </div>

            {/* Bottom Status Selection Bar */}
            <div className="absolute bottom-4 left-6 right-6 p-3 rounded-2xl bg-surface/90 backdrop-blur-sm border border-border flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-muted">Selected: </span>
                <strong className="text-foreground">{selectedNode.name}</strong>
                <span className="text-muted ml-1">({selectedNode.type})</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-muted">Subsystem:</span>
                <span className="font-bold text-foreground bg-background px-2 py-0.5 rounded border border-border">
                  {selectedNode.subsystem}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
