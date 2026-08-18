'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { intelligenceService, RepoIntelligence } from '../../lib/api/intelligence';
import RepositoryHero from './RepositoryHero';
import RepositorySummary from './RepositorySummary';
import TechnologyStack from './TechnologyStack';
import FeatureExplorer from './FeatureExplorer';
import ArchitectureSummary from './ArchitectureSummary';
import APIExplorer from './APIExplorer';
import DatabaseExplorer from './DatabaseExplorer';
import DevelopmentGuide from './DevelopmentGuide';
import ScreenshotGallery from './ScreenshotGallery';
import RepositoryHealth from './RepositoryHealth';
import AIRepositoryActions from './AIRepositoryActions';
import { Button } from '../ui/Button';

interface RepositoryIntelligenceViewProps {
  repositoryId: string;
  versionId: string;
  onSelectTab?: (tabId: string) => void;
}

export default function RepositoryIntelligenceView({
  repositoryId,
  versionId,
  onSelectTab
}: RepositoryIntelligenceViewProps) {
  const [data, setData] = useState<RepoIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntelligence = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.getIntelligence(repositoryId, versionId);
      setData(res);
    } catch (err: any) {
      console.error('Failed to load repository intelligence:', err);
      setError(err?.message || 'Unable to generate repository intelligence.');
    } finally {
      setLoading(false);
    }
  }, [repositoryId, versionId]);

  useEffect(() => {
    fetchIntelligence();
  }, [fetchIntelligence]);

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center space-y-3 text-muted">
        <RefreshCw className="w-7 h-7 animate-spin text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Synthesizing CodeGraph Repository Intelligence...
        </span>
        <span className="text-xs text-muted max-w-md text-center">
          Extracting AST endpoints, database schemas, framework dependencies, and documentation evidence.
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 border border-red-200 rounded-2xl bg-red-50/50 text-red-800 space-y-3 text-center">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
        <p className="font-bold text-base">Unable to generate repository intelligence</p>
        <p className="text-xs font-mono text-red-600 max-w-lg mx-auto">{error || 'Make sure the repository has been analyzed.'}</p>
        <Button size="sm" variant="outline" onClick={fetchIntelligence} className="mt-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Retry Intelligence Extraction
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* 1. Hero & Version Bar */}
      <RepositoryHero data={data} />

      {/* 2. AI Quick Actions */}
      <AIRepositoryActions 
        onTriggerAI={(prompt) => {
          if (onSelectTab) onSelectTab('ai');
        }} 
      />

      {/* 3. Executive Summary, Problem & Solution */}
      <RepositorySummary data={data} />

      {/* 4. Categorized Tech Stack */}
      <TechnologyStack items={data.technology_stack} />

      {/* 5. Verified Core Features Matrix */}
      <FeatureExplorer features={data.features} />

      {/* 6. Discovered API Endpoints */}
      <APIExplorer endpoints={data.api_endpoints} />

      {/* 7. Database Models & Schemas */}
      <DatabaseExplorer models={data.database_models} />

      {/* 8. Subsystems & Module Boundaries */}
      <ArchitectureSummary subsystems={data.subsystems} />

      {/* 9. Visual Media & Screenshots (if present) */}
      {data.assets && data.assets.length > 0 && (
        <ScreenshotGallery assets={data.assets} />
      )}

      {/* 10. Development & Quick Start Guide */}
      <DevelopmentGuide setup={data.development_setup} />

      {/* 11. Code Telemetry & Evidence Sources */}
      <RepositoryHealth 
        health={data.health_metrics} 
        evidenceSources={data.evidence_sources} 
      />
    </div>
  );
}
