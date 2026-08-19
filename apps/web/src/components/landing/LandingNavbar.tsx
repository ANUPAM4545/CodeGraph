'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Network, 
  Menu, 
  X, 
  ArrowRight, 
  Github, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Terminal 
} from 'lucide-react';
import { Button } from '../ui/Button';

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
      {/* Floating Pill Container */}
      <div className="pointer-events-auto max-w-5xl w-full rounded-full border border-border/90 bg-background/90 backdrop-blur-md shadow-md h-14 px-4 sm:px-6 flex items-center justify-between transition-all">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-sm tracking-tight group-hover:scale-105 transition-transform shadow-xs">
            <Network className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-foreground font-mono">
            CodeGraph
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-muted">
          <a href="#product" className="hover:text-foreground transition-colors">Features</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">Solutions</a>
          <a href="#intelligence" className="hover:text-foreground transition-colors">Intelligence</a>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link>
        </nav>

        {/* Right CTA Area */}
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/login" className="text-xs font-semibold text-muted hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/login">
            <Button size="sm" className="text-xs font-bold px-5 h-9 rounded-full bg-black text-white hover:bg-neutral-800 shadow-xs">
              <span>Get Started</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full text-muted hover:text-foreground hover:bg-surface"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 left-4 right-4 max-w-md mx-auto rounded-2xl border border-border bg-background/95 backdrop-blur-lg p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2.5 text-sm font-medium text-muted">
            <a href="#product" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1 hover:text-foreground">Features</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1 hover:text-foreground">Solutions</a>
            <a href="#intelligence" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1 hover:text-foreground">Intelligence</a>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1 hover:text-foreground">Pricing</Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1 hover:text-foreground">Documentation</Link>
          </nav>
          <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-muted hover:text-foreground">
              Sign In
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="text-xs font-bold rounded-full px-5 h-9 bg-black text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
