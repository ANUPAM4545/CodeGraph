'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Database, 
  Briefcase, 
  ShieldCheck, 
  CloudUpload, 
  Activity,
  Code2,
  Lock,
  RefreshCw,
  Cpu
} from 'lucide-react';

const ENTERPRISE_FEATURES = [
  {
    icon: Network,
    title: 'Dynamic AST Engine',
    description: 'Parse and extract lossless AST syntax trees across multi-language repositories in real-time.',
    category: 'AST ANALYSIS'
  },
  {
    icon: Database,
    title: 'Knowledge Graph DB',
    description: 'Store canonical nodes and typed edges (CALLS, IMPORTS, INHERITS) in Neo4j with ACID compliance.',
    category: 'GRAPH DATABASE'
  },
  {
    icon: Briefcase,
    title: 'Workspace Isolation',
    description: 'Organize repositories, versions, and teams into secure, cryptographically isolated workspaces.',
    category: 'MULTI-TENANCY'
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description: 'Assign granular Admin, Architect, Developer, and Viewer roles with hashed API key permissions.',
    category: 'SECURITY'
  },
  {
    icon: CloudUpload,
    title: 'Continuous Webhook Sync',
    description: 'Automatically ingest GitHub webhook pushes and compute incremental AST diffs in milliseconds.',
    category: 'AUTOMATION'
  },
  {
    icon: Activity,
    title: 'Real-time Analytics',
    description: 'Live Graph-RAG context indexing, 0–100 blast radius scoring, and ambient IDE copilot sync.',
    category: 'OBSERVABILITY'
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
      {/* Subtle Background Technical Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Centered Headline */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Enterprise grade by default.
          </h2>
        </div>

        {/* 3-Column / 2-Row Clean Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {ENTERPRISE_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex flex-col items-start space-y-4 group cursor-default"
              >
                {/* Rounded Icon Pill */}
                <div className="w-12 h-12 rounded-2xl border border-border bg-surface flex items-center justify-center text-foreground group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-2xs">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-lg text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted font-normal leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
