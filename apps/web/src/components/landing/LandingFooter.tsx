'use client';

import React from 'react';
import Link from 'next/link';
import { Github, ArrowUpRight } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-border">
          
          {/* Brand Column (2 cols) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-xs">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12a7 7 0 1 1-7-7" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <path d="M12 12l5-5" />
                  <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-foreground text-base tracking-tight">CodeGraph</span>
            </Link>
            
            <p className="text-xs text-muted font-sans max-w-sm leading-relaxed">
              AI-powered code intelligence platform transforming repositories into living architectural knowledge graphs.
            </p>

            <div className="text-[11px] text-muted flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational · Neo4j & Qdrant Live</span>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <div className="font-extrabold text-foreground uppercase tracking-wider text-[11px]">Product</div>
            <ul className="space-y-2 text-muted font-sans text-xs">
              <li><a href="#preview" className="hover:text-foreground transition-colors">Platform</a></li>
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Knowledge Graph</a></li>
              <li><a href="#intelligence" className="hover:text-foreground transition-colors">Repository Intelligence</a></li>
              <li><a href="#ai-assistant" className="hover:text-foreground transition-colors">AI Assistant</a></li>
              <li><a href="#capabilities" className="hover:text-foreground transition-colors">Impact Analysis</a></li>
              <li><a href="#preview" className="hover:text-foreground transition-colors">3D Universe</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <div className="font-extrabold text-foreground uppercase tracking-wider text-[11px]">Resources</div>
            <ul className="space-y-2 text-muted font-sans text-xs">
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">API Reference <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="https://github.com/ANUPAM4545/CodeGraph" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">GitHub <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <div className="font-extrabold text-foreground uppercase tracking-wider text-[11px]">Company & Legal</div>
            <ul className="space-y-2 text-muted font-sans text-xs">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted text-[11px]">
          <div>
            &copy; 2026 CodeGraph. Built for understanding complex software.
          </div>
          <div className="flex items-center gap-5">
            <a href="https://github.com/ANUPAM4545/CodeGraph" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <span>v1.0.0-release</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
