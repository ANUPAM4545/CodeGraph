'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Github, 
  Sparkles, 
  Network, 
  Layers, 
  ShieldAlert, 
  BrainCircuit, 
  Cuboid, 
  Terminal,
  Search,
  Code2,
  FileCode,
  Box,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/Button';

const CAPABILITIES = [
  { name: 'Knowledge Graph', icon: Network },
  { name: 'AI Assistant', icon: BrainCircuit },
  { name: 'Impact Analysis', icon: ShieldAlert },
  { name: 'Repository Intelligence', icon: Layers },
  { name: '3D Codebase', icon: Cuboid },
  { name: 'IDE Integration', icon: Terminal },
];

const PREVIEW_NODES = [
  { id: '1', name: 'DisputeService', type: 'CLASS', file: 'src/services/dispute.ts', callers: 14, risk: 'HIGH', x: '45%', y: '45%' },
  { id: '2', name: 'calculateRiskScore()', type: 'FUNCTION', file: 'src/rules/risk.ts', callers: 12, risk: 'MEDIUM', x: '18%', y: '22%' },
  { id: '3', name: 'LedgerClient', type: 'CLASS', file: 'src/db/ledger.ts', callers: 8, risk: 'LOW', x: '72%', y: '25%' },
  { id: '4', name: 'dispute_router.py', type: 'FILE', file: 'src/api/routes.py', callers: 5, risk: 'LOW', x: '45%', y: '78%' },
];

export default function Hero() {
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic subtle node cycling (pauses when user hovers)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveNodeIdx((prev) => (prev + 1) % PREVIEW_NODES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeNode = PREVIEW_NODES[activeNodeIdx];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-background">
      
      {/* Fine Dotted Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Hero Text Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border bg-surface text-xs font-mono font-bold text-neutral-800 shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI-POWERED CODE INTELLIGENCE</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08]"
          >
            Understand Your Codebase. <br />
            <span className="text-neutral-500 font-extrabold">Before You Change It.</span>
          </motion.h1>

          {/* Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed font-normal"
          >
            CodeGraph turns complex repositories into living architectural knowledge graphs, giving developers and engineering teams a complete view of their code, dependencies, architecture, and impact.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-7 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-md hover:shadow-xl gap-2 group"
              >
                <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Connect GitHub</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <a href="#preview" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-6 rounded-full border-border hover:border-black hover:bg-surface text-xs font-semibold text-foreground transition-all"
              >
                <span>Explore the Platform</span>
              </Button>
            </a>
          </motion.div>

          {/* Compact Capability Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 flex items-center justify-center flex-wrap gap-2 sm:gap-3"
          >
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-[11px] font-mono font-medium text-neutral-700 shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{cap.name}</span>
                </div>
              );
            })}
          </motion.div>

        </div>

        {/* Realistic CodeGraph Hero Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-14 max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="rounded-3xl border border-border bg-white shadow-2xl overflow-hidden font-mono text-xs">
            
            {/* macOS Browser Header */}
            <div className="h-11 bg-neutral-50 border-b border-border px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neutral-300" />
                <div className="w-3 h-3 rounded-full bg-neutral-300" />
                <div className="w-3 h-3 rounded-full bg-neutral-300" />
              </div>

              {/* URL Pill */}
              <div className="px-4 py-0.5 rounded-full bg-white border border-border text-[11px] text-muted flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>codegraph.dev/app/marketplace-engine</span>
              </div>

              <div className="text-[11px] text-muted">
                <span>AST v1.4.2 · Live</span>
              </div>
            </div>

            {/* Product Body Viewport */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-white">
              
              {/* Left Sub-Sidebar (3 cols) */}
              <div className="hidden md:block md:col-span-3 border-r border-border p-4 bg-neutral-50/50 space-y-3">
                <div className="text-[10px] text-muted uppercase font-bold tracking-wider">
                  Repository Explorer
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-foreground font-bold p-1 rounded hover:bg-neutral-100 cursor-pointer">
                    <FileCode className="w-3.5 h-3.5 text-blue-500" />
                    <span>src/services/</span>
                  </div>
                  <div className="pl-4 space-y-1 text-muted">
                    <div className={`p-1 rounded cursor-pointer transition-colors ${activeNode.id === '1' ? 'bg-neutral-200 text-foreground font-bold' : 'hover:bg-neutral-100'}`} onClick={() => setActiveNodeIdx(0)}>
                      dispute.ts
                    </div>
                    <div className={`p-1 rounded cursor-pointer transition-colors ${activeNode.id === '2' ? 'bg-neutral-200 text-foreground font-bold' : 'hover:bg-neutral-100'}`} onClick={() => setActiveNodeIdx(1)}>
                      risk.ts
                    </div>
                    <div className={`p-1 rounded cursor-pointer transition-colors ${activeNode.id === '3' ? 'bg-neutral-200 text-foreground font-bold' : 'hover:bg-neutral-100'}`} onClick={() => setActiveNodeIdx(2)}>
                      ledger.ts
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border space-y-1 text-[10px] text-muted">
                  <div>AST Nodes: <strong className="text-foreground">1,452</strong></div>
                  <div>Edges: <strong className="text-foreground">3,890</strong></div>
                  <div>Health Score: <strong className="text-emerald-600">96/100</strong></div>
                </div>
              </div>

              {/* Center Graph Canvas (6 cols) */}
              <div className="md:col-span-6 relative h-[380px] bg-dot-pattern flex items-center justify-center p-4 overflow-hidden border-b md:border-b-0 md:border-r border-border select-none">
                
                {/* SVG Connecting Relationship Edges */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
                </svg>

                {/* Node 2: Risk Function */}
                <div 
                  onClick={() => setActiveNodeIdx(1)}
                  className={`absolute left-[12%] top-[15%] cursor-pointer p-2.5 rounded-xl border transition-all ${
                    activeNode.id === '2' 
                      ? 'border-purple-500 bg-purple-50 shadow-md scale-105' 
                      : 'border-border bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-foreground">
                    <Code2 className="w-3 h-3 text-purple-600" />
                    <span>calculateRiskScore()</span>
                  </div>
                  <div className="text-[9px] text-muted">Rules Engine</div>
                </div>

                {/* Node 3: Ledger Client */}
                <div 
                  onClick={() => setActiveNodeIdx(2)}
                  className={`absolute right-[12%] top-[18%] cursor-pointer p-2.5 rounded-xl border transition-all ${
                    activeNode.id === '3' 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105' 
                      : 'border-border bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-foreground">
                    <Box className="w-3 h-3 text-emerald-600" />
                    <span>LedgerClient</span>
                  </div>
                  <div className="text-[9px] text-muted">Database ORM</div>
                </div>

                {/* Node 1: Central DisputeService Class */}
                <div 
                  onClick={() => setActiveNodeIdx(0)}
                  className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all shadow-lg ${
                    activeNode.id === '1' 
                      ? 'border-black bg-white ring-4 ring-black/5 scale-110' 
                      : 'border-neutral-300 bg-white hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>DisputeService</span>
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">Class · Engine Subsystem</div>
                  <div className="mt-1.5 pt-1.5 border-t border-border flex items-center justify-between text-[9px] text-muted gap-2">
                    <span>Callers: 14</span>
                    <span className="text-red-600 font-bold">HIGH RISK</span>
                  </div>
                </div>

                {/* Node 4: FastAPI Router */}
                <div 
                  onClick={() => setActiveNodeIdx(3)}
                  className={`absolute bottom-[10%] cursor-pointer p-2.5 rounded-xl border transition-all ${
                    activeNode.id === '4' 
                      ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                      : 'border-border bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-foreground">
                    <FileCode className="w-3 h-3 text-blue-600" />
                    <span>dispute_router.py</span>
                  </div>
                  <div className="text-[9px] text-muted">FastAPI Route</div>
                </div>

              </div>

              {/* Right Details Panel (3 cols) */}
              <div className="md:col-span-3 p-4 bg-neutral-50/30 flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="text-[10px] text-muted uppercase font-bold tracking-wider">
                    Node Telemetry
                  </div>

                  <div className="p-3 rounded-2xl border border-border bg-white shadow-2xs space-y-2">
                    <div className="font-extrabold text-foreground text-xs">{activeNode.name}</div>
                    <div className="text-[10px] text-muted">{activeNode.file}</div>
                    <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
                      <span className="text-muted">Fan-in Callers:</span>
                      <strong className="text-foreground">{activeNode.callers}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted">Impact Score:</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                        activeNode.risk === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {activeNode.risk}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted leading-tight font-sans">
                    Auto-synchronized with Neo4j AST property graph in real-time.
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 font-mono">
                  Press any node to inspect
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
