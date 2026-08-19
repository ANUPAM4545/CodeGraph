'use client';

import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  FileCode, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  ArrowRight,
  GitPullRequest
} from 'lucide-react';

export default function AIShowcase() {
  return (
    <section id="intelligence" className="py-20 md:py-28 bg-surface/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>GROUNDED AI INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Ask your codebase.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            CodeGraph does not guess or generate hallucinated code. Every AI answer is directly grounded in Neo4j graph traversals and Qdrant semantic vector chunks.
          </p>
        </div>

        {/* Split Layout: AI Chat (Left) vs Structured Evidence (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: AI Conversation Window */}
          <div className="lg:col-span-7 border border-border rounded-xl bg-background shadow-lg overflow-hidden flex flex-col font-mono text-xs">
            
            {/* Window Top Bar */}
            <div className="h-10 bg-surface border-b border-border px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>AI Architectural Assistant</span>
              </div>
              <span className="text-[10px] text-muted">Model: Grounded GPT-4o / Claude</span>
            </div>

            {/* Chat Body */}
            <div className="p-5 space-y-4">
              
              {/* User Prompt Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-black text-white p-3.5 rounded-xl rounded-br-none space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase font-bold">Question</div>
                  <p className="text-xs font-sans leading-relaxed">
                    &quot;Explain the authentication architecture and what will break if I change the JWT token verification logic.&quot;
                  </p>
                </div>
              </div>

              {/* AI Response Bubble */}
              <div className="flex justify-start">
                <div className="max-w-[95%] bg-surface border border-border p-4 rounded-xl rounded-bl-none space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border text-[10px]">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>CodeGraph Synthesis</span>
                    </span>
                    <span className="text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      EVIDENCE CONFIDENCE: 98%
                    </span>
                  </div>

                  <p className="text-xs font-sans text-foreground leading-relaxed">
                    Authentication in this repository is managed through a centralized <code className="bg-background px-1 py-0.5 rounded border border-border">get_current_user</code> dependency within <code className="bg-background px-1 py-0.5 rounded border border-border">src/services/security.py</code>.
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-foreground">Downstream Blast Radius (5 Callers):</div>
                    <ul className="list-disc list-inside text-[11px] text-muted space-y-1 font-sans">
                      <li><code className="text-foreground">/api/v1/repositories</code> router requires verified user ID</li>
                      <li><code className="text-foreground">/api/v1/analysis</code> job trigger requires organization tenancy</li>
                      <li>WebSocket handshake in <code className="text-foreground">ws.py</code> validates token before connection</li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded bg-background border border-border text-[11px] space-y-1">
                    <div className="font-bold text-foreground">Grounded Source Reference:</div>
                    <div className="text-muted font-mono text-[10px]">
                      src/services/security.py (Lines 48–72) · Cypher Edge: CALLS
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Grounded Evidence Inspector */}
          <div className="lg:col-span-5 border border-border rounded-xl bg-background p-6 space-y-6 shadow-sm font-mono text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                Retrieved Evidence Graph
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </span>
            </div>

            {/* Evidence Source 1 */}
            <div className="p-3 rounded-lg border border-border bg-surface space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-blue-500" />
                  <span>src/services/security.py</span>
                </span>
                <span className="text-[10px] text-muted">AST Match (1.00)</span>
              </div>
              <p className="text-[10px] text-muted font-sans leading-tight">
                Contains <code className="text-foreground">get_current_user()</code> and <code className="text-foreground">create_access_token()</code>.
              </p>
            </div>

            {/* Evidence Source 2 */}
            <div className="p-3 rounded-lg border border-border bg-surface space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Neo4j Cypher Traversal</span>
                </span>
                <span className="text-[10px] text-muted">3 Hops</span>
              </div>
              <p className="text-[10px] text-muted font-sans leading-tight">
                Traced 5 direct router callers and 12 indirect database model queries.
              </p>
            </div>

            {/* Evidence Source 3 */}
            <div className="p-3 rounded-lg border border-border bg-surface space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                  <span>Qdrant Vector Chunk</span>
                </span>
                <span className="text-[10px] text-muted">Cosine Score: 0.94</span>
              </div>
              <p className="text-[10px] text-muted font-sans leading-tight">
                Semantically matched session validation and OAuth token refresh logic.
              </p>
            </div>

            {/* Grounding Guarantee Callout */}
            <div className="pt-2 border-t border-border text-[11px] text-muted font-sans">
              <strong className="text-foreground font-mono">No Hallucinations Policy:</strong> If an architectural relationship cannot be traced to the AST graph, the AI explicitly reports insufficient context.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
