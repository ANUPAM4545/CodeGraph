const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithConfig(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Automatically send HttpOnly cookies
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      if (response.status === 401) {
        // Only force redirect on core session verification failure
        if (typeof window !== 'undefined' && endpoint === '/auth/me' && !window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.detail || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Network error:', error);
    throw new Error('Network error occurred. Please check your connection.');
  }
}

export const apiClient = {
  get: (endpoint: string, options?: RequestInit) => fetchWithConfig(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: RequestInit) => fetchWithConfig(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data?: any, options?: RequestInit) => fetchWithConfig(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string, options?: RequestInit) => fetchWithConfig(endpoint, { ...options, method: 'DELETE' }),
};
