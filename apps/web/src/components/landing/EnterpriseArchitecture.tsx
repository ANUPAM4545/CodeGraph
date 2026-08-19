'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  History, 
  GitBranch, 
  Cpu, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';

const PILLARS = [
  {
    icon: Building2,
    title: 'Multi-Tenant Isolation',
    desc: 'Strict organization boundary enforcement. Data, graphs, and vector collections are partitioned per tenant.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access Control',
    desc: 'Fine-grained permissions for Owners, Admins, and Members governing repositories, API keys, and settings.',
  },
  {
    icon: KeyRound,
    title: 'Hashed Developer API Keys',
    desc: 'Secure cg_live_... API credentials hashed with SHA-256 before storage in PostgreSQL for IDE & CLI automation.',
  },
  {
    icon: History,
    title: 'Audit Logging & Compliance',
    desc: 'Complete chronological audit log recording every repository ingestion, permission change, and key rotation.',
  },
  {
    icon: GitBranch,
    title: 'Repository Version Isolation',
    desc: 'Every commit SHA generates an immutable version node in Neo4j, enabling point-in-time architectural time-travel.',
  },
  {
    icon: Radio,
    title: 'Real-Time WebSocket Sync',
    desc: 'Low-latency bidirectional WebSocket channels pushing ingestion pulses and AST updates directly to clients.',
  },
];

export default function EnterpriseArchitecture() {
  return (
    <section id="enterprise" className="py-20 md:py-28 bg-surface/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>ENTERPRISE PLATFORM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Built for serious engineering environments.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            Engineered with strict tenant isolation, immutable version tracking, cryptographic API access, and robust asynchronous job workers.
          </p>
        </div>

        {/* Enterprise Hierarchy Flow */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-background mb-12 shadow-2xs">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-6">
            Data Isolation & Hierarchy Model
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="px-4 py-2.5 rounded-lg border border-border bg-surface font-bold text-foreground">
              Organization Tenancy
            </div>
            <span className="text-muted">→</span>
            <div className="px-4 py-2.5 rounded-lg border border-border bg-surface font-bold text-foreground">
              Repository Workspace
            </div>
            <span className="text-muted">→</span>
            <div className="px-4 py-2.5 rounded-lg border border-border bg-surface font-bold text-foreground">
              Repository Version (SHA)
            </div>
            <span className="text-muted">→</span>
            <div className="px-4 py-2.5 rounded-lg border border-border bg-surface font-bold text-foreground">
              Neo4j Graph & Qdrant Vectors
            </div>
            <span className="text-muted">→</span>
            <div className="px-4 py-2.5 rounded-lg border-2 border-black bg-surface font-black text-foreground">
              Grounded AI & IDE Context
            </div>
          </div>
        </div>

        {/* 6 Enterprise Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.title}
                className="p-6 rounded-xl border border-border bg-background flex flex-col justify-between space-y-4 hover:border-black transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-foreground">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-mono text-sm font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-xs text-muted font-sans leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
