import { apiClient } from './client';

export interface GitHubMetadata {
  name: string;
  full_name: string;
  description?: string | null;
  visibility: string;
  stars: number;
  forks: number;
  default_branch: string;
  license?: string | null;
  html_url?: string | null;
  last_commit_sha?: string | null;
  last_commit_date?: string | null;
}

export interface TechStackItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Infrastructure' | 'DevOps & Tooling' | string;
  version?: string | null;
  source_file: string;
  icon_slug?: string | null;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'WS' | string;
  path: string;
  handler: string;
  source_file: string;
  line_start?: number | null;
  line_end?: number | null;
  summary?: string | null;
}

export interface DbModel {
  name: string;
  table_name?: string | null;
  orm_framework: string;
  fields: string[];
  relationships: string[];
  source_file: string;
  line_start?: number | null;
}

export interface FeatureItem {
  name: string;
  description: string;
  confidence: 'HIGH' | 'MEDIUM' | string;
  evidence_files: string[];
  category?: string | null;
}

export interface SubsystemInfo {
  name: string;
  responsibility: string;
  files_count: number;
  symbols_count: number;
  coupling_ratio: number;
  status: string;
  sample_files: string[];
}

export interface RepositoryAsset {
  filename: string;
  repository_path: string;
  asset_type: 'image' | 'diagram' | 'screenshot' | 'badge' | string;
  preview_url?: string | null;
  source_reference: string;
}

export interface DevelopmentSetup {
  prerequisites: string[];
  install_commands: string[];
  dev_commands: string[];
  build_commands: string[];
  test_commands: string[];
  environment_variables: Array<{ key: string; description: string }>;
  docker_instructions?: string | null;
  sources: string[];
}

export interface HealthMetrics {
  total_files: number;
  total_functions: number;
  total_classes: number;
  total_ast_nodes: number;
  total_relationships: number;
  entry_points_count: number;
  circular_dependencies_count: number;
  health_score: number;
  health_grade: string;
}

export interface RepoIntelligence {
  repository_id: string;
  version_id: string;
  commit_sha: string;
  branch: string;
  generated_at: string;
  name: string;
  tagline: string;
  summary: string;
  purpose: string;
  problem_statement: string;
  solution_statement: string;
  summary_sources: string[];
  github_metadata?: GitHubMetadata | null;
  technology_stack: TechStackItem[];
  primary_language: string;
  features: FeatureItem[];
  subsystems: SubsystemInfo[];
  api_endpoints: ApiEndpoint[];
  database_models: DbModel[];
  dependencies: TechStackItem[];
  assets: RepositoryAsset[];
  development_setup?: DevelopmentSetup | null;
  health_metrics?: HealthMetrics | null;
  evidence_sources: string[];
}

export const intelligenceService = {
  getIntelligence: (repoId: string, versionId: string = 'latest'): Promise<RepoIntelligence> =>
    apiClient.get(`/repositories/${repoId}/versions/${versionId}/intelligence`),
};
