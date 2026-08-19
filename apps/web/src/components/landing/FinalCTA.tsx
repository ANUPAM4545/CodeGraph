'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Terminal, Network } from 'lucide-react';
import { Button } from '../ui/Button';

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-surface/50 border-b border-border relative overflow-hidden">
      
      {/* Subtle Technical Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
            <Network className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Stop guessing how <br className="hidden sm:inline" />
            your code works.
          </h2>

          <p className="text-base sm:text-lg text-muted max-w-xl mx-auto font-normal">
            Turn your repository into a living architectural intelligence system with automated blast radius, grounded AI, and continuous synchronization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-xs font-bold gap-2 px-7 h-11 bg-black text-white hover:bg-neutral-800 shadow-xs">
                <Github className="w-4 h-4" />
                <span>Connect GitHub</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs font-semibold px-5 h-11 border-border hover:bg-surface text-foreground">
                <span>Explore Documentation</span>
              </Button>
            </Link>
          </div>

          <p className="text-[11px] font-mono text-muted/80 tracking-tight pt-2">
            Free for public open-source repositories · Enterprise ready
          </p>

        </div>
      </div>
    </section>
  );
}
