'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Terminal, Network, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

const REAL_TECH_STACK = [
  { name: 'Python', role: 'Tree-sitter & AST Extraction' },
  { name: 'FastAPI', role: 'High-Throughput REST APIs' },
  { name: 'Next.js 14', role: 'Fullstack Web Engine' },
  { name: 'TypeScript', role: 'Lossless Grammar Parsing' },
  { name: 'Neo4j 5', role: 'ACID Property Graph DB' },
  { name: 'PostgreSQL', role: 'Relational Workspace DB' },
  { name: 'Qdrant', role: 'Dense Vector & Hybrid RAG' },
  { name: 'Docker', role: 'Reproducible Deployments' },
];

export default function TrustCTASection() {
  return (
    <section className="py-24 md:py-36 bg-surface/40 border-b border-border relative overflow-hidden">
      
      {/* Background Architectural Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* Trust & Ecosystem Section */}
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-[11px] font-mono font-bold text-neutral-800 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>CORE ARCHITECTURE FOUNDATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Built for Teams That Own Complex Code.
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto font-normal font-sans">
              Engineered with proven, high-performance database and language processing technologies.
            </p>
          </div>

          {/* Clean Light-Mode Tech Stack Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {REAL_TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-2xl border border-border bg-white shadow-xs hover:border-black transition-all flex flex-col items-start space-y-1 group"
              >
                <span className="font-extrabold text-sm text-foreground font-mono group-hover:text-black">
                  {tech.name}
                </span>
                <span className="text-[11px] text-muted font-sans text-left">
                  {tech.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Large Rounded Final CTA Container */}
        <div className="rounded-3xl border border-border bg-white shadow-2xl p-8 sm:p-14 max-w-4xl mx-auto relative overflow-hidden">
          
          {/* Subtle Inner Architectural Dot Grid */}
          <div 
            className="absolute inset-0 opacity-[0.025] pointer-events-none" 
            style={{ 
              backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
              backgroundSize: '20px 20px' 
            }} 
          />

          <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
            
            {/* Centered Brand Mark */}
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12a7 7 0 1 1-7-7" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <path d="M12 12l5-5" />
                <circle cx="17" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Understand your codebase <br className="hidden sm:inline" />
              before you change it.
            </h2>

            <p className="text-base sm:text-lg text-muted font-normal font-sans leading-relaxed">
              Connect a repository and turn thousands of files and relationships into something your team can actually understand.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 shadow-md hover:shadow-xl transition-all gap-2 group"
                >
                  <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Connect GitHub</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <a href="#preview" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 rounded-full border-border hover:border-black hover:bg-surface text-xs font-semibold text-foreground transition-all"
                >
                  <span>Explore CodeGraph</span>
                </Button>
              </a>
            </div>

            <p className="text-[11px] font-mono text-muted tracking-tight pt-2">
              Free for open-source repositories · Enterprise ready
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
