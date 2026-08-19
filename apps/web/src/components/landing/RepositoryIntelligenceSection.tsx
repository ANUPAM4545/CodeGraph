'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  FolderGit2, 
  Layers, 
  Globe, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  FileCode,
  Server,
  Activity,
  Cpu
} from 'lucide-react';

const INTEL_TABS = [
  { id: 'purpose', name: 'Purpose & Problem', icon: Sparkles },
  { id: 'stack', name: 'Technology Stack', icon: Cpu },
  { id: 'apis', name: 'Discovered APIs', icon: Globe },
  { id: 'models', name: 'Database Schemas', icon: Database },
  { id: 'health', name: 'Architectural Health', icon: ShieldCheck },
];

export default function RepositoryIntelligenceSection() {
  const [activeTabId, setActiveTabId] = useState('purpose');
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through tabs (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTabId((current) => {
        const idx = INTEL_TABS.findIndex((t) => t.id === current);
        return INTEL_TABS[(idx + 1) % INTEL_TABS.length].id;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="intelligence" className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
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
            <span>REPOSITORY INTELLIGENCE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Know What the Repository Actually Does.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-normal">
            CodeGraph automatically analyzes source code manifests, routes, schemas, and commits to derive purpose, architecture, and health metrics.
          </p>
        </div>

        {/* Large Repository Intelligence Container */}
        <div 
          className="rounded-3xl border border-border bg-white shadow-2xl overflow-hidden max-w-5xl mx-auto font-mono text-xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Repository Bar */}
          <div className="p-6 bg-neutral-50/80 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-foreground tracking-tight">
                  QR Code Management Platform
                </div>
                <div className="text-[11px] text-muted font-sans mt-0.5">
                  Primary Stack: Next.js · TypeScript · PostgreSQL · Redis · Docker
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold text-xs">
                HEALTH SCORE: 96/100
              </span>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="px-6 pt-4 bg-white border-b border-border flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
            {INTEL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:text-foreground hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Viewport */}
          <div className="p-6 sm:p-8 min-h-[280px] bg-white">
            <AnimatePresence mode="wait">
              {activeTabId === 'purpose' && (
                <motion.div
                  key="purpose"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="p-5 rounded-2xl border border-border bg-neutral-50/50 space-y-2">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      Derived Repository Purpose
                    </div>
                    <p className="text-sm font-sans text-foreground leading-relaxed">
                      Enterprise repository for managing dynamic QR code generation, destination routing, batch lifetime management, and real-time scanning analytics.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-border bg-neutral-50/50 space-y-2">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      Primary Problem Solved
                    </div>
                    <p className="text-sm font-sans text-foreground leading-relaxed">
                      Eliminates hardcoded destination redirects by providing dynamic cryptographic resolution endpoints with sub-10ms edge caching.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTabId === 'stack' && (
                <motion.div
                  key="stack"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {[
                    { name: 'Next.js 14', role: 'Fullstack Web Engine', version: '^14.2.3' },
                    { name: 'TypeScript', role: 'Type Safety & AST', version: '^5.4.0' },
                    { name: 'PostgreSQL', role: 'ACID Primary Database', version: 'v16.0' },
                    { name: 'Redis', role: 'Sub-millisecond Cache', version: 'v7.2' },
                    { name: 'Neo4j 5', role: 'Topological Graph DB', version: 'v5.18' },
                    { name: 'Docker', role: 'Container Orchestration', version: 'Multi-stage' },
                  ].map((tech) => (
                    <div key={tech.name} className="p-4 rounded-2xl border border-border bg-neutral-50/50 space-y-1">
                      <div className="font-extrabold text-foreground text-sm">{tech.name}</div>
                      <div className="text-[11px] text-muted font-sans">{tech.role}</div>
                      <div className="text-[10px] text-neutral-500 font-mono pt-1">{tech.version}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTabId === 'apis' && (
                <motion.div
                  key="apis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5"
                >
                  {[
                    { method: 'POST', path: '/api/v1/qr/generate', handler: 'QRCodeService.generate()', status: '201 CREATED' },
                    { method: 'GET', path: '/api/v1/qr/:id/analytics', handler: 'AnalyticsController.getMetrics()', status: '200 OK' },
                    { method: 'POST', path: '/api/v1/auth/pkce', handler: 'AuthService.exchangePKCEToken()', status: '200 OK' },
                    { method: 'POST', path: '/api/v1/webhooks/stripe', handler: 'StripeWebhookHandler.verify()', status: 'AUTH' },
                  ].map((api) => (
                    <div key={api.path} className="p-3 rounded-xl border border-border bg-neutral-50/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          api.method === 'POST' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {api.method}
                        </span>
                        <span className="font-extrabold text-foreground text-xs">{api.path}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted text-[11px]">
                        <span className="hidden sm:inline font-mono">{api.handler}</span>
                        <span className="text-foreground font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-border">
                          {api.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTabId === 'models' && (
                <motion.div
                  key="models"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {[
                    { name: 'QRRecord', fields: 'id, slug, destination_url, creator_id, created_at', db: 'PostgreSQL' },
                    { name: 'AnalyticsEvent', fields: 'id, qr_id, timestamp, ip_hash, user_agent', db: 'PostgreSQL' },
                    { name: 'WorkspaceUser', fields: 'id, email, hashed_api_key, role, tenant_id', db: 'PostgreSQL' },
                    { name: 'AuditLog', fields: 'id, actor_id, action, timestamp, metadata_json', db: 'PostgreSQL' },
                  ].map((model) => (
                    <div key={model.name} className="p-4 rounded-2xl border border-border bg-neutral-50/50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-foreground text-sm font-extrabold">{model.name}</strong>
                        <span className="text-[10px] text-muted bg-white px-2 py-0.5 rounded border border-border">{model.db}</span>
                      </div>
                      <div className="text-[10px] text-muted font-mono leading-relaxed">{model.fields}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTabId === 'health' && (
                <motion.div
                  key="health"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-1">
                    <div className="text-[10px] text-emerald-800 uppercase font-bold">Overall Health</div>
                    <div className="text-3xl font-black text-emerald-700">96 / 100</div>
                    <div className="text-[11px] text-emerald-800 font-sans">Clean modular boundaries</div>
                  </div>
                  <div className="p-5 rounded-2xl border border-border bg-neutral-50/50 space-y-1">
                    <div className="text-[10px] text-muted uppercase font-bold">Circular Loops</div>
                    <div className="text-3xl font-black text-foreground">0 Loops</div>
                    <div className="text-[11px] text-muted font-sans">Strict DAG dependency tree</div>
                  </div>
                  <div className="p-5 rounded-2xl border border-border bg-neutral-50/50 space-y-1">
                    <div className="text-[10px] text-muted uppercase font-bold">Coupling Ratio</div>
                    <div className="text-3xl font-black text-foreground">0.14</div>
                    <div className="text-[11px] text-muted font-sans">Low fan-out blast radius</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
