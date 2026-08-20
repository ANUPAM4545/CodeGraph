'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Github, 
  ArrowRight, 
  FileCode, 
  Code2, 
  Box, 
  FolderGit2, 
  Network, 
  Layers, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../../../lib/auth/authService';

// Google OAuth Icon SVG Component
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Visual Node Hierarchy Definition for Right-Side Panel
const VISUAL_NODES = [
  { id: '1', name: 'marketplace-engine', type: 'REPOSITORY', file: 'Root Repository', calls: '1,452 AST Nodes', risk: 'LOW', x: '50%', y: '16%' },
  { id: '2', name: 'src/services/', type: 'MODULE', file: 'Core Subsystem', calls: '14 Modules', risk: 'LOW', x: '25%', y: '40%' },
  { id: '3', name: 'dispute.ts', type: 'FILE', file: 'src/services/dispute.ts', calls: '184 LOC', risk: 'MEDIUM', x: '75%', y: '40%' },
  { id: '4', name: 'DisputeOrchestrator', type: 'CLASS', file: 'src/services/dispute.ts', calls: '14 Callers', risk: 'HIGH', x: '50%', y: '64%' },
  { id: '5', name: 'executeResolution()', type: 'FUNCTION', file: 'src/services/dispute.ts', calls: 'Public Method', risk: 'MEDIUM', x: '22%', y: '84%' },
  { id: '6', name: 'LedgerClient', type: 'DEPENDENCY', file: 'src/db/ledger.ts', calls: 'PostgreSQL ORM', risk: 'LOW', x: '78%', y: '84%' },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const errorParam = searchParams.get('error');

  const [loadingProvider, setLoadingProvider] = useState<'github' | 'google' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const [activeVisualIdx, setActiveVisualIdx] = useState(3);

  useEffect(() => {
    if (errorParam === 'auth_failed') {
      setErrorMessage('Authentication failed. Please try again.');
    } else if (errorParam === 'cancelled') {
      setErrorMessage('Authentication was cancelled. You can try again.');
    }
  }, [errorParam]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(() => {
      setActiveVisualIdx((prev) => (prev + 1) % VISUAL_NODES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  const handleGithubLogin = async () => {
    setErrorMessage(null);
    setLoadingProvider('github');
    try {
      await authService.loginWithGithub(redirectParam || undefined);
    } catch (err) {
      setLoadingProvider(null);
      setErrorMessage('Failed to initiate GitHub authentication. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoadingProvider('google');
    try {
      await authService.loginWithGoogle(redirectParam || undefined);
    } catch (err) {
      setLoadingProvider(null);
      setErrorMessage('Failed to initiate Google authentication. Please try again.');
    }
  };

  const activeNode = VISUAL_NODES[activeVisualIdx];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-black selection:text-white font-mono text-xs">
      
      {/* Fine Dotted Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Main Two-Column Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen relative z-10">
        
        {/* LEFT COLUMN: Authentication Form (~42% desktop width) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-white border-b lg:border-b-0 lg:border-r border-border">
          
          {/* Top Brand Branding */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12a7 7 0 1 1-7-7" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <path d="M12 12l5-5" />
                  <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-foreground text-lg tracking-tight">
                CodeGraph
              </span>
            </Link>

            <div className="text-[11px] text-muted font-sans font-medium">
              Code intelligence for modern engineering teams.
            </div>
          </div>

          {/* Center Form Body */}
          <div className="my-auto py-8 space-y-8 max-w-md w-full mx-auto">
            
            {/* Title & Subtitle */}
            <div className="space-y-2 text-left">
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                Welcome to CodeGraph
              </h1>
              <p className="text-sm font-sans text-muted leading-relaxed">
                Connect your GitHub repositories and turn complex codebases into living architectural intelligence.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl border border-red-200 bg-red-50/80 text-red-900 text-xs font-sans flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                </div>
                <button 
                  onClick={() => setErrorMessage(null)} 
                  className="text-red-500 hover:text-red-800 text-[10px] font-bold underline"
                >
                  Dismiss
                </button>
              </motion.div>
            )}

            {/* Equal-Weight Real OAuth Action Buttons */}
            <div className="space-y-3 pt-2">
              
              {/* Button 1: Continue with GitHub */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={loadingProvider !== null}
                className={`w-full h-12 px-6 rounded-full border border-neutral-900 bg-black text-white text-xs font-bold font-mono flex items-center justify-center gap-3 transition-all shadow-md hover:bg-neutral-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group`}
              >
                {loadingProvider === 'github' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting to GitHub...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
                    <span>Continue with GitHub</span>
                  </>
                )}
              </button>

              {/* Button 2: Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loadingProvider !== null}
                className={`w-full h-12 px-6 rounded-full border border-border bg-white text-foreground text-xs font-bold font-mono flex items-center justify-center gap-3 transition-all shadow-xs hover:border-black hover:bg-neutral-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group`}
              >
                {loadingProvider === 'google' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

            </div>

            {/* Trust & Legal Disclaimer */}
            <div className="pt-4 border-t border-border space-y-2 text-center text-[11px] text-muted font-sans">
              <p>
                By continuing, you agree to CodeGraph&apos;s{' '}
                <a href="#" className="underline hover:text-foreground">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-600 font-mono pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SSL Encrypted OAuth 2.0 + PKCE</span>
              </div>
            </div>

          </div>

          {/* Bottom Footer Info */}
          <div className="text-[11px] text-muted font-mono flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} CodeGraph</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">v1.4.2 Production</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Living CodeGraph AST Architecture Panel (~58% desktop width) */}
        <div className="hidden lg:flex lg:col-span-7 bg-neutral-50/50 p-8 xl:p-12 flex-col justify-between relative overflow-hidden select-none border-l border-border">
          
          {/* Subtle Corner Badge */}
          <div className="flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white text-[11px] font-mono font-bold text-neutral-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>LIVE REPOSITORY TOPOLOGY</span>
            </div>

            <span className="text-[11px] text-muted font-mono">
              AST Dependency Graph
            </span>
          </div>

          {/* Interactive Miniature CodeGraph Graph Visual Viewport */}
          <div className="relative w-full max-w-xl mx-auto h-[440px] my-auto flex items-center justify-center">
            
            {/* SVG Connecting Relationship Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="16%" x2="25%" y2="40%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="50%" y1="16%" x2="75%" y2="40%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="25%" y1="40%" x2="50%" y2="64%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="75%" y1="40%" x2="50%" y2="64%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="50%" y1="64%" x2="22%" y2="84%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="50%" y1="64%" x2="78%" y2="84%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="3 3" />
            </svg>

            {/* Render Nodes */}
            {VISUAL_NODES.map((node, idx) => {
              const isSelected = activeVisualIdx === idx;

              return (
                <motion.div
                  key={node.id}
                  onClick={() => setActiveVisualIdx(idx)}
                  style={{ left: node.x, top: node.y }}
                  animate={shouldReduceMotion ? {} : { scale: isSelected ? 1.08 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-black bg-white ring-4 ring-black/5 shadow-xl z-20'
                      : 'border-border bg-white/90 hover:border-neutral-400 shadow-2xs z-10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    {node.type === 'REPOSITORY' && <FolderGit2 className="w-3.5 h-3.5 text-neutral-800" />}
                    {node.type === 'MODULE' && <Layers className="w-3.5 h-3.5 text-blue-600" />}
                    {node.type === 'FILE' && <FileCode className="w-3.5 h-3.5 text-purple-600" />}
                    {node.type === 'CLASS' && <Box className="w-3.5 h-3.5 text-emerald-600" />}
                    {node.type === 'FUNCTION' && <Code2 className="w-3.5 h-3.5 text-amber-600" />}
                    {node.type === 'DEPENDENCY' && <Network className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>{node.name}</span>
                  </div>

                  <div className="text-[10px] text-muted mt-0.5">
                    {node.type}
                  </div>
                </motion.div>
              );
            })}

            {/* Active Node Telemetry Inspector Card */}
            <motion.div 
              key={activeNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-[-10px] right-0 p-3.5 rounded-2xl border border-border bg-white shadow-lg font-mono text-[10px] space-y-1.5 w-60 z-30"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-foreground">{activeNode.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  activeNode.risk === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  {activeNode.risk} RISK
                </span>
              </div>
              <div className="text-muted truncate">{activeNode.file}</div>
              <div className="pt-1 border-t border-border flex items-center justify-between text-muted">
                <span>Metrics:</span>
                <strong className="text-foreground">{activeNode.calls}</strong>
              </div>
            </motion.div>

          </div>

          {/* Bottom Descriptive Caption */}
          <div className="z-10 text-center space-y-1 max-w-md mx-auto">
            <div className="font-bold text-foreground text-xs font-mono">
              Understand your codebase before you change it.
            </div>
            <p className="text-[11px] text-muted font-sans">
              CodeGraph transforms repositories into living architectural knowledge graphs.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-black" />
          <span>Loading CodeGraph Auth...</span>
        </div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
