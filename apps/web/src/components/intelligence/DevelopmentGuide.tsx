'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Key, 
  Play, 
  Wrench, 
  FileCode2, 
  ShieldCheck 
} from 'lucide-react';
import { DevelopmentSetup } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface DevelopmentGuideProps {
  setup?: DevelopmentSetup | null;
}

export default function DevelopmentGuide({ setup }: DevelopmentGuideProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!setup) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <Card className="bg-white border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span>Development & Quick Start Guide</span>
            </CardTitle>
            <p className="text-xs text-muted mt-0.5">
              Verified setup commands, prerequisites, and environment configurations.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted font-mono">
            <span>Sources:</span>
            {setup.sources.map((s, idx) => (
              <Badge key={idx} variant="outline" className="text-[10px] py-0 h-4">{s}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        {/* Command Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Installation */}
          {setup.install_commands && setup.install_commands.length > 0 && (
            <div className="p-3.5 rounded-xl bg-surface/50 border border-border/80 space-y-2">
              <span className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Installation</span>
              </span>
              <div className="space-y-1.5">
                {setup.install_commands.map((cmd, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-lg bg-gray-900 text-gray-100 font-mono text-xs flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <span className="truncate">$ {cmd}</span>
                    <button 
                      onClick={() => copyToClipboard(cmd)}
                      className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedCmd === cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Development Server */}
          {setup.dev_commands && setup.dev_commands.length > 0 && (
            <div className="p-3.5 rounded-xl bg-surface/50 border border-border/80 space-y-2">
              <span className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Development Server</span>
              </span>
              <div className="space-y-1.5">
                {setup.dev_commands.map((cmd, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-lg bg-gray-900 text-gray-100 font-mono text-xs flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <span className="truncate">$ {cmd}</span>
                    <button 
                      onClick={() => copyToClipboard(cmd)}
                      className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedCmd === cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Environment Variables */}
        {setup.environment_variables && setup.environment_variables.length > 0 && (
          <div className="pt-2 border-t border-border/70 space-y-2">
            <span className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Required Environment Variables (.env)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {setup.environment_variables.map((env, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-lg bg-surface border border-border/80 flex items-center justify-between text-xs font-mono"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-primary block truncate">{env.key}</span>
                    <span className="text-[10px] text-muted block truncate">{env.description}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(env.key)}
                    className="p-1 text-muted hover:text-foreground"
                    title="Copy key"
                  >
                    {copiedCmd === env.key ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
