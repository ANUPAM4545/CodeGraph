'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Terminal, Sparkles, Network } from 'lucide-react';
import { Button } from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-border bg-background">
      {/* Subtle Technical Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono font-medium tracking-wide text-foreground shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CODE INTELLIGENCE FOR MODERN ENGINEERING TEAMS</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            Understand any <br className="hidden sm:inline" />
            codebase instantly.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-muted max-w-2xl font-normal leading-relaxed">
            CodeGraph turns your repository into a living architectural intelligence system — mapping code, dependencies, impact, history, and AI-powered insights in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-xs font-bold gap-2 px-6 h-11 bg-black text-white hover:bg-neutral-800 shadow-xs">
                <Github className="w-4 h-4" />
                <span>Connect GitHub</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>
            <a href="#product" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs font-semibold px-5 h-11 border-border hover:bg-surface text-foreground">
                <span>Explore the Platform</span>
              </Button>
            </a>
          </div>

          {/* Supporting Microcopy */}
          <p className="text-[11px] font-mono text-muted/80 tracking-tight">
            Built for developers, architects, and engineering teams.
          </p>

        </div>
      </div>
    </section>
  );
}
