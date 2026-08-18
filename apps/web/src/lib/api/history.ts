import { apiClient } from './client';

export const historyService = {
  getHistory: (repoId: string) => 
    apiClient.get(`/history/${repoId}`),
  getDiff: (repoId: string, versionId: string) =>
    apiClient.get(`/history/${repoId}/versions/${versionId}/diff`),
  getSyncStatus: (repoId: string) =>
    apiClient.get(`/history/${repoId}/sync_status`),
};
