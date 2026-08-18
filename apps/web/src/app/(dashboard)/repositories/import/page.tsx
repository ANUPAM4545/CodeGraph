'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { ProgressTimeline, TimelineStep } from '../../../../components/ui/ProgressTimeline';
import { Github, ArrowLeft, Plus, AlertCircle, CheckCircle2, RefreshCw, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { repositoriesService, Repository } from '../../../../lib/api/repositories';
import { analysisService } from '../../../../lib/api/analysis';
import { RealtimeClient } from '../../../../lib/api/realtime';

const PIPELINE_STEPS: TimelineStep[] = [
  { id: 'connect', label: 'Connecting Repository', status: 'PENDING' },
  { id: 'download', label: 'Downloading Source Files', status: 'PENDING' },
  { id: 'parse', label: 'Tree-sitter AST Parsing', status: 'PENDING' },
  { id: 'graph', label: 'Building Knowledge Graph in Neo4j', status: 'PENDING' },
  { id: 'ai', label: 'Generating Code Embeddings', status: 'PENDING' }
];

function ImportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoParam = searchParams.get('repo');

  const [repoInput, setRepoInput] = useState(repoParam || '');
  const [branchInput, setBranchInput] = useState('main');
  const [isImporting, setIsImporting] = useState(false);
  const [steps, setSteps] = useState<TimelineStep[]>(PIPELINE_STEPS);
  const [error, setError] = useState<string | null>(null);
  const [githubRepos, setGithubRepos] = useState<{ id: number; full_name: string; name: string; visibility: string }[]>([]);
  const [isLoadingGh, setIsLoadingGh] = useState(false);

  // Load user's GitHub repositories list if available
  useEffect(() => {
    setIsLoadingGh(true);
    repositoriesService.listGithub()
      .then(repos => setGithubRepos(repos || []))
      .catch(() => {})
      .finally(() => setIsLoadingGh(false));
  }, []);

  const updateStep = (id: string, status: TimelineStep['status'], description?: string) => {
    setSteps(s => s.map(step => step.id === id ? { ...step, status, description } : step));
  };

  const sanitizeRepoName = (rawInput: string) => {
    let name = rawInput.trim();
    if (name.includes('github.com/')) {
      try {
        const urlObj = new URL(name.startsWith('http') ? name : `https://${name}`);
        name = urlObj.pathname.replace(/^\//, '').replace(/\/$/, '');
      } catch {
        const parts = name.split('github.com/');
        if (parts.length > 1) {
          name = parts[1].replace(/\/$/, '');
        }
      }
    }
    if (name.endsWith('.git')) {
      name = name.slice(0, -4);
    }
    return name;
  };

  const startPipeline = async (targetRepoFullName: string) => {
    const fullName = sanitizeRepoName(targetRepoFullName);
    if (!fullName || !fullName.includes('/')) {
      setError('Please provide a valid repository in the format owner/repository (e.g. facebook/react).');
      return;
    }

    setIsImporting(true);
    setError(null);
    setSteps(PIPELINE_STEPS);

    let wsClient: RealtimeClient | null = null;

    try {
      updateStep('connect', 'RUNNING');

      // 1. Import repository
      let repo: Repository;
      try {
        repo = await repositoriesService.import({ full_name: fullName });
      } catch (err: any) {
        if (err.message && err.message.includes('already imported')) {
          // Find existing repository and navigate
          const existingList = await repositoriesService.list();
          const match = existingList.find(r => 
            (r as any).full_name === fullName || 
            r.name === fullName.split('/')[1] || 
            r.name === fullName
          );
          if (match) {
            updateStep('connect', 'COMPLETED', 'Already synced');
            updateStep('download', 'COMPLETED');
            updateStep('parse', 'COMPLETED');
            updateStep('graph', 'COMPLETED');
            updateStep('ai', 'COMPLETED');
            setTimeout(() => router.push(`/repositories/${match.id}`), 1200);
            return;
          }
        }
        throw err;
      }

      updateStep('connect', 'COMPLETED', 'Repository linked');
      updateStep('download', 'RUNNING');

      // 2. Start Graph Analysis Job
      let job: any = null;
      try {
        job = await analysisService.start(repo.id);
      } catch (e: any) {
        console.warn('Analysis start warning:', e);
        setError(e?.message || 'Failed to start analysis job');
        setIsImporting(false);
        return;
      }

      const repoId = job?.repository_id || repo.id;
      const jobId = job?.id;

      // 3. Poll Real Job Status
      if (jobId) {
        const pollInterval = setInterval(async () => {
          try {
            const currentJob = await analysisService.getJob(jobId);
            if (!currentJob) return;

            if (currentJob.status === 'RUNNING') {
              updateStep('download', 'COMPLETED');
              updateStep('parse', 'RUNNING');
              if (currentJob.progress && currentJob.progress > 40) {
                updateStep('parse', 'COMPLETED');
                updateStep('graph', 'RUNNING');
              }
              if (currentJob.progress && currentJob.progress > 80) {
                updateStep('graph', 'COMPLETED');
                updateStep('ai', 'RUNNING');
              }
            } else if (currentJob.status === 'COMPLETED') {
              clearInterval(pollInterval);
              updateStep('download', 'COMPLETED');
              updateStep('parse', 'COMPLETED');
              updateStep('graph', 'COMPLETED');
              updateStep('ai', 'COMPLETED');
              setTimeout(() => router.push(`/repositories/${repoId}`), 800);
            } else if (currentJob.status === 'FAILED') {
              clearInterval(pollInterval);
              const errMsg = currentJob.error || 'Analysis job failed.';
              let userFriendlyMsg = errMsg;
              if (errMsg.includes('404')) {
                userFriendlyMsg = `Repository or branch not accessible on GitHub (${errMsg}). If this is a private repository, please configure a GITHUB_TOKEN in your environment.`;
              }
              setError(userFriendlyMsg);
              setSteps(s => s.map(step => step.status === 'RUNNING' ? { ...step, status: 'FAILED' } : step));
            }
          } catch (pollErr: any) {
            console.error('Job polling error:', pollErr);
          }
        }, 1500);
      } else {
        setTimeout(() => router.push(`/repositories/${repoId}`), 1200);
      }

    } catch (err: any) {
      console.error('Import pipeline failed:', err);
      setError(err?.message || 'Failed to import repository. Please check permissions and URL.');
      setIsImporting(false);
    }
  };

  // If initial URL had ?repo=, trigger immediately
  useEffect(() => {
    if (repoParam && !isImporting) {
      startPipeline(repoParam);
    }
  }, [repoParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startPipeline(repoInput);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/repositories">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>Repositories</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
            Connect Repository
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Import any public or private GitHub repository to build its AST knowledge graph and 3D architectural universe.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      {isImporting ? (
        <Card className="shadow-xs border-border/80">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Analyzing {sanitizeRepoName(repoInput)}
                </CardTitle>
                <p className="text-xs text-muted mt-0.5">
                  Parsing abstract syntax tree, extracting symbols, and writing Neo4j graph nodes...
                </p>
              </div>
              <Badge variant="secondary" className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 flex items-center gap-1.5 py-0.5">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Processing</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <ProgressTimeline steps={steps} />

            {error && (
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-red-700 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Pipeline Encountered an Issue</span>
                </div>
                <p className="font-mono">{error}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsImporting(false)} 
                  className="mt-2 text-xs"
                >
                  Edit Repository & Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">Repository Source</CardTitle>
              <p className="text-xs text-muted mt-0.5">Enter a GitHub repository name or paste the repository URL</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    GitHub Repository (owner/repo or URL)
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      autoFocus
                      required
                      value={repoInput}
                      onChange={e => setRepoInput(e.target.value)}
                      placeholder="e.g. facebook/react or https://github.com/ANUPAM4545/VillageAi-Nexus"
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Default Branch</label>
                    <div className="relative">
                      <GitBranch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        value={branchInput}
                        onChange={e => setBranchInput(e.target.value)}
                        placeholder="main"
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="submit"
                      disabled={!repoInput.trim()}
                      className="w-full h-9 gap-2 text-xs font-semibold shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Import & Run Analysis</span>
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Quick Select from User's GitHub Repositories */}
          {githubRepos.length > 0 && (
            <Card className="shadow-xs border-border/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground">Your GitHub Repositories</CardTitle>
                <p className="text-xs text-muted mt-0.5">Click any repository to automatically fill and import</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {githubRepos.slice(0, 8).map(repo => (
                  <div
                    key={repo.id}
                    onClick={() => {
                      setRepoInput(repo.full_name);
                      startPipeline(repo.full_name);
                    }}
                    className="p-3 rounded-xl border border-border/80 bg-surface/40 hover:bg-surface hover:border-border transition-colors cursor-pointer flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Github className="w-4 h-4 text-foreground flex-shrink-0" />
                      <span className="text-xs font-mono font-semibold text-foreground truncate">
                        {repo.full_name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4">
                      {repo.visibility || 'Public'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function ImportPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted text-xs">Loading import pipeline...</div>}>
      <ImportContent />
    </Suspense>
  );
}
