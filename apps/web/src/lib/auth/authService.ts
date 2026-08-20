import { apiClient } from '../api/client';

export interface User {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

export interface Organization {
  id: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
}

class AuthService {
  async loginWithGithub(redirectUrl?: string) {
    if (typeof window !== 'undefined' && redirectUrl) {
      sessionStorage.setItem('auth_redirect', redirectUrl);
    }
    const res = await apiClient.get('/auth/login/github');
    if (res?.url) {
      window.location.href = res.url;
    }
  }

  async loginWithGoogle(redirectUrl?: string) {
    if (typeof window !== 'undefined' && redirectUrl) {
      sessionStorage.setItem('auth_redirect', redirectUrl);
    }
    const res = await apiClient.get('/auth/login/google');
    if (res?.url) {
      window.location.href = res.url;
    }
  }

  async handleCallback(code: string, state: string, provider: 'github' | 'google' = 'github'): Promise<void> {
    await apiClient.post(`/auth/callback/${provider}`, { code, state });
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

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore network errors during logout
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_redirect');
      window.location.href = '/login';
    }
  }
}

export const authService = new AuthService();
