export interface DashboardMetrics {
  total_repositories: number;
  active_repositories: number;
  analyzing_repositories: number;
  failed_repositories: number;
  total_analyses: number;
  completed_analyses: number;
  running_analyses: number;
  failed_analyses: number;
  total_files_indexed: number;
  total_code_entities: number;
}

export interface RecentRepository {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  visibility: string;
  default_branch: string;
  url: string;
  created_at: string | null;
  updated_at: string | null;
  latest_version_id: string | null;
  latest_commit_sha: string | null;
  latest_status: string | null;
  files_count: number | null;
  entities_count: number | null;
}

export interface AnalysisActivity {
  id: string;
  repository_id: string;
  repository_name: string;
  repository_version_id: string;
  commit_sha: string;
  branch: string;
  job_type: string;
  status: 'PENDING' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | string;
  progress: number;
  error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface CodebaseHealthMetric {
  metric_name: string;
  value: string;
  status: 'healthy' | 'warning' | 'error' | 'unavailable';
  explanation?: string | null;
}

export interface DashboardOverview {
  organization: {
    id: string;
    name: string;
    role: string;
    plan: string;
  } | null;
  metrics: DashboardMetrics;
  recent_repositories: RecentRepository[];
  analysis_activity: AnalysisActivity[];
  health: CodebaseHealthMetric[];
}
