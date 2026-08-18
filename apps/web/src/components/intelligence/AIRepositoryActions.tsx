'use client';

import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  ArrowRight 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface AIRepositoryActionsProps {
  onTriggerAI?: (prompt: string) => void;
}

export default function AIRepositoryActions({ onTriggerAI }: AIRepositoryActionsProps) {
  const actions = [
    {
      title: 'Explain Architecture & Data Flow',
      description: 'Understand how frontend views call backend controllers and persist database records.',
      prompt: 'Explain the high-level architecture, module boundaries, and end-to-end data flow of this repository.'
    },
    {
      title: 'Generate Developer Onboarding Guide',
      description: 'Get a step-by-step onboarding walkthrough covering codebase navigation and local setup.',
      prompt: 'Generate a comprehensive developer onboarding guide for a new engineer joining this project.'
    },
    {
      title: 'Audit API & Security Boundaries',
      description: 'Review discovered endpoints and identify security layers or auth middleware.',
      prompt: 'Analyze the API routes and authentication architecture in this repository. What security controls are in place?'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-white to-purple-50/30 border-primary/20 shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AI-Powered Repository Insights</span>
        </CardTitle>
        <p className="text-xs text-muted">
          Query deep AST reasoning models and hybrid graph embeddings about this codebase.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {actions.map((act, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-border/80 hover:border-primary/50 transition-all flex flex-col justify-between space-y-3 shadow-2xs group cursor-pointer"
              onClick={() => onTriggerAI && onTriggerAI(act.prompt)}
            >
              <div className="space-y-1">
                <span className="font-bold text-foreground text-xs block group-hover:text-primary transition-colors">
                  {act.title}
                </span>
                <p className="text-[11px] text-muted leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                <span>Run AI Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
