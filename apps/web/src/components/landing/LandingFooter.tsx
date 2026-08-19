'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Github, ArrowUpRight } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-border">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs">
                <Network className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold text-foreground text-sm tracking-tight">CodeGraph</span>
            </Link>
            <p className="text-xs text-muted font-sans max-w-sm leading-relaxed">
              AI-powered code intelligence platform transforming repositories into living architectural knowledge graphs.
            </p>
            <div className="text-[11px] text-muted flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="font-bold text-foreground uppercase tracking-wider text-[11px]">Product</div>
            <ul className="space-y-2 text-muted">
              <li><a href="#product" className="hover:text-foreground transition-colors">Overview</a></li>
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Graph Explorer</a></li>
              <li><a href="#intelligence" className="hover:text-foreground transition-colors">Grounded AI</a></li>
              <li><a href="#ide" className="hover:text-foreground transition-colors">IDE Copilot</a></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Developers Links */}
          <div className="space-y-3">
            <div className="font-bold text-foreground uppercase tracking-wider text-[11px]">Developers</div>
            <ul className="space-y-2 text-muted">
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">API Docs <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="https://github.com/ANUPAM4545/CodeGraph" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">VS Code Extension <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="https://github.com/ANUPAM4545/CodeGraph" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">GitHub Repo <ArrowUpRight className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Security & Company */}
          <div className="space-y-3">
            <div className="font-bold text-foreground uppercase tracking-wider text-[11px]">Security & Legal</div>
            <ul className="space-y-2 text-muted">
              <li><a href="#enterprise" className="hover:text-foreground transition-colors">Enterprise RBAC</a></li>
              <li><a href="#enterprise" className="hover:text-foreground transition-colors">Data Isolation</a></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted">
          <div>
            © {new Date().getFullYear()} CodeGraph Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Inter font system</span>
            <span>·</span>
            <span>FastAPI & Next.js Core</span>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
