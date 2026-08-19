'use client';

import React from 'react';
import { 
  Github, 
  Binary, 
  Database, 
  Layers, 
  Network, 
  BrainCircuit, 
  ActivitySquare, 
  Terminal 
} from 'lucide-react';

const WORKFLOW = [
  { step: '1', title: 'Connect GitHub', desc: 'Authorize repositories via OAuth with PKCE verification.', icon: Github },
  { step: '2', title: 'Analyze Repository', desc: 'Tree-sitter extracts concrete ASTs for Python & TypeScript.', icon: Binary },
  { step: '3', title: 'Build Knowledge Graph', desc: 'Canonical nodes and CALLS/IMPORTS edges loaded into Neo4j.', icon: Database },
  { step: '4', title: 'Generate Semantic Index', desc: 'Vector chunks & dense embeddings generated into Qdrant.', icon: Layers },
  { step: '5', title: 'Explore Architecture', desc: 'Navigate graph nodes, subsystems, and 3D codebase universe.', icon: Network },
  { step: '6', title: 'Ask Grounded AI', desc: 'Query architecture with strict multi-hop graph evidence.', icon: BrainCircuit },
  { step: '7', title: 'Analyze Blast Radius', desc: 'Simulate callers and calculate 0–100 risk before changing code.', icon: ActivitySquare },
  { step: '8', title: 'Sync with IDE', desc: 'Receive live CodeLens annotations and hovers in VS Code.', icon: Terminal },
];

export default function DeveloperWorkflow() {
  return (
    <section className="py-20 md:py-28 bg-surface/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>DEVELOPER WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            From raw source to ambient intelligence.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            A seamless automated pipeline converting raw Git repositories into living architectural knowledge graphs.
          </p>
        </div>

        {/* 8-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKFLOW.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="p-5 rounded-xl border border-border bg-background flex flex-col justify-between space-y-4 shadow-2xs group hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center font-mono text-xs font-bold text-foreground group-hover:bg-black group-hover:text-white transition-colors">
                    {item.step}
                  </span>
                  <Icon className="w-4 h-4 text-muted group-hover:text-black transition-colors" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono text-xs font-bold text-foreground">{item.title}</h3>
                  <p className="text-[11px] text-muted font-sans leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
