'use client';

import React from 'react';
import { 
  FolderGit2, 
  FileCode, 
  Code2, 
  GitFork, 
  Network, 
  BrainCircuit, 
  ArrowRight,
  ShieldAlert,
  Clock,
  Search
} from 'lucide-react';

const PIPELINE_STEPS = [
  { step: '01', title: 'Repository', desc: 'Raw source files, commits & manifests', icon: FolderGit2 },
  { step: '02', title: 'Files & AST', desc: 'Syntax trees for Python & TypeScript', icon: FileCode },
  { step: '03', title: 'Symbols', desc: 'Classes, functions, methods & calls', icon: Code2 },
  { step: '04', title: 'Relationships', desc: 'CALLS, IMPORTS, INHERITS & DEFINES', icon: GitFork },
  { step: '05', title: 'Architecture', desc: 'Subsystems, blast radius & coupling', icon: Network },
  { step: '06', title: 'Intelligence', desc: 'Grounded AI, risk signals & IDE sync', icon: BrainCircuit },
];

export default function ProblemSection() {
  return (
    <section className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>THE ARCHITECTURAL BOTTLENECK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Your codebase already contains the answers.
          </h2>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Modern applications contain enormous architectural intelligence, but it is fragmented across files, functions, Git history, and microservice boundaries. Developers spend countless hours reconstructing mental maps from scratch.
          </p>
        </div>

        {/* Comparison Grid: Fragmented vs CodeGraph */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* Fragmented Architecture Box */}
          <div className="p-6 md:p-8 rounded-xl border border-red-500/20 bg-red-500/5 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Without CodeGraph · Fragmented Reality</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-foreground/80 font-mono">
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Unclear blast radius: Modifying a function breaks unseen callers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Silent architectural drift: Circular dependencies grow unnoticed.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Slow engineering onboarding: Weeks spent reading raw files.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>AI hallucinations: Traditional LLMs lack topological repository context.</span>
              </li>
            </ul>
          </div>

          {/* Unified Intelligence Layer Box */}
          <div className="p-6 md:p-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              <span>With CodeGraph · Living Intelligence</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-foreground/80 font-mono">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Automated blast-radius calculation across all callers & dependencies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Continuous graph synchronization with every Git commit push.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Instant repository intelligence: APIs, database models & architecture.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>100% grounded AI answers backed by verified Cypher & AST citations.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Deterministic Flow Visualizer */}
        <div className="border border-border rounded-xl bg-surface p-6 sm:p-8">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-6">
            The CodeGraph Structural Extraction Pipeline
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
            {PIPELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="p-4 rounded-lg border border-border bg-background flex flex-col justify-between space-y-2 relative group hover:border-black transition-colors">
                  <div className="flex items-center justify-between text-muted">
                    <span className="text-[10px] font-mono font-bold text-muted/60">{step.step}</span>
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-foreground">{step.title}</div>
                    <div className="text-[10px] text-muted font-sans mt-0.5 leading-snug">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
