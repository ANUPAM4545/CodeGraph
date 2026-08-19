'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  FileCode, 
  CheckCircle2, 
  Database, 
  ArrowRight,
  Code2,
  ShieldCheck,
  Send,
  Loader2,
  Terminal,
  Layers
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
    topic: 'Authentication Flow',
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
    topic: 'Dispute Arbitration',
    question: 'What happens when a transaction dispute moves to the SETTLED state?',
    cypher: 'MATCH (d:Class {name: "DisputeOrchestrator"})-[:CALLS]->(l:Class {name: "LedgerClient"}) RETURN d, l',
    answer: 'When a dispute transitions to `SETTLED`, `DisputeOrchestrator.executeResolution()` triggers a double-entry balance adjustment in `LedgerClient.reconcile()`.\n\nThe entire state transition is executed in an ACID PostgreSQL transaction and dispatches signed webhooks to connected client listeners.',
    sources: [
      { file: 'src/services/dispute.ts', lines: 'L48–L112', role: 'DisputeOrchestrator' },
      { file: 'src/db/ledger.ts', lines: 'L76–L134', role: 'LedgerClient.reconcile()' },
      { file: 'src/events/payout.ts', lines: 'L14–L52', role: 'WebhookDispatcher' },
    ]
  },
  {
    id: 'impact',
    topic: 'Blast Radius Impact',
    question: 'What will break if I modify LedgerClient.reconcile() parameters?',
    cypher: 'MATCH (m:Method {name: "reconcile"})<-[:CALLS*1..2]-(caller) RETURN caller, m',
    answer: 'Modifying `LedgerClient.reconcile()` directly impacts 14 upstream callers across 3 subsystems:\n\n1. `DisputeOrchestrator.executeResolution()` (Direct dependency)\n2. `WebhookDispatcher.notifyPayout()` (Downstream async event)\n3. `POST /api/v1/ledger/reconcile` (REST endpoint wrapper)\n\nCalculated Risk Score: 84/100 (HIGH).',
    sources: [
      { file: 'src/db/ledger.ts', lines: 'L76–L134', role: 'LedgerClient (Target Method)' },
      { file: 'src/services/dispute.ts', lines: 'L24–L68', role: 'DisputeOrchestrator (Caller)' },
      { file: 'src/api/routes/ledger.py', lines: 'L40–L92', role: 'FastAPI Endpoint (Caller)' },
    ]
  }
];

export default function AIShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Simulation state machine: 'TYPING_QUESTION' -> 'SEARCHING_GRAPH' -> 'STREAMING_ANSWER' -> 'COMPLETE'
  const [step, setStep] = useState<'TYPING_QUESTION' | 'SEARCHING_GRAPH' | 'STREAMING_ANSWER' | 'COMPLETE'>('TYPING_QUESTION');
  const [typedQuestion, setTypedQuestion] = useState('');
  const [displayedAnswer, setDisplayedAnswer] = useState('');

  const currentQ = AI_QUESTIONS[activeIdx];

  // Handle live conversational lifecycle for the current question
  useEffect(() => {
    let isCancelled = false;

    // Reset states
    setStep('TYPING_QUESTION');
    setTypedQuestion('');
    setDisplayedAnswer('');

    const fullQuestion = currentQ.question;
    const fullAnswer = currentQ.answer;

    // Phase 1: Type the user question
    let charIdx = 0;
    const questionInterval = setInterval(() => {
      if (isCancelled) return;
      charIdx++;
      setTypedQuestion(fullQuestion.substring(0, charIdx));

      if (charIdx >= fullQuestion.length) {
        clearInterval(questionInterval);

        // Phase 2: Searching graph (simulated 700ms latency)
        setTimeout(() => {
          if (isCancelled) return;
          setStep('SEARCHING_GRAPH');

          // Phase 3: Stream AI Answer
          setTimeout(() => {
            if (isCancelled) return;
            setStep('STREAMING_ANSWER');

            let wordIdx = 0;
            const words = fullAnswer.split(' ');
            const answerInterval = setInterval(() => {
              if (isCancelled) return;
              wordIdx += 2; // Stream 2 words per tick for natural cadence
              setDisplayedAnswer(words.slice(0, wordIdx).join(' '));

              if (wordIdx >= words.length) {
                clearInterval(answerInterval);
                setDisplayedAnswer(fullAnswer);
                setStep('COMPLETE');

                // Phase 5: Pause and cycle to next question (if not paused by user hover)
                setTimeout(() => {
                  if (isCancelled) return;
                  if (!isPaused) {
                    setActiveIdx((prev) => (prev + 1) % AI_QUESTIONS.length);
                  }
                }, 4000);
              }
            }, 55);

          }, 800);

        }, 400);
      }
    }, 35);

    return () => {
      isCancelled = true;
      clearInterval(questionInterval);
    };
  }, [activeIdx, isPaused, currentQ.answer, currentQ.question]);

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
                onClick={() => {
                  setActiveIdx(idx);
                  setStep('TYPING_QUESTION');
                }}
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

        {/* Split Layout: Live Interactive AI Chat (Left) vs Real-Time Citations & Cypher Trace (Right) */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto font-mono text-xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Left Column: Living Interactive AI Chat Window (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-white shadow-2xl overflow-hidden flex flex-col min-h-[480px]">
            
            {/* Window Header Bar */}
            <div className="h-12 bg-neutral-50 border-b border-border px-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>CodeGraph AI Architectural Copilot</span>
              </div>
              
              {/* Live Status Pill */}
              <div className="flex items-center gap-1.5">
                {step === 'TYPING_QUESTION' && (
                  <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                    User Input...
                  </span>
                )}
                {step === 'SEARCHING_GRAPH' && (
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-bold flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
                    Traversing Neo4j AST...
                  </span>
                )}
                {(step === 'STREAMING_ANSWER' || step === 'COMPLETE') && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    100% Grounded in AST
                  </span>
                )}
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between bg-white">
              
              <div className="space-y-4">
                {/* User Question Bubble with character typing */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] bg-black text-white p-4 rounded-2xl rounded-br-none space-y-1 shadow-md">
                    <div className="text-[9px] text-neutral-400 uppercase font-bold flex items-center justify-between">
                      <span>User Question</span>
                      <span className="text-[9px] text-neutral-500">Live Input</span>
                    </div>
                    <p className="text-xs font-sans leading-relaxed">
                      &quot;{typedQuestion}&quot;
                      {step === 'TYPING_QUESTION' && (
                        <span className="inline-block w-1.5 h-3.5 bg-white ml-1 align-middle animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>

                {/* Graph Search Radar Indicator */}
                {step === 'SEARCHING_GRAPH' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/60 flex items-center gap-3 text-purple-900"
                  >
                    <Database className="w-4 h-4 text-purple-600 animate-bounce shrink-0" />
                    <div>
                      <div className="font-bold text-xs">Evaluating Cypher Multi-Hop Graph</div>
                      <div className="text-[10px] text-purple-700 font-sans">Matching callers, definitions, and external packages without hallucinations...</div>
                    </div>
                  </motion.div>
                )}

                {/* AI Response Card with streaming text */}
                {(step === 'STREAMING_ANSWER' || step === 'COMPLETE') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="w-full bg-neutral-50/90 border border-border p-5 rounded-2xl rounded-tl-none space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>CodeGraph Synthesized Analysis</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-bold">Graph-RAG Engine</span>
                      </div>

                      <p className="text-xs font-sans text-foreground leading-relaxed whitespace-pre-line">
                        {displayedAnswer}
                        {step === 'STREAMING_ANSWER' && (
                          <span className="inline-block w-1.5 h-3.5 bg-black ml-1 align-middle animate-pulse" />
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Simulated Input Prompt Bar at Bottom */}
              <div className="pt-3 border-t border-border mt-auto">
                <div className="flex items-center justify-between gap-2 p-2 rounded-2xl border border-border bg-neutral-50/70 text-xs">
                  <div className="flex items-center gap-2 text-muted px-2 flex-1">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
                    <span className="truncate">
                      {step === 'TYPING_QUESTION' ? typedQuestion : 'Ask about architecture, blast radius, or routes...'}
                    </span>
                  </div>
                  <button className="h-8 px-3.5 rounded-xl bg-black text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-neutral-800 transition-colors">
                    <span>Ask Codebase</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Real-Time Cypher Traversal & Verified Citations (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Cypher Traversal Box */}
            <div className="p-5 rounded-3xl border border-border bg-white shadow-md space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  <span>Executed Cypher Traversal</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  step === 'SEARCHING_GRAPH' ? 'bg-purple-100 text-purple-800 animate-pulse' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  {step === 'SEARCHING_GRAPH' ? 'Executing...' : '0.4ms latency'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 text-purple-300 text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                {currentQ.cypher}
              </div>
            </div>

            {/* Verified AST Source Citations */}
            <div className="p-5 rounded-3xl border border-border bg-white shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-extrabold text-foreground text-xs uppercase tracking-wider">
                  Verified AST Sources ({currentQ.sources.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Exact Citations
                </span>
              </div>

              <div className="space-y-2">
                {currentQ.sources.map((src, sIdx) => {
                  const isVisible = step === 'STREAMING_ANSWER' || step === 'COMPLETE' || sIdx === 0;

                  return (
                    <motion.div 
                      key={src.file}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: isVisible ? 1 : 0.4, x: 0 }}
                      transition={{ duration: 0.3, delay: sIdx * 0.1 }}
                      className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                        isVisible ? 'border-border bg-neutral-50/60 shadow-2xs' : 'border-neutral-200 bg-white opacity-40'
                      }`}
                    >
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
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
