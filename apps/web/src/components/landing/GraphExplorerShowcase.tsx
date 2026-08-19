'use client';

import React, { useState } from 'react';
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
  Folder 
} from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'FILE' | 'CLASS' | 'FUNCTION' | 'PACKAGE';
  subsystem: string;
  x: number;
  y: number;
  connections: string[];
}

const NODES: GraphNode[] = [
  { id: '1', name: 'DisputeService', type: 'CLASS', subsystem: 'Engine', x: 280, y: 150, connections: ['2', '3', '4'] },
  { id: '2', name: 'calculateRiskScore()', type: 'FUNCTION', subsystem: 'Rules', x: 120, y: 80, connections: ['1'] },
  { id: '3', name: 'LedgerRepository', type: 'CLASS', subsystem: 'Database', x: 440, y: 90, connections: ['1', '5'] },
  { id: '4', name: 'dispute_router.py', type: 'FILE', subsystem: 'API', x: 280, y: 270, connections: ['1'] },
  { id: '5', name: 'sqlalchemy', type: 'PACKAGE', subsystem: 'External', x: 480, y: 220, connections: ['3'] },
];

export default function GraphExplorerShowcase() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(NODES[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNodes = filterType === 'ALL' 
    ? NODES 
    : NODES.filter(n => n.type === filterType);

  return (
    <section id="architecture" className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>GRAPH EXPLORER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            See the architecture behind the code.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            CodeGraph converts source code into a navigable architectural graph. Inspect callers, trace dependencies, and uncover coupling hotspots.
          </p>
        </div>

        {/* Interactive Canvas Mockup */}
        <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-lg">
          
          {/* Canvas Toolbar */}
          <div className="h-12 bg-background border-b border-border px-4 flex items-center justify-between gap-4 text-xs font-mono">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-border w-64">
              <Search className="w-3.5 h-3.5 text-muted" />
              <input 
                type="text" 
                placeholder="Search symbols or files..." 
                className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-muted/60"
                readOnly
                value="DisputeService"
              />
            </div>

            {/* Filter Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
              {['ALL', 'CLASS', 'FUNCTION', 'FILE', 'PACKAGE'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterType === type 
                      ? 'bg-black text-white font-bold' 
                      : 'text-muted hover:text-foreground hover:bg-surface border border-transparent'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Canvas Controls */}
            <div className="flex items-center gap-2 text-muted">
              <span className="text-[10px]">React Flow Engine</span>
              <button className="p-1 rounded hover:bg-surface"><ZoomIn className="w-3.5 h-3.5" /></button>
              <button className="p-1 rounded hover:bg-surface"><ZoomOut className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Canvas SVG Body */}
          <div className="relative h-[420px] bg-background overflow-hidden flex items-center justify-center">
            
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ 
                backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
                backgroundSize: '20px 20px' 
              }} 
            />

            {/* Node Links SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Lines from center to others */}
              <line x1="50%" y1="50%" x2="25%" y2="28%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="#E5E5E5" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="50%" y2="78%" stroke="#E5E5E5" strokeWidth="2" />
              <line x1="75%" y1="30%" x2="82%" y2="65%" stroke="#E5E5E5" strokeWidth="2" />
            </svg>

            {/* Rendered AST Nodes */}
            <div className="relative w-full h-full max-w-2xl mx-auto flex items-center justify-center">
              
              {/* Node 1 (Center Target) */}
              <div 
                onClick={() => setSelectedNode(NODES[0])}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-xl border-2 border-black bg-surface shadow-xl cursor-pointer hover:scale-105 transition-all text-xs font-mono z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-extrabold text-foreground">{NODES[0].name}</span>
                </div>
                <div className="text-[10px] text-muted mt-1">Class · Engine Subsystem</div>
              </div>

              {/* Node 2 (Top Left Function) */}
              <div 
                onClick={() => setSelectedNode(NODES[1])}
                className="absolute top-12 left-12 p-3 rounded-lg border border-purple-500/40 bg-purple-500/5 hover:border-purple-500 shadow-sm cursor-pointer hover:scale-105 transition-all text-xs font-mono z-10"
              >
                <div className="flex items-center gap-1.5 text-purple-600 font-bold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{NODES[1].name}</span>
                </div>
                <div className="text-[10px] text-muted mt-0.5">Calls DisputeService</div>
              </div>

              {/* Node 3 (Top Right Class) */}
              <div 
                onClick={() => setSelectedNode(NODES[2])}
                className="absolute top-14 right-16 p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500 shadow-sm cursor-pointer hover:scale-105 transition-all text-xs font-mono z-10"
              >
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <Box className="w-3.5 h-3.5" />
                  <span>{NODES[2].name}</span>
                </div>
                <div className="text-[10px] text-muted mt-0.5">Database Client</div>
              </div>

              {/* Node 4 (Bottom File) */}
              <div 
                onClick={() => setSelectedNode(NODES[3])}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 p-3 rounded-lg border border-blue-500/40 bg-blue-500/5 hover:border-blue-500 shadow-sm cursor-pointer hover:scale-105 transition-all text-xs font-mono z-10"
              >
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{NODES[3].name}</span>
                </div>
                <div className="text-[10px] text-muted mt-0.5">FastAPI Router</div>
              </div>

              {/* Node 5 (Far Right Package) */}
              <div 
                onClick={() => setSelectedNode(NODES[4])}
                className="absolute bottom-20 right-8 p-2.5 rounded-lg border border-amber-500/40 bg-amber-500/5 hover:border-amber-500 shadow-sm cursor-pointer hover:scale-105 transition-all text-xs font-mono z-10"
              >
                <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{NODES[4].name}</span>
                </div>
                <div className="text-[10px] text-muted mt-0.5">External ORM</div>
              </div>

            </div>

            {/* Bottom Left Active Node Pill */}
            <div className="absolute bottom-3 left-4 bg-background/90 backdrop-blur border border-border px-3 py-1.5 rounded-lg text-xs font-mono text-foreground shadow-sm">
              Selected: <span className="font-bold text-foreground">{selectedNode.name}</span> ({selectedNode.type})
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
