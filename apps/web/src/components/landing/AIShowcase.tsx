'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  FileCode, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  ArrowRight,
  GitPullRequest,
  Code2,
  Terminal,
  Zap
} from 'lucide-react';

const AI_CONVERSATIONS = [
  {
    id: 'auth',
    title: 'Authentication & JWT Flow',
    question: 'Explain the authentication architecture and what will break if I change the JWT token verification logic.',
    cypherQuery: 'MATCH (c:Class {name: "AuthService"})-[:CALLS*1..2]->(f:Function) RETURN c, f',
    answer: 'The authentication pipeline is managed by `AuthService` in `src/auth/service.py`.\n\nChanging the JWT token verification directly impacts 12 downstream endpoints:\n1. `/api/v1/repositories` (Header bearer validation)\n2. `WebSocketManager.authenticate_connection()`\n3. `WebhookDispatcher.verify_hmac_signature()`\n\nAll session states rely on HttpOnly cryptographic cookies.',
    sources: [
      { file: 'src/auth/service.py', lines: 'L24-L89', symbols: 'AuthService, verify_token()' },
      { file: 'src/api/v1/auth.py', lines: 'L12-L45', symbols: 'login_endpoint()' },
      { file: 'src/core/security.py', lines: 'L50-L82', symbols: 'decode_jwt_token()' }
    ],
    confidence: '99% GROUNDED'
  },
  {
    id: 'dispute',
    title: 'Dispute Orchestration',
    question: 'How does DisputeOrchestrator reconcile ledger balances upon state transition?',
    cypherQuery: 'MATCH (d:Class {name: "DisputeOrchestrator"})-[:CALLS]->(l:Class {name: "LedgerClient"}) RETURN d, l',
    answer: 'DisputeOrchestrator in `src/services/dispute.ts` manages double-entry balance sheets by invoking `LedgerClient.reconcile()` during the `SETTLED` transition state.\n\nTransactions are executed in an ACID PostgreSQL transaction with automatic rollback if Stripe webhook verification fails.',
    sources: [
      { file: 'src/services/dispute.ts', lines: 'L48-L112', symbols: 'DisputeOrchestrator' },
      { file: 'src/db/ledger.ts', lines: 'L76-L134', symbols: 'LedgerClient.reconcile()' }
    ],
    confidence: '98% GROUNDED'
  }
];

export default function AIShowcase() {
  const [selectedConvoId, setSelectedConvoId] = useState('auth');
  const convo = AI_CONVERSATIONS.find((c) => c.id === selectedConvoId) || AI_CONVERSATIONS[0];

  return (
    <section id="intelligence" className="py-24 md:py-32 bg-surface/30 border-b border-border relative overflow-hidden">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>GROUNDED AI ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Ask your codebase.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            CodeGraph does not guess or generate hallucinated code. Every AI answer is directly grounded in Neo4j graph traversals and Qdrant semantic vector chunks.
          </p>
        </div>

        {/* Conversation Topic Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-surface border border-border">
            {AI_CONVERSATIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConvoId(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  selectedConvoId === c.id
                    ? 'bg-black text-white shadow-xs'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* macOS Style Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: AI Conversation Window (7 cols) */}
          <div className="lg:col-span-7 border border-border rounded-3xl bg-background shadow-xl overflow-hidden flex flex-col font-mono text-xs">
            
            {/* Window Top Bar */}
            <div className="h-12 bg-surface border-b border-border px-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>AI Architectural Copilot</span>
              </div>
              <span className="text-[10px] text-muted font-bold bg-background px-2.5 py-0.5 rounded-full border border-border">
                Graph-RAG Engine
              </span>
            </div>

            {/* Chat Body */}
            <div className="p-6 space-y-5">
              
              {/* User Question Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[90%] bg-black text-white p-4 rounded-2xl rounded-br-none space-y-1 shadow-md">
                  <div className="text-[10px] text-neutral-400 uppercase font-bold">Question</div>
                  <p className="text-xs font-sans leading-relaxed">
                    &quot;{convo.question}&quot;
                  </p>
                </div>
              </div>

              {/* AI Response Card */}
              <div className="flex justify-start">
                <div className="w-full bg-surface/60 border border-border p-5 rounded-2xl rounded-tl-none space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <div className="flex items-center gap-1.5 text-purple-600 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesized Architectural Analysis</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {convo.confidence}
                    </span>
                  </div>

                  <p className="text-xs font-sans text-foreground leading-relaxed whitespace-pre-line">
                    {convo.answer}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Grounding Evidence & Cypher Trace (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Cypher Traversal Card */}
            <div className="p-5 rounded-3xl border border-border bg-black text-white font-mono text-xs shadow-xl space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Executed Cypher Query</span>
                </span>
                <span className="text-[10px] text-emerald-400">0.4ms</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-purple-300 overflow-x-auto leading-relaxed">
                {convo.cypherQuery}
              </div>
            </div>

            {/* Verified AST Source Citations */}
            <div className="p-5 rounded-3xl border border-border bg-background shadow-lg space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-extrabold text-foreground text-xs uppercase tracking-wider">
                  Verified AST Sources ({convo.sources.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Exact Citations
                </span>
              </div>

              <div className="space-y-2">
                {convo.sources.map((src) => (
                  <div key={src.file} className="p-3 rounded-xl border border-border bg-surface flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-blue-500" />
                        <span>{src.file}</span>
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">{src.symbols}</div>
                    </div>
                    <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border text-foreground font-bold">
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
