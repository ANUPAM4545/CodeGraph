export interface EntityDistribution {
  entity_type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RelationshipDistribution {
  relationship_type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopPackage {
  package_name: string;
  import_count: number;
  percentage: number;
}

export interface CodeDenseFile {
  file_name: string;
  symbol_count: number;
  functions_count: number;
  classes_count: number;
}

export interface PipelineMetrics {
  total_repositories: number;
  total_files_indexed: number;
  total_entities: number;
  total_relationships: number;
  total_analyses: number;
  success_rate: number;
  last_analysis_duration_seconds: number | null;
  last_analyzed_at: string | null;
}

export interface DeepAnalytics {
  repository_id: string | null;
  repository_name: string | null;
  repository_full_name: string | null;
  version_id: string | null;
  commit_sha: string | null;
  branch: string | null;
  pipeline_metrics: PipelineMetrics;
  entity_distribution: EntityDistribution[];
  relationship_distribution: RelationshipDistribution[];
  top_packages: TopPackage[];
  code_dense_files: CodeDenseFile[];
}
