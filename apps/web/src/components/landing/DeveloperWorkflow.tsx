'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  Binary, 
  Network, 
  Layers, 
  BrainCircuit, 
  ShieldAlert, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  stepNum: string;
  name: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  technical: string;
  metric: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'connect',
    stepNum: '01',
    name: 'Connect Repository',
    icon: FolderGit2,
    title: 'OAuth & Webhook Authorization',
    desc: 'Authorize public or private GitHub repositories with cryptographic PKCE verification.',
    technical: 'SHA-256 HMAC webhook secret verified upon payload delivery.',
    metric: 'Instant Webhook Handshake'
  },
  {
    id: 'analyze',
    stepNum: '02',
    name: 'Analyze Code',
    icon: Binary,
    title: 'Lossless Concrete AST Extraction',
    desc: 'Tree-sitter parsers process Python & TypeScript AST grammars to isolate definitions, calls, and imports.',
    technical: 'Extracts classes, methods, parameters, and return types with exact line offsets.',
    metric: '< 1.4s per 10k lines'
  },
  {
    id: 'graph',
    stepNum: '03',
    name: 'Build Knowledge Graph',
    icon: Network,
    title: 'Neo4j Property Graph Insertion',
    desc: 'Load canonical syntax nodes and typed relationships into Neo4j with ACID transactional guarantees.',
    technical: 'Indexed on (name, repo_id, version_id) for sub-millisecond Cypher graph traversals.',
    metric: '3,890 Topological Edges'
  },
  {
    id: 'architecture',
    stepNum: '04',
    name: 'Understand Architecture',
    icon: Layers,
    title: 'Subsystem Boundary Auto-Clustering',
    desc: 'Algorithms detect module boundaries, cyclic loops, and architectural hotspots automatically.',
    technical: 'Computes instability indices and fan-in coupling across all project subsystems.',
    metric: '0 Circular Loops Detected'
  },
  {
    id: 'ask',
    stepNum: '05',
    name: 'Ask AI',
    icon: BrainCircuit,
    title: 'Graph-RAG Source-Grounded Reasoning',
    desc: 'Hybrid retrieval combines multi-hop graph context with Qdrant semantic vector chunks.',
    technical: 'Prompts inject verified AST subgraphs to prevent AI hallucinations.',
    metric: '100% Verified Citations'
  },
  {
    id: 'impact',
    stepNum: '06',
    name: 'Analyze Impact',
    icon: ShieldAlert,
    title: 'Topological Blast Radius Simulation',
    desc: 'Trace multi-depth upstream callers and downstream dependencies before touching a line of code.',
    technical: 'Computes deterministic 0–100 regression risk scores for PR validation.',
    metric: 'Multi-Depth Traversal'
  },
  {
    id: 'ship',
    stepNum: '07',
    name: 'Ship Changes Safely',
    icon: CheckCircle2,
    title: 'Ambient IDE Sync & Continuous Deploy',
    desc: 'Push updates straight into VS Code annotations and sync graphs automatically on every git commit.',
    technical: 'Real-time WebSocket protocol pushes diff telemetry to developer editors.',
    metric: 'Zero Stale Documentation'
  },
];

export default function DeveloperWorkflow() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance through workflow steps (pauses on user interaction)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeStep = WORKFLOW_STEPS[activeStepIdx];

  return (
    <section id="workflow" className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono font-bold text-neutral-800 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>DEVELOPER WORKFLOW</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            From Repository to Understanding.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-normal">
            A seamless automated pipeline that continuously synchronizes architecture from your first commit to production.
          </p>
        </div>

        {/* 7-Step Horizontal Stepper Bar */}
        <div 
          className="relative mb-12 overflow-x-auto pb-4 pt-2 scrollbar-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Continuous Horizontal Line */}
          <div className="hidden xl:block absolute top-[36px] left-[6%] right-[6%] h-[2px] bg-neutral-200 z-0" />

          <div className="flex items-center justify-between min-w-[860px] max-w-6xl mx-auto relative z-10 px-4">
            {WORKFLOW_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStepIdx === idx;

              return (
                <div 
                  key={step.id}
                  onClick={() => setActiveStepIdx(idx)}
                  className="flex flex-col items-center text-center cursor-pointer group space-y-2.5"
                >
                  {/* Step Card Box */}
                  <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 bg-white ${
                    isActive 
                      ? 'border-black bg-white shadow-xl scale-110 ring-4 ring-black/5' 
                      : 'border-neutral-200 hover:border-black hover:scale-105'
                  }`}>
                    {/* Top Right Step Number Badge */}
                    <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow-xs ${
                      isActive ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                    }`}>
                      {step.stepNum}
                    </div>

                    <Icon className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-black' : 'text-neutral-500 group-hover:text-black'
                    }`} />
                  </div>

                  {/* Step Label */}
                  <span className={`font-mono text-xs transition-colors whitespace-nowrap ${
                    isActive ? 'text-foreground font-black' : 'text-muted group-hover:text-foreground font-medium'
                  }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Technical Details Inspector Card */}
        <div 
          className="rounded-3xl border border-border bg-surface/50 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto font-mono text-xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-md space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold">Step {activeStep.stepNum} in Pipeline</span>
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
                  {activeStep.title}
                </h3>
              </div>

              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold text-xs w-fit">
                {activeStep.metric}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold text-neutral-500 uppercase">Architecture Operation</div>
                <p className="text-sm text-foreground leading-relaxed">
                  {activeStep.desc}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold text-neutral-500 uppercase">Implementation Detail</div>
                <p className="text-sm text-muted leading-relaxed font-mono text-[11px]">
                  {activeStep.technical}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
