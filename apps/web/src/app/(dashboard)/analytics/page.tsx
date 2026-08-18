'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AnalyticsHeader from '../../../components/analytics/AnalyticsHeader';
import PipelineMetricCards from '../../../components/analytics/PipelineMetricCards';
import EntityDistributionChart from '../../../components/analytics/EntityDistributionChart';
import RelationshipDistributionChart from '../../../components/analytics/RelationshipDistributionChart';
import TopPackagesList from '../../../components/analytics/TopPackagesList';
import CodeDensityTable from '../../../components/analytics/CodeDensityTable';
import { analyticsService } from '../../../lib/api/analytics';
import { repositoriesService, Repository } from '../../../lib/api/repositories';
import { DeepAnalytics } from '../../../types/analytics';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<DeepAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch repositories
  useEffect(() => {
    repositoriesService.list()
      .then(repos => {
        setRepositories(repos);
        if (repos.length > 0 && !selectedRepoId) {
          setSelectedRepoId(repos[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // 2. Fetch Deep Real-Time Analytics
  const loadAnalytics = useCallback(async (isManual = false) => {
    try {
      if (isManual) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const data = await analyticsService.getDeepAnalytics(selectedRepoId || undefined);
      setAnalytics(data);
    } catch (err: any) {
      console.error('Failed to load deep analytics:', err);
      setError(err?.message || 'Unable to load real-time analytics. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedRepoId]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleRefresh = () => {
    loadAnalytics(true);
  };

  if (error && !analytics) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center select-none">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Analytics Unavailable</h2>
          <p className="text-xs text-muted leading-relaxed">{error}</p>
          <Button onClick={() => loadAnalytics()} className="gap-1.5 text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && repositories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center select-none">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto text-muted">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No Repositories Connected</h2>
          <p className="text-xs text-muted leading-relaxed">
            Connect a GitHub repository and run graph analysis to generate real-time architecture analytics.
          </p>
          <Link href="/repositories/import">
            <Button size="md" className="gap-1.5 text-xs font-semibold">
              <Plus className="w-4 h-4" />
              <span>Connect Repository</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* 1. Header with Repository Selector & Live Status */}
      <AnalyticsHeader
        repositories={repositories}
        selectedRepoId={selectedRepoId}
        onSelectRepo={setSelectedRepoId}
        commitSha={analytics?.commit_sha || null}
        branch={analytics?.branch || null}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* 2. Pipeline Performance & Real Metrics Cards */}
      <PipelineMetricCards
        metrics={analytics?.pipeline_metrics}
        isLoading={isLoading}
      />

      {/* 3. Entity & Relationship Distribution Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EntityDistributionChart
          distribution={analytics?.entity_distribution || []}
          isLoading={isLoading}
        />

        <RelationshipDistributionChart
          distribution={analytics?.relationship_distribution || []}
          isLoading={isLoading}
        />
      </div>

      {/* 4. Top Dependencies & Code Density Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopPackagesList
            packages={analytics?.top_packages || []}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-2">
          <CodeDensityTable
            files={analytics?.code_dense_files || []}
            repositoryId={selectedRepoId}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
