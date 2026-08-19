'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  Sliders, 
  Network, 
  Layers, 
  ShieldCheck, 
  BarChart3, 
  Check,
  CheckCircle2,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';

interface Step {
  id: string;
  number: string;
  name: string;
  icon: React.ElementType;
  metric: string;
  subtext: string;
  badge: string;
  bars: number[];
}

const STEPS: Step[] = [
  {
    id: 'connect',
    number: '01',
    name: 'Connect Repo',
    icon: FolderGit2,
    metric: '14 Repositories Synced',
    subtext: '+3 repositories onboarded today',
    badge: 'OAUTH LIVE',
    bars: [35, 50, 45, 60, 55, 75, 90]
  },
  {
    id: 'parse',
    number: '02',
    name: 'Parse AST',
    icon: Sliders,
    metric: '48 Lossless AST Trees',
    subtext: 'Python & TypeScript grammars verified',
    badge: 'TREE-SITTER',
    bars: [40, 60, 50, 70, 65, 80, 95]
  },
  {
    id: 'graph',
    number: '03',
    name: 'Build Graph',
    icon: Network,
    metric: '1,452 Topological Edges',
    subtext: 'CALLS, IMPORTS, INHERITS indexed',
    badge: 'NEO4J ACID',
    bars: [30, 45, 65, 55, 75, 85, 100]
  },
  {
    id: 'vectors',
    number: '04',
    name: 'Index Vectors',
    icon: Layers,
    metric: '0.98 Cosine Accuracy',
    subtext: 'Graph-RAG dense payloads generated',
    badge: 'QDRANT HNSW',
    bars: [50, 65, 60, 80, 70, 90, 98]
  },
  {
    id: 'impact',
    number: '05',
    name: 'Simulate Impact',
    icon: ShieldCheck,
    metric: '0 Circular Loops',
    subtext: 'DAG verified across 4 subsystems',
    badge: 'RISK SCORE: 84',
    bars: [25, 40, 55, 50, 70, 80, 92]
  },
  {
    id: 'analytics',
    number: '06',
    name: 'Track Analytics',
    icon: BarChart3,
    metric: '1,452 AST Nodes',
    subtext: '+12% from last commit',
    badge: 'LIVE DASHBOARD',
    bars: [30, 55, 40, 70, 50, 80, 95]
  },
];

export default function DeveloperWorkflow() {
  const [activeStepId, setActiveStepId] = useState('analytics');
  const currentStep = STEPS.find((s) => s.id === activeStepId) || STEPS[5];

  return (
    <section className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            A flawless workflow.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            CodeGraph maps precisely to how elite engineering teams operate, fully automating architectural understanding so you can focus on building.
          </p>
        </div>

        {/* 6-Step Horizontal Interconnected Linear Stepper */}
        <div className="relative mb-16 overflow-x-auto pb-6 pt-2 scrollbar-none">
          
          {/* Horizontal Connecting Center Line */}
          <div className="hidden lg:block absolute top-[36px] left-[8%] right-[8%] h-[2px] bg-black/80 z-0" />

          <div className="flex items-center justify-between min-w-[760px] max-w-5xl mx-auto relative z-10 px-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStepId === step.id;

              return (
                <div 
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className="flex flex-col items-center text-center cursor-pointer group space-y-3"
                >
                  {/* Step Card Box */}
                  <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 bg-background ${
                    isActive 
                      ? 'border-black bg-surface shadow-lg scale-110' 
                      : 'border-black/80 hover:border-black hover:scale-105'
                  }`}>
                    {/* Top Right Checkmark Badge */}
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>

                    <Icon className={`w-7 h-7 transition-colors ${
                      isActive ? 'text-black' : 'text-neutral-800 group-hover:text-black'
                    }`} />
                  </div>

                  {/* Step Label */}
                  <span className={`font-mono text-xs sm:text-sm font-extrabold transition-colors ${
                    isActive ? 'text-foreground font-black' : 'text-muted group-hover:text-foreground'
                  }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Large Lower Container with Dynamic Live Metric Dashboard */}
        <div className="rounded-3xl border border-border bg-surface/40 p-6 sm:p-12 shadow-sm max-w-4xl mx-auto">
          
          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 max-w-lg mx-auto shadow-md space-y-6">
            
            {/* Metric Top Bar */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-foreground font-mono tracking-tight">
                  {currentStep.metric}
                </div>
                <div className="text-xs text-muted font-mono mt-1">
                  {currentStep.subtext}
                </div>
              </div>

              {/* Status Pill */}
              <div className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentStep.badge}</span>
              </div>
            </div>

            {/* Dynamic Metric Bar Chart Columns */}
            <div className="flex items-end justify-between gap-2.5 h-36 pt-4 border-t border-border/60">
              {currentStep.bars.map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <motion.div
                    key={`${currentStep.id}-${idx}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="w-full rounded-md bg-gradient-to-t from-neutral-950 via-neutral-800 to-neutral-700 hover:from-black hover:to-neutral-500 transition-colors shadow-2xs"
                  />
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
