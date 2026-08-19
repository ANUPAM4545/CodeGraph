'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Github, 
  Terminal, 
  Sparkles, 
  Network, 
  CheckCircle2, 
  Box,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';

const WORDS_TO_TYPE = [
  'Understand Codebases.',
  'Map Architecture.',
  'Simulate Blast Radius.',
  'Ground AI Answers.',
  'Analyze Dependencies.',
];

const TERMINAL_LOGS = [
  { text: '$ codegraph ingest repo:MarketPlace-Dispute-Engine', delay: 0.2, type: 'cmd' },
  { text: '✔ Tree-sitter AST syntax parsed · 14 files, 48 symbols', delay: 0.8, type: 'success' },
  { text: '✔ Neo4j Knowledge Graph connected (CALLS, IMPORTS, INHERITS)', delay: 1.4, type: 'success' },
  { text: '✔ Qdrant vector chunks embedded with Graph-RAG context', delay: 2.0, type: 'success' },
  { text: '✔ Blast radius indexed · 7 subsystems discovered · Risk Score: 84', delay: 2.6, type: 'info' },
  { text: '⚡ Living architectural intelligence layer ready.', delay: 3.2, type: 'ready' },
];

export default function Hero() {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Typewriter effect loop
  useEffect(() => {
    const targetWord = WORDS_TO_TYPE[currentWordIdx];
    const typingSpeed = isDeleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < targetWord.length) {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        } else {
          // Pause at full word before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(targetWord.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % WORDS_TO_TYPE.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < TERMINAL_LOGS.length ? prev + 1 : prev));
    }, 550);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g @codegraph/cli && codegraph login');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden border-b border-border bg-background">
      
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Floating Ambient AST Pill 1 (Left - Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, x: -30, y: 10 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden xl:flex absolute left-4 top-24 z-10 flex-col gap-1 p-3 rounded-xl border border-border bg-surface/90 backdrop-blur-sm shadow-md font-mono text-[11px] max-w-[210px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted text-[10px] font-bold">AST NODE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="font-bold text-foreground flex items-center gap-1.5 truncate">
            <Box className="w-3.5 h-3.5 text-emerald-500" />
            <span className="truncate">DisputeOrchestrator</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted pt-1 border-t border-border/60">
            <span>Fan-in: 14 callers</span>
            <span className="text-red-600 font-bold">HIGH RISK</span>
          </div>
        </motion.div>

        {/* Floating Ambient AST Pill 2 (Right - Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, x: 30, y: -10 }}
          animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="hidden xl:flex absolute right-4 top-28 z-10 flex-col gap-1 p-3 rounded-xl border border-border bg-surface/90 backdrop-blur-sm shadow-md font-mono text-[11px] max-w-[220px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted text-[10px] font-bold">HYBRID GRAPH-RAG</span>
            <span className="text-purple-600 font-bold text-[9px] bg-purple-500/10 px-1 rounded">QDRANT</span>
          </div>
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Cypher Topological Search</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted pt-1 border-t border-border/60">
            <span>Confidence: 98%</span>
            <span className="text-emerald-600 font-bold">GROUNDED</span>
          </div>
        </motion.div>

        {/* Main Central Content Area */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          
          {/* Eyebrow Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface text-[11px] font-mono font-medium tracking-wide text-foreground shadow-2xs hover:border-black transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-black" />
            <span>Introducing CodeGraph Enterprise 2.0</span>
          </motion.div>

          {/* 3-Line Large Headline with Typewriter Cursor */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-1 sm:space-y-2"
          >
            {/* Line 1: Typewriter Text with blinking bar */}
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight text-foreground leading-[1.08] flex items-center justify-center min-h-[1.15em]">
              <span>{currentText}</span>
              <span className="inline-block w-[3px] sm:w-[5px] h-[0.9em] bg-neutral-400 ml-1 sm:ml-2 animate-pulse align-baseline" />
            </div>

            {/* Line 2 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight text-foreground leading-[1.08]">
              Track Every Dependency.
            </h1>

            {/* Line 3 */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight text-foreground leading-[1.08]">
              All From One Platform.
            </h2>
          </motion.div>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-muted max-w-2xl font-normal leading-relaxed pt-2"
          >
            The premium enterprise platform for codebase intelligence, living architectural knowledge graphs, blast-radius simulation, and real-time developer sync.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-xs font-bold gap-2 px-8 h-12 rounded-full bg-black text-white hover:bg-neutral-800 shadow-md hover:shadow-lg transition-all group">
                <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Connect GitHub</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#product" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs font-semibold px-7 h-12 rounded-full border-border hover:border-black hover:bg-surface text-foreground transition-all">
                <span>Explore the Platform</span>
              </Button>
            </a>
          </motion.div>

          {/* Supporting Microcopy */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[11px] font-mono text-muted/80 tracking-tight"
          >
            Built for developers, architects, and engineering teams.
          </motion.p>

          {/* Animated Industrial Pipeline Terminal Stream */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="w-full max-w-2xl mt-6 rounded-xl border border-border bg-black text-white shadow-2xl overflow-hidden text-left font-mono text-xs"
          >
            {/* Terminal Window Bar */}
            <div className="h-9 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                </div>
                <span className="text-[11px] text-neutral-400 ml-2">codegraph-engine-daemon · live stream</span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white transition-colors"
                title="Copy install command"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy CLI'}</span>
              </button>
            </div>

            {/* Terminal Stream Body */}
            <div className="p-4 space-y-2 text-[11px] bg-black/95 min-h-[145px]">
              {TERMINAL_LOGS.slice(0, activeStep).map((log, idx) => (
                <motion.div 
                  key={log.text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-2 ${
                    log.type === 'cmd' ? 'text-neutral-300 font-bold' :
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'info' ? 'text-amber-400' :
                    'text-purple-400 font-bold'
                  }`}
                >
                  <span className="text-neutral-600 select-none">&gt;</span>
                  <span>{log.text}</span>
                </motion.div>
              ))}
              {activeStep < TERMINAL_LOGS.length && (
                <div className="flex items-center gap-2 text-neutral-500 animate-pulse">
                  <span className="text-neutral-700">&gt;</span>
                  <span className="inline-block w-2 h-3.5 bg-neutral-400 align-middle" />
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
