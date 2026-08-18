'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs } from '../../../../components/ui/Tabs';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Github, Settings, RefreshCw, Box, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ExplorerLayout from '../../../../components/explorer/ExplorerLayout';
import ArchitectureDashboard from '../../../../components/architecture/ArchitectureDashboard';
import RepositoryAIAssistant from '../../../../components/ai/RepositoryAIAssistant';
import RepositoryIntelligenceView from '../../../../components/intelligence/RepositoryIntelligenceView';
import { repositoriesService, Repository } from '../../../../lib/api/repositories';
import { analysisService } from '../../../../lib/api/analysis';
import Link from 'next/link';

export default function RepositoryDetailPage() {
  const params = useParams();
  const repoId = params.id as string;
  const router = useRouter();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // We read the version from the URL search params if present, otherwise default to latest
  const [versionId, setVersionId] = useState<string>('latest');
  const [activeTab, setActiveTab] = useState<string>('intelligence');
  const [overview, setOverview] = useState<any>(null);

  const loadRepoData = useCallback(async () => {
    try {
      const repoData = await repositoriesService.get(repoId);
      setRepo(repoData);
      
      const { graphService } = await import('../../../../lib/graph/api');
      const overviewData = await graphService.fetchGraphOverview(repoId, versionId).catch(() => null);
      setOverview(overviewData);
    } catch (err) {
      console.error('Failed to load repository data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [repoId, versionId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const version = urlParams.get('version');
      if (version) setVersionId(version);
      const tab = urlParams.get('tab');
      if (tab) setActiveTab(tab);
    }
    loadRepoData();
  }, [loadRepoData]);

  // Poll if status is analyzing
  useEffect(() => {
    if (repo?.status === 'analyzing' || repo?.status === 'pending') {
      const interval = setInterval(() => {
        loadRepoData();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [repo?.status, loadRepoData]);

  const handleSync = async () => {
    if (!repo) return;
    setIsSyncing(true);
    setSyncMessage('Starting analysis...');
    try {
      const job = await analysisService.start(repo.id);
      setSyncMessage('Analysis running in background...');
      
      // Poll job
      const pollTimer = setInterval(async () => {
        try {
          const currentJob = await analysisService.getJob(job.id);
          if (currentJob.status === 'COMPLETED') {
            clearInterval(pollTimer);
            setIsSyncing(false);
            setSyncMessage('Analysis completed successfully!');
            await loadRepoData();
            setTimeout(() => setSyncMessage(null), 3000);
          } else if (currentJob.status === 'FAILED') {
            clearInterval(pollTimer);
            setIsSyncing(false);
            setSyncMessage(null);
            await loadRepoData();
          }
        } catch {
          clearInterval(pollTimer);
          setIsSyncing(false);
        }
      }, 2000);
    } catch (err: any) {
      console.error('Sync failed:', err);
      setIsSyncing(false);
      setSyncMessage(err?.message || 'Sync failed.');
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };
  
  if (isLoading) return <div className="p-12 text-center text-muted text-xs">Loading repository...</div>;
  if (!repo) return <div className="p-12 text-center text-muted text-xs">Repository not found</div>;

  const isFailed = repo.status === 'failed';
  const isAnalyzing = repo.status === 'analyzing' || repo.status === 'pending' || isSyncing;
  
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="p-6 bg-white border border-border rounded-lg shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Repository Overview</h2>
            <p className="text-sm text-gray-500">
              {overview && overview.total_nodes > 0
                ? `Analysis complete: ${overview.total_nodes.toLocaleString()} nodes and ${overview.total_edges.toLocaleString()} relationships mapped in Neo4j.`
                : isFailed
                ? 'Analysis failed. Please click Sync to retry after verifying permissions.'
                : isAnalyzing
                ? 'Repository is currently being analyzed...'
                : 'Repository active and synced.'}
            </p>
          </div>
          {overview && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Directories</span>
                <span className="text-xl font-bold text-black">{overview.directories}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Files</span>
                <span className="text-xl font-bold text-black">{overview.files}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Classes</span>
                <span className="text-xl font-bold text-black">{overview.classes}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Functions</span>
                <span className="text-xl font-bold text-black">{overview.functions}</span>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'intelligence',
      label: 'Repository Intelligence',
      content: (
        <RepositoryIntelligenceView
          repositoryId={repoId}
          versionId={versionId}
          onSelectTab={(t) => setActiveTab(t)}
        />
      )
    },
    {
      id: 'explorer',
      label: 'Graph Explorer',
      content: (
        <div className="h-[calc(100vh-16rem)] border border-border rounded-lg overflow-hidden bg-white">
          <ExplorerLayout 
            repositoryId={repoId} 
            versionId={versionId} 
          />
        </div>
      )
    },
    {
      id: 'architecture',
      label: 'Architecture',
      content: (
        <ArchitectureDashboard 
          repositoryId={repoId} 
          versionId={versionId} 
          repoName={repo.name} 
        />
      )
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      content: (
        <RepositoryAIAssistant 
          repoId={repoId} 
          versionId={versionId} 
          repoName={repo.name} 
        />
      )
    },
    {
      id: 'history',
      label: 'History',
      content: (
        <div className="p-6 bg-white border border-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Commit & Analysis History</h2>
              <p className="text-xs text-muted">Version history and graph diffs across analyzed commits.</p>
            </div>
            <Link href={`/repositories/${repoId}/history`}>
              <Button size="sm" variant="outline" className="text-xs">Open Full History</Button>
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div className="p-6 bg-white border border-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Repository Configuration</h2>
              <p className="text-xs text-muted">Manage webhook triggers, branch tracking, and sync preferences.</p>
            </div>
            <Link href="/settings">
              <Button size="sm" variant="outline" className="text-xs">Workspace Settings</Button>
            </Link>
          </div>
        </div>
      )
    }
  ];

  const getStatusBadge = () => {
    if (isAnalyzing) {
      return (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 flex items-center gap-1">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Analyzing</span>
        </Badge>
      );
    }
    if (isFailed) {
      return (
        <Badge variant="secondary" className="bg-red-50 text-red-700 border border-red-200">
          Analysis Failed
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
        Active
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
      {/* Failure Banner */}
      {isFailed && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-900 mb-0.5">Repository Analysis Incomplete</p>
              <p className="text-amber-800 font-mono text-[11px] mb-1">
                {repo.error || 'Failed to download or parse repository from GitHub.'}
              </p>
              <p className="text-amber-700 text-[11px]">
                If this is a private GitHub repository, ensure your GITHUB_TOKEN is configured in .env. Otherwise check the repository URL and branch name.
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSync} 
            disabled={isSyncing}
            className="border-amber-300 bg-white hover:bg-amber-100/50 text-amber-900 font-semibold gap-1.5 ml-4 flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Retry Analysis</span>
          </Button>
        </div>
      )}

      {syncMessage && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{repo.name}</h1>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <a href={repo.url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Github className="w-4 h-4"/> GitHub
            </a>
            <span>Branch: {repo.default_branch}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </Button>
          <Link href={`/repositories/${repo.id}/universe`}>
            <Button variant="outline" size="sm" className="gap-2 shadow-xs">
              <Box className="w-4 h-4"/> 3D Universe
            </Button>
          </Link>
          <Button variant="ghost" size="sm"><Settings className="w-4 h-4 text-muted"/></Button>
        </div>
      </div>
      
      <div className="flex-1">
        <Tabs 
          tabs={tabs} 
          defaultTab="intelligence" 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
    </div>
  );
}
