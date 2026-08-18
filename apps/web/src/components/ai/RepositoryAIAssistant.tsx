'use client';

import React, { useState } from 'react';
import { Send, Loader2, Sparkles, AlertTriangle, Bot, User, Code2, BookOpen, Layers, ShieldAlert, Check } from 'lucide-react';
import { aiService } from '../../lib/graph/api';
import SourceCitation from '../explorer/SourceCitation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RepositoryAIAssistantProps {
  repoId: string;
  versionId: string;
  repoName?: string;
}

export default function RepositoryAIAssistant({ repoId, versionId, repoName }: RepositoryAIAssistantProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; sources?: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    {
      icon: Layers,
      label: 'Explain Architecture',
      prompt: 'Explain the high-level architecture, main subsystems, and overall modular structure of this repository.'
    },
    {
      icon: Code2,
      label: 'Locate Entry Points',
      prompt: 'What are the main entry points, runtime initialization files, and key API routes in this codebase?'
    },
    {
      icon: ShieldAlert,
      label: 'Risk & Hotspots Analysis',
      prompt: 'Identify the highest-risk files, central hubs (high fan-in), or heavily coupled components in this repository.'
    },
    {
      icon: BookOpen,
      label: 'Feature Addition Guide',
      prompt: 'If I want to add a new module or feature to this codebase, which directories and interfaces should I follow?'
    }
  ];

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: promptText }]);
    setQuestion('');
    setLoading(true);
    setError(null);

    try {
      const res = await aiService.askAIQuery(repoId, versionId, promptText);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          sources: res.sources
        }
      ]);
    } catch (err: any) {
      console.error('AI query failed:', err);
      setError(err?.message || 'Failed to generate AI response. Please ensure backend services are available.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(question);
  };

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col bg-white border border-border rounded-xl shadow-xs overflow-hidden font-sans">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border bg-surface/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>CodeGraph Intelligence Assistant</span>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-[10px] py-0 h-4">
                Hybrid Graph-RAG
              </Badge>
            </h3>
            <p className="text-[11px] text-muted">
              Deep semantic graph reasoning over AST symbols, cross-module imports, and runtime call flows.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-2xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">Ask anything about {repoName || 'this repository'}</h4>
              <p className="text-xs text-muted mt-1 max-w-md mx-auto">
                Powered by Neo4j AST knowledge graph and Qdrant semantic vectors. Select a quick starter or ask a custom question below.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {quickPrompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSendPrompt(item.prompt)}
                    className="p-3.5 rounded-xl border border-border/80 bg-surface/40 hover:bg-surface hover:border-primary/40 transition-all cursor-pointer shadow-2xs group flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0 text-muted group-hover:text-primary transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-foreground block group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <p className="text-[11px] text-muted line-clamp-2 mt-0.5">
                        {item.prompt}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground font-medium shadow-2xs'
                        : 'bg-surface/80 border border-border text-foreground shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="p-3 rounded-xl bg-surface/40 border border-border/70 space-y-2">
                      <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
                        Sources & Knowledge Provenance
                      </div>
                      <div className="space-y-1.5">
                        {msg.sources.map((src, idx) => (
                          <SourceCitation
                            key={idx}
                            sourceType={src.source_type}
                            filePath={src.file_path}
                            symbolName={src.symbol_name}
                            lineStart={src.line_start}
                            lineEnd={src.line_end}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-muted max-w-3xl mx-auto">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Traversing knowledge graph and formulating architectural synthesis...</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 max-w-3xl mx-auto">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="p-4 border-t border-border bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={loading}
            placeholder={`Ask a question about ${repoName || 'this repository'}...`}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
          />
          <Button
            type="submit"
            disabled={!question.trim() || loading}
            className="gap-2 text-xs font-semibold px-4 rounded-xl shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
