'use client';

import React from 'react';
import { 
  Binary, 
  Database, 
  Layers, 
  Cpu, 
  Zap, 
  Network, 
  Box 
} from 'lucide-react';

const FOUNDATIONS = [
  { name: 'Tree-sitter', description: 'Concrete AST Parsing', icon: Binary },
  { name: 'Neo4j', description: 'Topological Graph DB', icon: Database },
  { name: 'Qdrant', description: 'Vector Embeddings', icon: Layers },
  { name: 'FastAPI', description: 'Core API Gateway', icon: Zap },
  { name: 'Next.js 14', description: 'React Architecture', icon: Cpu },
  { name: 'React Flow', description: 'Graph Canvas', icon: Network },
  { name: 'Three.js / R3F', description: '3D Spatial Explorer', icon: Box },
];

export default function TrustStrip() {
  return (
    <section className="py-12 bg-surface/50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Eyebrow */}
        <p className="text-center text-xs font-mono uppercase tracking-widest text-muted mb-8">
          Built on the foundations of modern code intelligence
        </p>

        {/* Tech Foundation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {FOUNDATIONS.map((tech) => {
            const Icon = tech.icon;
            return (
              <div 
                key={tech.name} 
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-background shadow-2xs text-center space-y-1 hover:border-neutral-400 transition-colors"
              >
                <div className="p-1.5 rounded-md bg-surface border border-border">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <div className="font-mono text-xs font-bold text-foreground">
                  {tech.name}
                </div>
                <div className="text-[10px] text-muted font-mono leading-none">
                  {tech.description}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
