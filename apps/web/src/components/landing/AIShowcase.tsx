'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  FileCode, 
  CheckCircle2, 
  Database, 
  ArrowRight,
  Code2,
  ShieldCheck
} from 'lucide-react';

interface AIQuestion {
  id: string;
  topic: string;
  question: string;
  cypher: string;
  answer: string;
  sources: { file: string; lines: string; role: string }[];
}

const AI_QUESTIONS: AIQuestion[] = [
  {
    id: 'auth',
    topic: 'Authentication Architecture',
    question: 'How does authentication work in this repository?',
    cypher: 'MATCH (s:Service {name: "AuthService"})-[:CALLS*1..2]->(f:Function) RETURN s, f',
    answer: 'Authentication is orchestrated by `AuthService` in `src/auth/service.py` using Proof Key for Code Exchange (PKCE) GitHub OAuth.\n\nSession credentials are encrypted with SHA-256 HMAC and issued via HttpOnly cookies. Downstream verification is enforced across 12 protected routes by `AuthMiddleware.verify_session()`.',
    sources: [
      { file: 'src/auth/service.py', lines: 'L24–L89', role: 'AuthService (PKCE Token Flow)' },
      { file: 'src/auth/middleware.py', lines: 'L12–L45', role: 'AuthMiddleware.verify_session()' },
      { file: 'src/models/user.py', lines: 'L30–L62', role: 'User Schema & Permissions' },
      { file: 'src/core/security.py', lines: 'L50–L78', role: 'HMAC SHA-256 Signer' },
    ]
  },
  {
    id: 'dispute',
    topic: 'Dispute Arbitration Engine',
    question: 'What happens when a transaction dispute moves to the SETTLED state?',
    cypher: 'MATCH (d:Class {name: "DisputeOrchestrator"})-[:CALLS]->(l:Class {name: "LedgerClient"}) RETURN d, l',
    answer: 'When a dispute transitions to `SETTLED`, `DisputeOrchestrator.executeResolution()` triggers a double-entry balance adjustment in `LedgerClient.reconcile()`.\n\nThe entire state transition is executed in an ACID PostgreSQL transaction and dispatches signed webhooks to connected client listeners.',
    sources: [
      { file: 'src/services/dispute.ts', lines: 'L48–L112', role: 'DisputeOrchestrator' },
      { file: 'src/db/ledger.ts', lines: 'L76–L134', role: 'LedgerClient.reconcile()' },
      { file: 'src/events/payout.ts', lines: 'L14–L52', role: 'WebhookDispatcher' },
    ]
  }
];

export default function AIShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle between questions (pauses on user interaction)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % AI_QUESTIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeQuestion = AI_QUESTIONS[activeIdx];

  return (
    <section id="ai-assistant" className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
      {/* Background Architectural Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-[11px] font-mono font-bold text-neutral-800 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>SOURCE-GROUNDED REASONING</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Ask Your Codebase Anything.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-normal">
            Answers grounded in your actual repository. Every architectural explanation cites verified source files, line ranges, and topological Cypher graph traversals.
          </p>
        </div>

        {/* Topic Selector Pills */}
        <div 
          className="flex justify-center mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white border border-border shadow-xs">
            {AI_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  activeIdx === idx
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-foreground hover:bg-neutral-100'
                }`}
              >
                {q.topic}
              </button>
            ))}
          </div>
        </div>

        {/* Split Layout: AI Conversation (Left) vs Source Grounding & Cypher Evidence (Right) */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto font-mono text-xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Left Column: AI Conversation Window (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-white shadow-xl overflow-hidden flex flex-col">
            
            {/* Window Top Bar */}
            <div className="h-12 bg-neutral-50 border-b border-border px-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>AI Architectural Copilot</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                100% Grounded
              </span>
            </div>

            {/* Chat Body */}
            <div className="p-6 space-y-5 bg-white">
              
              {/* User Question */}
              <div className="flex justify-end">
                <div className="max-w-[90%] bg-black text-white p-4 rounded-2xl rounded-br-none space-y-1 shadow-md">
                  <div className="text-[10px] text-neutral-400 uppercase font-bold">Question</div>
                  <p className="text-xs font-sans leading-relaxed">
                    &quot;{activeQuestion.question}&quot;
                  </p>
                </div>
              </div>

              {/* AI Response Card */}
              <div className="flex justify-start">
                <div className="w-full bg-neutral-50/80 border border-border p-5 rounded-2xl rounded-tl-none space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesized Architecture Analysis</span>
                    </div>
                    <span className="text-[10px] text-muted font-bold">Graph-RAG Engine</span>
                  </div>

                  <p className="text-xs font-sans text-foreground leading-relaxed whitespace-pre-line">
                    {activeQuestion.answer}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Source Chips & Cypher Query (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Cypher Traversal Card */}
            <div className="p-5 rounded-3xl border border-border bg-white shadow-md space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  <span>Executed Cypher Traversal</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">0.4ms latency</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 text-purple-300 text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                {activeQuestion.cypher}
              </div>
            </div>

            {/* Source Reference Chips */}
            <div className="p-5 rounded-3xl border border-border bg-white shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-extrabold text-foreground text-xs uppercase tracking-wider">
                  Verified Source Citations ({activeQuestion.sources.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Exact Citations
                </span>
              </div>

              <div className="space-y-2">
                {activeQuestion.sources.map((src) => (
                  <div key={src.file} className="p-3 rounded-xl border border-border bg-neutral-50/60 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-blue-600" />
                        <span>{src.file}</span>
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">{src.role}</div>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-border text-foreground font-bold">
                      {src.lines}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
