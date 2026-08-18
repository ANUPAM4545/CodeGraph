import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import DashboardMetrics from '../src/components/dashboard/DashboardMetrics';
import RecentRepositories from '../src/components/dashboard/RecentRepositories';
import CodebaseHealth from '../src/components/dashboard/CodebaseHealth';
import { DashboardMetrics as MetricsType, RecentRepository, CodebaseHealthMetric } from '../src/types/dashboard';

describe('Dashboard Component Suite', () => {
  afterEach(() => {
    cleanup();
  });

  describe('DashboardMetrics', () => {
    it('renders real metric counts without mock trends', () => {
      const mockMetrics: MetricsType = {
        total_repositories: 3,
        active_repositories: 2,
        analyzing_repositories: 1,
        failed_repositories: 0,
        total_analyses: 5,
        completed_analyses: 4,
        running_analyses: 1,
        failed_analyses: 0,
        total_files_indexed: 540,
        total_code_entities: 2400
      };

      render(<DashboardMetrics metrics={mockMetrics} />);

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('2 active')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('4 completed')).toBeInTheDocument();
      expect(screen.getByText('540')).toBeInTheDocument();
      expect(screen.getByText('2,400')).toBeInTheDocument();
    });
  });

  describe('RecentRepositories', () => {
    it('renders real repository rows', () => {
      const mockRepos: RecentRepository[] = [
        {
          id: 'repo-1',
          name: 'Qr-code-identify',
          full_name: 'ANUPAM4545/Qr-code-identify',
          description: null,
          visibility: 'public',
          default_branch: 'main',
          url: 'https://github.com/ANUPAM4545/Qr-code-identify',
          created_at: '2026-08-14T17:01:16.826466Z',
          updated_at: '2026-08-14T17:01:16.826466Z',
          latest_version_id: 'v-1',
          latest_commit_sha: '6dfb75b9f3a61111f6afb85485b4f99259a34530',
          latest_status: 'completed',
          files_count: 292,
          entities_count: 1226
        }
      ];

      render(<RecentRepositories repositories={mockRepos} />);

      expect(screen.getByText('Qr-code-identify')).toBeInTheDocument();
      expect(screen.getByText('292 files')).toBeInTheDocument();
      expect(screen.getByText('1,226 entities')).toBeInTheDocument();
    });

    it('renders clean empty state when no repositories exist', () => {
      render(<RecentRepositories repositories={[]} />);
      expect(screen.getByText('No repositories connected')).toBeInTheDocument();
    });
  });

  describe('CodebaseHealth', () => {
    it('renders computed health metrics with status badges', () => {
      const mockHealth: CodebaseHealthMetric[] = [
        {
          metric_name: 'Indexed Files',
          value: '292 files',
          status: 'healthy',
          explanation: 'Successfully parsed and indexed in Neo4j.'
        },
        {
          metric_name: 'Analysis Success Rate',
          value: '100%',
          status: 'healthy',
          explanation: '1 of 1 analyses completed successfully.'
        }
      ];

      render(<CodebaseHealth healthMetrics={mockHealth} />);

      expect(screen.getByText('Indexed Files')).toBeInTheDocument();
      expect(screen.getByText('292 files')).toBeInTheDocument();
      expect(screen.getByText('Analysis Success Rate')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });
});
