import { apiClient } from './client';

export interface AnalysisJob {
  id: string;
  repository_id: string;
  repository_version_id: string;
  status: string;
  job_type: string;
  progress?: number;
  error?: string | null;
  created_at?: string;
}

export const analysisService = {
  start: (repositoryId: string): Promise<AnalysisJob> => 
    apiClient.post(`/repositories/${repositoryId}/analysis`),
  getJob: (jobId: string): Promise<AnalysisJob> => 
    apiClient.get(`/analysis/${jobId}`),
};
