'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
    <section id="enterprise" className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ENTERPRISE PLATFORM</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Serious engineering environments.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Engineered for high security, multi-tenancy, deterministic versioning, and rigorous compliance standards.
          </p>
        </div>

        {/* 3x2 Enterprise Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-6 rounded-3xl border border-border bg-background shadow-2xs hover:border-black hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-default"
              >
                <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-foreground group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-2xs">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-foreground font-mono">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>Industrial Standard</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
