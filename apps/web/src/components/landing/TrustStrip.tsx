'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, 
  Database, 
  Layers, 
  Cpu, 
  Zap, 
  Network, 
  Box,
  Server,
  HardDrive,
  Container,
  CheckCircle2
} from 'lucide-react';

interface PartnerItem {
  initial: string;
  name: string;
  category: string;
  spec: string;
  detail: string;
}

const PARTNERS: PartnerItem[] = [
  { initial: 'T', name: 'Tree-sitter', category: 'AST Engine', spec: 'v0.22 C-Grammar', detail: 'Lossless concrete syntax tree parsing for multi-language repositories.' },
  { initial: 'N', name: 'Neo4j 5', category: 'Graph Database', spec: 'Bolt Protocol', detail: 'Canonical topological property graph with Cypher traversal.' },
  { initial: 'Q', name: 'Qdrant', category: 'Vector Store', spec: 'HNSW Cosine', detail: 'Dense embeddings index with Graph-RAG context payloads.' },
  { initial: 'F', name: 'FastAPI', category: 'Core Gateway', spec: 'Async ASGI', detail: 'High-throughput async API with Pydantic V2 schemas.' },
  { initial: 'N', name: 'Next.js 14', category: 'React Framework', spec: 'App Router SSR', detail: 'Server Components with zero-latency visualizer canvas.' },
  { initial: 'R', name: 'React Flow', category: 'Graph Canvas', spec: 'GPU Nodal Engine', detail: 'Interactive nodal canvas rendering large-scale dependency trees.' },
  { initial: 'T', name: 'Three.js / R3F', category: '3D Viewport', spec: 'WebGL 2.0', detail: 'Spatial universe visualizer with gravitational planetary clustering.' },
  { initial: 'P', name: 'PostgreSQL', category: 'Relational DB', spec: 'SQLAlchemy', detail: 'Multi-tenant repository metadata, version trees, and audit logs.' },
  { initial: 'R', name: 'Redis / RQ', category: 'Task Queue', spec: 'Async Pipeline', detail: 'Background AST extraction workers and incremental diff sync.' },
  { initial: 'D', name: 'Docker', category: 'Container Engine', spec: 'Production Pod', detail: 'Isolated containerized service orchestration across 7 daemon pods.' },
];

export default function TrustStrip() {
  const [hoveredPartner, setHoveredPartner] = useState<PartnerItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate the array for a seamless infinite loop
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-12 bg-background border-b border-border overflow-hidden relative">
      
      {/* Header Eyebrow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-muted">
          TRUSTED BY INNOVATIVE ENGINEERING TEAMS & POWERED BY MODERN INFRASTRUCTURE
        </p>
      </div>

      {/* Marquee Wrapper with Left and Right Fade Gradients */}
      <div 
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredPartner(null);
        }}
      >
        {/* Left Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Right Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Animated Track */}
        <motion.div
          className="flex items-center gap-6 sm:gap-8 w-max"
          animate={{ x: isPaused ? undefined : ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 30,
          }}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              onMouseEnter={() => setHoveredPartner(item)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-border/80 bg-surface/40 hover:bg-surface hover:border-black transition-all cursor-pointer group shadow-2xs shrink-0"
            >
              {/* Circular Avatar Initial */}
              <div className="w-7 h-7 rounded-full bg-neutral-800 text-white font-mono font-black text-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                {item.initial}
              </div>

              {/* Partner Name & Subtext */}
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-sm text-foreground font-mono group-hover:text-black transition-colors">
                  {item.name}
                </span>
                <span className="text-[11px] font-mono text-muted hidden sm:inline">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Interactive Telemetry Subtitle on Hover */}
      <div className="max-w-4xl mx-auto px-4 mt-6 min-h-[32px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {hoveredPartner ? (
            <motion.div
              key={hoveredPartner.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border bg-surface text-xs font-mono shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <strong className="text-foreground">{hoveredPartner.name}</strong>
              <span className="text-muted">· {hoveredPartner.detail}</span>
              <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border text-foreground font-bold ml-1">
                {hoveredPartner.spec}
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] font-mono text-muted/70 tracking-tight"
            >
              Hover any technology to inspect architectural capabilities
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
