import { API_CONFIG, buildApiUrl } from '../config/api';
import { tokenStorage } from './tokenStorage';

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

// API client with automatic token refresh
class ApiClient {
  private refreshPromise: Promise<void> | null = null;

  async request(url: string, options: ApiOptions = {}): Promise<Response> {
    const { skipAuth = false, skipRefresh = false, ...requestOptions } = options;

    // Add authorization header if not skipping auth
    if (!skipAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, requestOptions);

    // If 401 and we have a refresh token, try to refresh and retry
    if (response.status === 401 && !skipAuth && !skipRefresh) {
      const tokenData = tokenStorage.get();
      if (tokenData?.refreshToken) {
        await this.refreshTokens();
        // Retry the original request with new token
        return this.request(url, { ...options, skipRefresh: true });
      }
    }

    return response;
  }

  private async refreshTokens(): Promise<void> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    const tokenData = tokenStorage.get();
    if (!tokenData?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: tokenData.refreshToken,
        refreshToken: tokenData.refreshToken
      }),
    });

    if (!response.ok) {
      // Refresh failed, clear tokens and redirect to login
      tokenStorage.clear();
      window.location.href = '/login';
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    tokenStorage.save({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: 3600 // Default to 1 hour
    });
  }

  // Convenience methods
  async get(url: string, options?: ApiOptions): Promise<Response> {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url: string, body?: any, options?: ApiOptions): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put(url: string, body?: any, options?: ApiOptions): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete(url: string, options?: ApiOptions): Promise<Response> {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
