'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import DashboardMetrics from '../../../components/dashboard/DashboardMetrics';
import RecentRepositories from '../../../components/dashboard/RecentRepositories';
import AnalysisActivity from '../../../components/dashboard/AnalysisActivity';
import CodebaseHealth from '../../../components/dashboard/CodebaseHealth';
import QuickActions from '../../../components/dashboard/QuickActions';
import { analyticsService } from '../../../lib/api/analytics';
import { DashboardOverview } from '../../../types/dashboard';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const overview = await analyticsService.getDashboardOverview();
      setData(overview);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to load dashboard overview:', err);
      setError(err?.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (error && !data) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center select-none">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Unable to load Dashboard</h2>
          <p className="text-xs text-muted leading-relaxed">{error}</p>
          <Button onClick={() => fetchDashboardData()} className="gap-1.5 text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    );
  }

  const primaryRepo = data?.recent_repositories && data.recent_repositories.length > 0 
    ? data.recent_repositories[0] 
    : undefined;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* 1. Header with Org Plan & Refresh */}
      <DashboardHeader
        orgName={data?.organization?.name}
        plan={data?.organization?.plan || 'Enterprise'}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />

      {/* 2. Top Real Metrics Cards */}
      <DashboardMetrics
        metrics={data?.metrics}
        isLoading={isLoading}
      />

      {/* 3. Repositories & Analysis Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentRepositories
            repositories={data?.recent_repositories || []}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-1">
          <AnalysisActivity
            activities={data?.analysis_activity || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 4. Codebase Knowledge Health & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CodebaseHealth
            healthMetrics={data?.health || []}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-1">
          <QuickActions
            primaryRepo={primaryRepo}
          />
        </div>
      </div>
    </div>
  );
}
