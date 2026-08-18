import { apiClient } from './client';
import { DashboardOverview } from '../../types/dashboard';
import { DeepAnalytics } from '../../types/analytics';

export const analyticsService = {
  getDashboardOverview: (): Promise<DashboardOverview> => 
    apiClient.get('/analytics/dashboard'),

  getDeepAnalytics: (repositoryId?: string): Promise<DeepAnalytics> =>
    apiClient.get(`/analytics/deep${repositoryId ? `?repository_id=${encodeURIComponent(repositoryId)}` : ''}`),
};
