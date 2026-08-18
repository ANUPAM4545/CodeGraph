import { apiClient } from './client';

export interface Subsystem {
  id: string;
  name: string;
  root_path: string;
  files: number;
  symbols: number;
  external_dependency_count: number;
  coupling_ratio: number;
  health: 'EXCELLENT' | 'MODERATE' | 'HIGH_COUPLING';
}

export interface DependentNode {
  id: string;
  name: string;
  type: string;
  file_path: string;
  rel_type: string;
}

export interface Hotspot {
  id: string;
  name: string;
  type: string;
  file: string;
  fan_in: number;
  top_callers: string[];
  dependents?: DependentNode[];
}

export interface Cycle {
  length: number;
  path: string[];
  summary: string;
}

export interface EntryPoint {
  id: string;
  name: string;
  type: string;
  file: string;
  reason: string;
}

export interface ModuleCoupling {
  source: string;
  target: string;
  strength: number;
}

export interface ArchitectureReport {
  repository_id: string;
  version_id: string;
  health_score: number;
  health_grade: string;
  subsystems_count: number;
  hotspots_count: number;
  cycles_count: number;
  entry_points_count: number;
  subsystems: Subsystem[];
  hotspots: Hotspot[];
  cycles: Cycle[];
  entry_points: EntryPoint[];
  couplings: ModuleCoupling[];
}

export const architectureService = {
  getReport: (repoId: string, versionId: string = 'latest'): Promise<ArchitectureReport> => 
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/architecture/report`),
  getHotspots: (repoId: string, versionId: string = 'latest'): Promise<Hotspot[]> =>
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/architecture/hotspots`),
  getCycles: (repoId: string, versionId: string = 'latest'): Promise<Cycle[]> =>
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/architecture/cycles`),
  analyzeChange: (repoId: string, versionId: string = 'latest', nodeId: string) =>
    apiClient.post(`/repositories/${repoId}/versions/${versionId}/architecture/analyze-change`, { node_id: nodeId }),
};
