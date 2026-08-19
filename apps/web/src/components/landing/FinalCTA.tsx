'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Terminal, Network } from 'lucide-react';
import { Button } from '../ui/Button';

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-36 bg-background border-b border-border relative overflow-hidden">
      
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-xl">
            <Network className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
            Stop guessing how <br className="hidden sm:inline" />
            your code works.
          </h2>

          <p className="text-base sm:text-lg text-muted max-w-xl mx-auto font-normal leading-relaxed">
            Turn your repository into a living architectural intelligence system with automated blast radius, grounded AI, and continuous synchronization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-xs font-bold gap-2 px-8 h-12 rounded-full bg-black text-white hover:bg-neutral-800 shadow-md hover:shadow-lg transition-all group">
                <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Connect GitHub</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs font-semibold px-7 h-12 rounded-full border-border hover:border-black hover:bg-surface text-foreground transition-all">
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
