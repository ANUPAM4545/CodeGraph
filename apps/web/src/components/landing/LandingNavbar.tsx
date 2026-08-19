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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-2xs' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-sm tracking-tight group-hover:scale-105 transition-transform shadow-2xs">
            <Network className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-base text-foreground font-mono">
            CodeGraph
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-muted">
          <a href="#product" className="hover:text-foreground transition-colors">Product</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#intelligence" className="hover:text-foreground transition-colors">Intelligence</a>
          <a href="#ide" className="hover:text-foreground transition-colors">IDE Copilot</a>
          <a href="#enterprise" className="hover:text-foreground transition-colors">Enterprise</a>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
        </nav>

        {/* Right CTA Area */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs font-medium text-muted hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="text-xs font-bold gap-1.5 shadow-xs bg-black text-white hover:bg-neutral-800">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-muted">
            <a href="#product" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Product</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Architecture</a>
            <a href="#intelligence" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Intelligence</a>
            <a href="#ide" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">IDE Copilot</a>
            <a href="#enterprise" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Enterprise</a>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Pricing</Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-foreground">Docs</Link>
          </nav>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs font-semibold justify-center">Sign In</Button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full text-xs font-bold justify-center bg-black text-white">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
