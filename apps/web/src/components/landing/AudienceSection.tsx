'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Layers, 
  Users, 
  Check,
  ArrowRight
} from 'lucide-react';

const AUDIENCES = [
  {
    title: 'For Developers',
    subtitle: 'Understand unfamiliar code in minutes',
    icon: Code2,
    badge: 'ENGINEERING',
    benefits: [
      'Instant blast-radius calculation before refactoring',
      'Ambient VS Code CodeLens & symbol hovers',
      'AI assistant that cites real file paths & line ranges',
      'Skip hours of manual code navigation',
    ],
  },
  {
    title: 'For Architects',
    subtitle: 'Enforce clean boundaries & track drift',
    icon: Layers,
    badge: 'SYSTEM DESIGN',
    benefits: [
      'Automated subsystem & module boundary discovery',
      'Identify cyclic loops and high coupling hotspots',
      'Compare architectural versions across Git history',
      'Export production architecture blueprints',
    ],
  },
  {
    title: 'For Engineering Leaders',
    subtitle: 'Reduce risk & accelerate team onboarding',
    icon: Users,
    badge: 'LEADERSHIP',
    benefits: [
      'Comprehensive repository intelligence for new hires',
      'Deterministic codebase health & complexity scoring',
      'Multi-tenant governance and audit compliance',
      'Eliminate knowledge silos across repositories',
    ],
  },
];

export default function AudienceSection() {
  return (
    <section className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
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
            <span>DESIGNED FOR MODERN ORGANIZATIONS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Built for the entire team.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Whether you are committing code, designing system boundaries, or leading engineering strategy.
          </p>
        </div>

        {/* 3 Audience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {AUDIENCES.map((aud, idx) => {
            const Icon = aud.icon;

            return (
              <motion.div
                key={aud.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-7 rounded-3xl border border-border bg-background shadow-2xs hover:border-black hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-foreground group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-2xs">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-muted bg-surface px-2.5 py-1 rounded-full border border-border">
                      {aud.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-xl text-foreground tracking-tight font-mono">
                      {aud.title}
                    </h3>
                    <p className="text-xs text-muted font-sans mt-1">
                      {aud.subtitle}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-border/80 text-xs font-sans text-muted">
                    {aud.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="text-foreground leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
