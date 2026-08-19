'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Layers, 
  ShieldAlert, 
  BrainCircuit, 
  Cuboid, 
  Terminal,
  ArrowUpRight
} from 'lucide-react';

const CAPABILITIES = [
  {
    number: '01',
    title: 'Knowledge Graph',
    description: 'Map files, classes, functions, modules, and dependencies into one connected architecture.',
    icon: Network,
    badge: 'AST TOPOLOGY',
  },
  {
    number: '02',
    title: 'Repository Intelligence',
    description: 'Automatically understand what a repository does, how it is structured, and what it solves.',
    icon: Layers,
    badge: 'AUTO-SYNTHESIS',
  },
  {
    number: '03',
    title: 'Impact Analysis',
    description: 'Understand what changes before you make them.',
    icon: ShieldAlert,
    badge: 'BLAST RADIUS',
  },
  {
    number: '04',
    title: 'AI Codebase Assistant',
    description: 'Ask questions about your real code and receive source-backed answers.',
    icon: BrainCircuit,
    badge: 'SOURCE-GROUNDED',
  },
  {
    number: '05',
    title: '3D Codebase Universe',
    description: 'Explore large repositories as an interactive architectural environment.',
    icon: Cuboid,
    badge: 'WEBGL SPATIAL',
  },
  {
    number: '06',
    title: 'IDE Integration',
    description: 'Bring repository intelligence directly into the developer workflow.',
    icon: Terminal,
    badge: 'VS CODE CODELENS',
  },
];

export default function CoreCapabilities() {
  return (
    <section id="capabilities" className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
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
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono font-bold text-neutral-800 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            From Code to Complete Clarity.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-normal">
            Everything your team needs to understand, navigate, and safely evolve complex codebases.
          </p>
        </div>

        {/* 6 Premium Capability Cards (3x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;

            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-7 rounded-3xl border border-border bg-white shadow-xs hover:border-black hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-default"
              >
                <div className="space-y-4">
                  {/* Top Bar with Number & Icon Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-foreground group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-2xs">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>

                    <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
                      {cap.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-foreground font-mono tracking-tight">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Metadata Strip */}
                <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted">
                  <span className="text-foreground font-bold">Pillar {cap.number}</span>
                  <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-neutral-400 group-hover:text-black">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
