import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import PipelineMetricCards from '../src/components/analytics/PipelineMetricCards';
import EntityDistributionChart from '../src/components/analytics/EntityDistributionChart';
import RelationshipDistributionChart from '../src/components/analytics/RelationshipDistributionChart';
import TopPackagesList from '../src/components/analytics/TopPackagesList';
import CodeDensityTable from '../src/components/analytics/CodeDensityTable';
import { PipelineMetrics, EntityDistribution, RelationshipDistribution, TopPackage, CodeDenseFile } from '../src/types/analytics';

describe('Analytics Component Suite', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders pipeline metrics with real values', () => {
    const mockMetrics: PipelineMetrics = {
      total_repositories: 1,
      total_files_indexed: 292,
      total_entities: 1226,
      total_relationships: 2108,
      total_analyses: 1,
      success_rate: 100.0,
      last_analysis_duration_seconds: 9.9,
      last_analyzed_at: '2026-08-15T14:13:48.664593Z'
    };

    render(<PipelineMetricCards metrics={mockMetrics} />);

    expect(screen.getByText('1,226')).toBeInTheDocument();
    expect(screen.getByText('2,108')).toBeInTheDocument();
    expect(screen.getByText('292')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders entity and relationship distributions', () => {
    const mockEntities: EntityDistribution[] = [
      { entity_type: 'Function', count: 437, percentage: 35.6, color: '#3b82f6' },
      { entity_type: 'File', count: 292, percentage: 23.8, color: '#10b981' }
    ];

    render(<EntityDistributionChart distribution={mockEntities} />);

    expect(screen.getByText('Function')).toBeInTheDocument();
    expect(screen.getByText('437')).toBeInTheDocument();
    expect(screen.getByText('35.6%')).toBeInTheDocument();
  });

  it('renders top external packages', () => {
    const mockPackages: TopPackage[] = [
      { package_name: 'lucide-react', import_count: 85, percentage: 12.5 },
      { package_name: 'react', import_count: 75, percentage: 11.0 }
    ];

    render(<TopPackagesList packages={mockPackages} />);

    expect(screen.getByText('lucide-react')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText(/85/)).toBeInTheDocument();
  });

  it('renders code-dense files table', () => {
    const mockFiles: CodeDenseFile[] = [
      { file_name: 'page.tsx', symbol_count: 125, functions_count: 124, classes_count: 1 }
    ];

    render(<CodeDensityTable files={mockFiles} repositoryId="test-repo" />);

    expect(screen.getByText('page.tsx')).toBeInTheDocument();
    expect(screen.getByText('124')).toBeInTheDocument();
    expect(screen.getByText('125 symbols')).toBeInTheDocument();
  });
});
