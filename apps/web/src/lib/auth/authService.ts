import { apiClient } from '../api/client';

export interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
}

export interface Organization {
  id: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
}

class AuthService {
  async loginWithGithub() {
    const res = await apiClient.get('/auth/login/github');
    if (res.url) {
      window.location.href = res.url;
    }
  }

  async handleCallback(code: string, state: string): Promise<void> {
    // Exchange code for cookie session
    await apiClient.post('/auth/callback/github', { code, state });
  }

  async createOrganization(name: string): Promise<Organization> {
    return apiClient.post('/organizations', { name });
  }

  async getSession(): Promise<{ user: User | null, organization: Organization | null }> {
    if (typeof window === 'undefined') return { user: null, organization: null };
    try {
      const data = await apiClient.get('/auth/me');
      return { user: data.user, organization: data.organization };
    } catch (e) {
      return { user: null, organization: null };
    }
  }

  logout() {
    // Let's assume an endpoint that clears cookie
    apiClient.post('/auth/logout').catch(() => {});
    window.location.href = '/';
  }
}

export const authService = new AuthService();
