'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '../../components/ui/Card';
import { ProgressTimeline, TimelineStep } from '../../components/ui/ProgressTimeline';
import { repositoriesService } from '../../lib/api/repositories';
import { analysisService } from '../../lib/api/analysis';
import { RealtimeClient } from '../../lib/api/realtime';

const INITIAL_STEPS: TimelineStep[] = [
  { id: 'connect', label: 'Repository Connected', status: 'PENDING' },
  { id: 'download', label: 'Downloading Source', status: 'PENDING' },
  { id: 'parse', label: 'Parsing Code', status: 'PENDING' },
  { id: 'graph', label: 'Building Knowledge Graph', status: 'PENDING' },
  { id: 'ai', label: 'Generating AI Embeddings', status: 'PENDING' }
];

function ImportPipelineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoFullName = searchParams.get('repo');
  const [steps, setSteps] = useState<TimelineStep[]>(INITIAL_STEPS);
  const [error, setError] = useState<string | null>(null);
  
  const updateStep = (id: string, status: TimelineStep['status'], description?: string) => {
    setSteps(s => s.map(step => step.id === id ? { ...step, status, description } : step));
  };

  useEffect(() => {
    if (!repoFullName) {
      router.push('/dashboard');
      return;
    }

    let wsClient: RealtimeClient | null = null;

    const runImport = async () => {
      try {
        updateStep('connect', 'RUNNING');
        // 1. Import repo
        const repo = await repositoriesService.import({ full_name: repoFullName } as any).catch(async err => {
          if (err.message && err.message.includes('Repository already imported')) {
            // Find the repository ID and redirect to it
            const repos = await repositoriesService.list();
            const existing = repos.find(r => (r as any).full_name === repoFullName || r.name === repoFullName.split('/')[1] || r.name === repoFullName);
            if (existing) {
              router.push(`/repositories/${existing.id}`);
              return existing;
            }
          }
          throw err;
        });
        
        updateStep('connect', 'COMPLETED', 'Webhook established');
        updateStep('download', 'RUNNING');

        // 2. Start Analysis
        const job = await analysisService.start(repo.id);
        
        // 3. Connect WS
        wsClient = new RealtimeClient(job.repository_id, job.repository_version_id);
        
        wsClient.on('PROCESSING', () => {
          updateStep('download', 'COMPLETED');
          updateStep('parse', 'RUNNING');
        });
        
        wsClient.on('GRAPH_ANALYSIS_STARTED', () => {
          updateStep('parse', 'COMPLETED');
          updateStep('graph', 'RUNNING');
        });
        
        wsClient.on('GRAPH_ANALYSIS_COMPLETED', () => {
          updateStep('graph', 'COMPLETED');
          updateStep('ai', 'RUNNING');
        });
        
        wsClient.on('SEMANTIC_INDEX_STARTED', () => {
          updateStep('ai', 'RUNNING');
        });

        wsClient.on('SEMANTIC_INDEX_COMPLETED', () => {
          updateStep('ai', 'COMPLETED');
        });
        
        wsClient.on('VERSION_READY', () => {
          setSteps(s => s.map(step => step.status === 'RUNNING' ? { ...step, status: 'COMPLETED' } : step));
          setTimeout(() => router.push(`/repositories/${job.repository_id}`), 2000);
        });
        
        wsClient.on('ANALYSIS_FAILED', (payload) => {
          setError(payload?.message || 'Analysis failed');
          setSteps(s => s.map(step => step.status === 'RUNNING' ? { ...step, status: 'FAILED' } : step));
        });

        wsClient.connect();

      } catch (err: any) {
        setError(err.message || 'Import failed');
        setSteps(s => s.map(step => step.status === 'RUNNING' || step.status === 'PENDING' ? { ...step, status: 'FAILED' } : step));
      }
    };

    runImport();

    return () => {
      if (wsClient) wsClient.disconnect();
    };
  }, [repoFullName, router]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-lg shadow-lg border-border">
        <CardContent className="p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">Analyzing Repository</h2>
            <p className="text-muted mt-2 text-sm">{repoFullName} is being ingested into CodeGraph.</p>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>
          
          <div className="px-4">
            <ProgressTimeline steps={steps} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ImportPipelinePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ImportPipelineContent />
    </React.Suspense>
  );
}
