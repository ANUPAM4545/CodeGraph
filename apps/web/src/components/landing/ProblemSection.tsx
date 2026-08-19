'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  ShieldAlert, 
  Sparkles, 
  ActivitySquare, 
  CheckCircle2, 
  Scan, 
  Layers, 
  Code2, 
  Box, 
  GitBranch, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  subtext: string;
  icon: React.ElementType;
  statusText: string;
  statusType: 'ready' | 'active' | 'synced';
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'graph',
    title: 'Dynamic Knowledge Graph',
    subtext: 'Build lossless AST trees of every class, function, caller, and dependency in real-time.',
    icon: Network,
    statusText: 'Knowledge graph live · 48 nodes',
    statusType: 'synced'
  },
  {
    id: 'impact',
    title: 'Blast Radius Simulator',
    subtext: 'Simulate multi-hop ripple effects before touching code. Discover 100% of affected callers.',
    icon: ActivitySquare,
    statusText: 'Blast radius active · Risk Score: 84',
    statusType: 'active'
  },
  {
    id: 'ai',
    title: 'Lightning Fast Grounded AI',
    subtext: 'Sub-second architectural queries with verified Cypher traversals and zero hallucinations.',
    icon: Scan,
    statusText: 'Ready to query · 99% Grounded',
    statusType: 'ready'
  }
];

export default function ProblemSection() {
  const [activeCardId, setActiveCardId] = useState('ai');
  const activeCard = FEATURE_CARDS.find((c) => c.id === activeCardId) || FEATURE_CARDS[2];

  return (
    <section className="py-20 md:py-28 bg-background border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="max-w-3xl mb-14 space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
            Everything works <br />
            like magic.
          </h2>
          <p className="text-base sm:text-lg text-muted leading-relaxed font-normal">
            We&apos;ve reimagined code intelligence from the ground up, stripping away the complexity to leave you with pure, unadulterated power.
          </p>
        </div>

        {/* 2-Column Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 3 Clickable Feature Cards */}
          <div className="lg:col-span-5 space-y-4">
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon;
              const isActive = activeCardId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCardId(card.id)}
                  className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-200 relative group select-none ${
                    isActive 
                      ? 'bg-black text-white border-black shadow-xl' 
                      : 'bg-surface/50 border-border hover:border-neutral-400 hover:bg-surface text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div className={`p-3 rounded-xl border shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-neutral-900 border-neutral-700 text-white' 
                        : 'bg-background border-border text-foreground group-hover:border-neutral-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Text Area */}
                    <div className="space-y-1.5 flex-1">
                      <div className="font-extrabold text-base sm:text-lg font-mono flex items-center justify-between">
                        <span>{card.title}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm font-sans leading-relaxed ${
                        isActive ? 'text-neutral-300' : 'text-muted'
                      }`}>
                        {card.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive macOS Dark Mode Window */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 text-white shadow-2xl min-h-[480px] flex flex-col justify-between relative overflow-hidden">
              
              {/* Top Window Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-700" />
                  <div className="w-3 h-3 rounded-full bg-neutral-700" />
                  <div className="w-3 h-3 rounded-full bg-neutral-700" />
                </div>

                {/* Center Address Bar */}
                <div className="px-4 py-1 rounded-full bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>codegraph.live/preview</span>
                </div>

                <div className="w-8" />
              </div>

              {/* Center Interactive Visualizer */}
              <div className="my-auto py-10 flex flex-col items-center justify-center relative min-h-[220px]">
                <AnimatePresence mode="wait">
                  
                  {/* VISUALIZER 1: GRAPH TOPOLOGY */}
                  {activeCardId === 'graph' && (
                    <motion.div
                      key="graph-vis"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center text-center space-y-4"
                    >
                      {/* Concentric Node Orbits */}
                      <div className="relative w-36 h-36 rounded-full border border-neutral-800 flex items-center justify-center">
                        <div className="absolute inset-3 rounded-full border border-neutral-700/60 animate-pulse" />
                        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-lg">
                          <Network className="w-8 h-8 text-emerald-400" />
                        </div>
                        {/* Orbiting Satellite Pills */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[10px] text-emerald-400">
                          DisputeOrchestrator
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[10px] text-blue-400">
                          LedgerClient
                        </div>
                      </div>
                      <div className="font-mono text-xs text-neutral-400">
                        Topological Cypher Query: <span className="text-emerald-400">CALLS ➔ IMPORTS ➔ INHERITS</span>
                      </div>
                    </motion.div>
                  )}

                  {/* VISUALIZER 2: BLAST RADIUS */}
                  {activeCardId === 'impact' && (
                    <motion.div
                      key="impact-vis"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center text-center space-y-4"
                    >
                      {/* Radar Target Rings */}
                      <div className="relative w-36 h-36 rounded-full border border-red-500/30 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full border border-red-500/20 animate-ping" />
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center">
                          <ActivitySquare className="w-8 h-8 text-red-400" />
                        </div>
                        <div className="absolute top-1 right-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 font-mono text-[10px] text-red-400 font-bold">
                          RISK: 84
                        </div>
                      </div>
                      <div className="font-mono text-xs text-neutral-400">
                        Upstream Callers: <span className="text-red-400 font-bold">14 direct callers affected</span>
                      </div>
                    </motion.div>
                  )}

                  {/* VISUALIZER 3: GROUNDED AI SCANNER RETICLE */}
                  {activeCardId === 'ai' && (
                    <motion.div
                      key="ai-vis"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center text-center space-y-4"
                    >
                      {/* Center Scanner Reticle */}
                      <div className="relative w-36 h-36 rounded-full bg-neutral-900/80 border border-neutral-800 flex items-center justify-center shadow-inner">
                        {/* Reticle Corner Brackets */}
                        <div className="w-16 h-16 border-2 border-dashed border-neutral-400 rounded-xl flex items-center justify-center relative">
                          <Scan className="w-8 h-8 text-white animate-pulse" />
                        </div>
                      </div>
                      <div className="font-mono text-xs text-neutral-400">
                        Multi-Hop Reasoning: <span className="text-purple-400 font-bold">0% Hallucinations</span>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Status Bar Pill */}
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-neutral-500">Status</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{activeCard.statusText}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
