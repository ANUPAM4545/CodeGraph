'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, Layers, Network } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#capabilities' },
  { label: 'Platform', href: '#preview' },
  { label: 'Solutions', href: '#architecture' },
  { label: 'Resources', href: '#workflow' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Features');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-full border border-border bg-white/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 ${
            isScrolled 
              ? 'h-13 py-2 shadow-lg shadow-black/[0.04] border-neutral-300' 
              : 'h-14 py-2.5 shadow-sm shadow-black/[0.02]'
          }`}
        >
          {/* Brand Logo with simple graph-inspired "C" mark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12a7 7 0 1 1-7-7" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <path d="M12 12l5-5" />
                <circle cx="17" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-extrabold text-foreground text-sm tracking-tight font-mono">
              CodeGraph
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.label;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveLink(link.label)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'text-foreground font-bold bg-neutral-100'
                      : 'text-neutral-600 hover:text-foreground hover:bg-neutral-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3 font-mono">
            <Link
              href="/login"
              className="text-xs font-semibold text-neutral-600 hover:text-foreground transition-colors px-2.5 py-1"
            >
              Sign In
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="h-9 px-4 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-xs gap-1.5 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/login">
              <Button size="sm" className="h-8 px-3 text-xs rounded-full bg-black text-white font-bold">
                Get Started
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full border border-border text-foreground hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Responsive Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 p-5 rounded-3xl border border-border bg-white shadow-2xl md:hidden font-mono text-xs space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-foreground font-semibold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-10 rounded-full text-xs font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-10 rounded-full bg-black text-white text-xs font-bold gap-1.5">
                  <span>Get Started →</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
