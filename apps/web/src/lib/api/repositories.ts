import { apiClient } from './client';

export interface Repository {
  id: string;
  owner_id: string;
  name: string;
  full_name?: string;
  github_id: number | string;
  default_branch: string;
  is_private: boolean;
  visibility?: string;
  description?: string | null;
  status: 'pending' | 'analyzing' | 'completed' | 'failed' | string;
  latest_version_id?: string | null;
  latest_commit_sha?: string | null;
  error?: string | null;
  created_at: string;
  updated_at: string;
  url?: string;
}

export const repositoriesService = {
  list: (): Promise<Repository[]> => apiClient.get('/repositories'),
  get: (id: string): Promise<Repository> => apiClient.get(`/repositories/${id}`),
  listGithub: (): Promise<{ id: number; full_name: string; name: string; visibility: string }[]> => apiClient.get('/repositories/github'),
  import: (data: { full_name: string } | { owner: string; repo: string; branch?: string }): Promise<Repository> => apiClient.post('/repositories/import', data),
};
