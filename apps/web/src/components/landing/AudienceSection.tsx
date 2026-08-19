'use client';

import React from 'react';
import { 
  Code2, 
  Layers, 
  Users, 
  Check 
} from 'lucide-react';

const AUDIENCES = [
  {
    title: 'For Developers',
    subtitle: 'Understand unfamiliar code in minutes',
    icon: Code2,
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
    <section className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>DESIGNED FOR MODERN TEAMS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Built for developers, architects, and engineering leaders.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            Whether you are writing a feature, evaluating a system refactor, or leading an engineering organization, CodeGraph provides the clarity you need.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUDIENCES.map((aud) => {
            const Icon = aud.icon;
            return (
              <div 
                key={aud.title}
                className="p-6 sm:p-8 rounded-xl border border-border bg-surface/40 flex flex-col justify-between space-y-6 hover:border-black transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-mono">{aud.title}</h3>
                  <p className="text-xs text-muted font-sans font-medium">{aud.subtitle}</p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-border/60 text-xs font-sans text-foreground/80">
                  {aud.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
