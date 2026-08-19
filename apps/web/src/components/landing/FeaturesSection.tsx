'use client';

import React from 'react';
import { 
  Network, 
  BrainCircuit, 
  ActivitySquare, 
  Layers, 
  Cuboid, 
  RefreshCw,
  ArrowUpRight 
} from 'lucide-react';

const FEATURES = [
  {
    icon: Network,
    tag: 'GRAPH TOPOLOGY',
    title: 'Knowledge Graph Engine',
    description: 'Builds an exact AST-level graph of files, classes, functions, and external packages with typed edges: CONTAINS, DEFINES, IMPORTS, CALLS, and INHERITS.',
    bulletPoints: ['Tree-sitter parser extraction', 'Neo4j property graph storage', 'Zero AST ambiguity'],
  },
  {
    icon: BrainCircuit,
    tag: 'HYBRID RETRIEVAL',
    title: 'Grounded AI Assistant',
    description: 'Combines multi-hop Cypher graph traversals with Qdrant vector search. Every answer cites verified file paths and line numbers without hallucinations.',
    bulletPoints: ['Graph-RAG topological context', 'Exact source line citations', 'Confidence evidence scoring'],
  },
  {
    icon: ActivitySquare,
    tag: 'BLAST RADIUS',
    title: 'Change Impact Simulation',
    description: 'Simulates multi-depth upstream callers, downstream dependencies, and affected subsystems before modifying code or merging pull requests.',
    bulletPoints: ['Multi-hop caller propagation', '0–100 risk scoring index', 'Regression prevention'],
  },
  {
    icon: Layers,
    tag: 'MODULAR ARCHITECTURE',
    title: 'Architecture Intelligence',
    description: 'Automatically discovers subsystems, module boundaries, architectural coupling hotspots, and circular dependency loops across your repository.',
    bulletPoints: ['Subsystem auto-clustering', 'Cyclic dependency detection', 'Coupling ratio analytics'],
  },
  {
    icon: Cuboid,
    tag: 'SPATIAL VISUALIZATION',
    title: '3D Codebase Universe',
    description: 'Explore entire multi-repo ecosystems spatially in WebGL. Planetary bodies cluster around core modules with density-based gravitational positioning.',
    bulletPoints: ['React Three Fiber engine', 'Architecture & dependency views', 'Planetary zoom navigation'],
  },
  {
    icon: RefreshCw,
    tag: 'AUTOMATED SYNC',
    title: 'Continuous Intelligence',
    description: 'Listens to GitHub webhook pushes, detects incremental AST changes, and syncs Neo4j graphs, vector stores, and IDE clients in real-time.',
    bulletPoints: ['Incremental diff parsing', 'Versioned repository history', 'Low-latency WebSocket sync'],
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-surface/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>COMPREHENSIVE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Everything your codebase knows.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            Six architectural intelligence pillars engineered for modern engineering organizations.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="p-6 sm:p-8 rounded-xl border border-border bg-background hover:border-black transition-all flex flex-col justify-between space-y-6 shadow-2xs group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-foreground group-hover:bg-black group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-muted font-bold tracking-wider">{feature.tag}</span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 space-y-2">
                  {feature.bulletPoints.map((bp) => (
                    <div key={bp} className="flex items-center gap-2 text-[11px] font-mono text-foreground/80">
                      <span className="w-1 h-1 rounded-full bg-black" />
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
