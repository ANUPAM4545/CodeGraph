'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-black text-white border-t border-neutral-900 pt-20 pb-12 font-mono text-xs relative overflow-hidden select-none">
      
      {/* Background Architectural Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
          backgroundSize: '28px 28px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-16 border-b border-neutral-900">
          
          {/* Brand Identity Column (2 cols) */}
          <div className="col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12a7 7 0 1 1-7-7" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <path d="M12 12l5-5" />
                  <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-black text-white text-lg tracking-tight font-mono">
                CodeGraph
              </span>
            </Link>
            
            <p className="text-xs text-neutral-400 font-sans max-w-sm leading-relaxed">
              The premium enterprise platform for code intelligence, living knowledge graphs, and source-grounded architectural reasoning.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-1 text-neutral-400">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:border-neutral-600 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://github.com/ANUPAM4545/CodeGraph" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:border-neutral-600 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:border-neutral-600 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <div className="font-extrabold text-white uppercase tracking-wider text-[11px]">Product</div>
            <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
              <li><a href="#capabilities" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Knowledge Graph</a></li>
              <li><a href="#intelligence" className="hover:text-white transition-colors">Repository Intel</a></li>
              <li><a href="#ai-assistant" className="hover:text-white transition-colors">AI Copilot</a></li>
              <li><a href="#workflow" className="hover:text-white transition-colors">Impact Analysis</a></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <div className="font-extrabold text-white uppercase tracking-wider text-[11px]">Resources</div>
            <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">API Reference <ArrowUpRight className="w-3 h-3 text-neutral-500" /></a></li>
              <li><a href="https://github.com/ANUPAM4545/CodeGraph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">GitHub Repo <ArrowUpRight className="w-3 h-3 text-neutral-500" /></a></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <div className="font-extrabold text-white uppercase tracking-wider text-[11px]">Company</div>
            <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <div className="font-extrabold text-white uppercase tracking-wider text-[11px]">Legal</div>
            <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Giant Atmospheric Background Watermark */}
        <div className="py-12 sm:py-16 md:py-20 text-center overflow-hidden">
          <span className="font-black text-neutral-900 tracking-tighter text-6xl sm:text-8xl md:text-[10rem] lg:text-[13rem] leading-none uppercase inline-block opacity-80 pointer-events-none select-none transition-opacity duration-300">
            CODEGRAPH
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} CodeGraph Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-[10px] text-neutral-300">
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
