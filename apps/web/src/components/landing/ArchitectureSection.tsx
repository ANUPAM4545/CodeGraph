'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Layers, 
  Search, 
  Code2, 
  FileCode, 
  Box, 
  FolderGit2, 
  CheckCircle2, 
  ZoomIn, 
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  type: 'MODULE' | 'SERVICE' | 'DOMAIN' | 'INFRA' | 'CONTROLLER' | 'MODEL';
  subsystem: string;
  file: string;
  callers: number;
  dependencies: number;
  connections: string[];
  x: string;
  y: string;
}

const REAL_NODES: ArchNode[] = [
  { id: 'auth', name: 'auth/service.py', type: 'SERVICE', subsystem: 'Authentication Domain', file: 'src/auth/service.py', callers: 18, dependencies: 4, connections: ['domain', 'models', 'controllers'], x: '46%', y: '42%' },
  { id: 'controllers', name: 'controllers/dispute.py', type: 'CONTROLLER', subsystem: 'API Layer', file: 'src/controllers/dispute.py', callers: 12, dependencies: 6, connections: ['auth', 'services'], x: '20%', y: '20%' },
  { id: 'services', name: 'services/dispute.ts', type: 'SERVICE', subsystem: 'Engine Core', file: 'src/services/dispute.ts', callers: 14, dependencies: 5, connections: ['auth', 'domain', 'infrastructure'], x: '75%', y: '22%' },
  { id: 'domain', name: 'domain/arbitration.ts', type: 'DOMAIN', subsystem: 'Business Rules', file: 'src/domain/arbitration.ts', callers: 9, dependencies: 2, connections: ['auth', 'models'], x: '18%', y: '72%' },
  { id: 'infrastructure', name: 'infrastructure/neo4j.py', type: 'INFRA', subsystem: 'Database Client', file: 'src/infrastructure/neo4j.py', callers: 22, dependencies: 1, connections: ['services', 'models'], x: '76%', y: '74%' },
  { id: 'models', name: 'models/dispute.py', type: 'MODEL', subsystem: 'Persistence Layer', file: 'src/models/dispute.py', callers: 16, dependencies: 0, connections: ['infrastructure', 'domain'], x: '46%', y: '84%' },
];

const LAYERS = ['ALL', 'SERVICES', 'DOMAIN', 'INFRASTRUCTURE', 'CONTROLLERS', 'MODELS'];

export default function ArchitectureSection() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('auth');
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-cycle through nodes (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSelectedNodeId((current) => {
        const idx = REAL_NODES.findIndex((n) => n.id === current);
        return REAL_NODES[(idx + 1) % REAL_NODES.length].id;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const selectedNode = REAL_NODES.find((n) => n.id === selectedNodeId) || REAL_NODES[0];

  return (
    <section id="architecture" className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
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
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>KNOWLEDGE GRAPH & TOPOLOGY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            See How Your Codebase Is Connected.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-normal">
            CodeGraph maps the architecture beneath your repository so you can understand systems at a glance.
          </p>
        </div>

        {/* 2-Column Split: Architectural Insights (Left) vs Interactive Graph Visualization (Right) */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Left Column: Text + Capabilities + Telemetry (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-foreground tracking-tight font-mono">
                Lossless Topological Property Graph
              </h3>
              <p className="text-sm text-muted leading-relaxed font-sans">
                Every file, class, function, and module is extracted using concrete AST grammars and stored with typed relationship edges (<code className="text-foreground font-bold">CALLS</code>, <code className="text-foreground font-bold">IMPORTS</code>, <code className="text-foreground font-bold">INHERITS</code>) in Neo4j.
              </p>

              {/* Layer Filter Pills */}
              <div className="pt-2">
                <div className="text-[10px] text-muted font-mono uppercase font-bold mb-2">
                  Architectural Layers
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LAYERS.map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setSelectedLayer(layer)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                        selectedLayer === layer
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-white text-neutral-600 border border-border hover:border-black'
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Node Inspector Card */}
            <div className="p-5 rounded-3xl border border-border bg-white shadow-sm space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <strong className="text-foreground font-extrabold">{selectedNode.name}</strong>
                </div>
                <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200 font-bold">
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-muted">
                <div>Subsystem: <strong className="text-foreground">{selectedNode.subsystem}</strong></div>
                <div>Source File: <strong className="text-foreground font-mono">{selectedNode.file}</strong></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[11px]">
                <div className="p-2 rounded-xl bg-neutral-50 border border-border">
                  <div className="text-muted text-[10px]">Fan-in Callers</div>
                  <div className="text-base font-black text-foreground">{selectedNode.callers}</div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 border border-border">
                  <div className="text-muted text-[10px]">Dependencies</div>
                  <div className="text-base font-black text-foreground">{selectedNode.dependencies}</div>
                </div>
              </div>
            </div>

            {/* Floating Metric Panel */}
            <div className="p-4 rounded-2xl border border-border bg-white shadow-xs flex items-center justify-between font-mono text-xs">
              <div className="text-center">
                <div className="text-base font-black text-foreground">148</div>
                <div className="text-[10px] text-muted">Files</div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-foreground">412</div>
                <div className="text-[10px] text-muted">Functions</div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-foreground">86</div>
                <div className="text-[10px] text-muted">Classes</div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-foreground">23</div>
                <div className="text-[10px] text-muted">Dependencies</div>
              </div>
              <div className="text-center">
                <div className="text-base font-black text-foreground">6</div>
                <div className="text-[10px] text-muted">Modules</div>
              </div>
            </div>

          </div>

          {/* Right Column: Large Interactive Graph Canvas (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-white shadow-xl overflow-hidden flex flex-col font-mono text-xs">
            
            {/* Graph Header Controls */}
            <div className="h-11 bg-neutral-50 border-b border-border px-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-600" />
                <span className="font-extrabold text-foreground">Knowledge Graph Viewport</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <span>Neo4j Cypher Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Interactive Graph Canvas */}
            <div className="relative h-[480px] bg-dot-pattern flex items-center justify-center p-6 select-none overflow-hidden">
              
              {/* Dynamic SVG Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="46%" y1="42%" x2="20%" y2="20%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="46%" y1="42%" x2="75%" y2="22%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="46%" y1="42%" x2="18%" y2="72%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="46%" y1="42%" x2="76%" y2="74%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="46%" y1="42%" x2="46%" y2="84%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="75%" y1="22%" x2="76%" y2="74%" stroke="#E5E5E5" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

              {/* Render 6 Realistic Architecture Nodes */}
              {REAL_NODES.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isConnected = selectedNode.connections.includes(node.id) || node.connections.includes(selectedNode.id);

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: node.x, top: node.y }}
                    whileHover={{ scale: 1.08 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-2 border-black bg-white shadow-xl ring-4 ring-black/5 z-20 scale-105'
                        : isConnected
                        ? 'border-neutral-400 bg-white shadow-sm z-10'
                        : 'border-border bg-neutral-50/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-extrabold text-xs text-foreground">
                      <span className={`w-2 h-2 rounded-full ${
                        node.type === 'SERVICE' ? 'bg-purple-500' :
                        node.type === 'DOMAIN' ? 'bg-emerald-500' :
                        node.type === 'INFRA' ? 'bg-blue-500' :
                        node.type === 'CONTROLLER' ? 'bg-amber-500' : 'bg-neutral-600'
                      }`} />
                      <span>{node.name}</span>
                    </div>
                    <div className="text-[10px] text-muted mt-0.5 font-normal">
                      {node.subsystem}
                    </div>
                  </motion.div>
                );
              })}

              {/* Bottom Instructions Badge */}
              <div className="absolute bottom-4 left-6 right-6 p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-border flex items-center justify-between text-[11px]">
                <span className="text-muted">Click any node to focus architectural sub-graph</span>
                <span className="text-foreground font-bold font-mono">6 Subsystems Connected</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
