import { UserResponse } from '../types/user';
import { LoginResponse, PostLoginDto, PostRefreshTokenDto, PostSignUpDto, TokenResponse } from '../types/auth';
import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';

export async function validateToken(token: string): Promise<UserResponse | null> {
  const response = await apiClient.get(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ME), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // Token is invalid or expired
    return null;
  }

  // Returns user info if valid
  const data: UserResponse = await response.json();
  return data;
}

export async function login(credentials: PostLoginDto): Promise<LoginResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), credentials, {
    skipAuth: true,
  });

  if (!response.ok) {
    let errorMessage = 'Login failed';
    
    // Try to parse JSON error response
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      // If response is not JSON (like HTML 404 page), use status text
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function signup(credentials: PostSignUpDto): Promise<LoginResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), credentials, {
    skipAuth: true,
  });

  if (!response.ok) {
    let errorMessage = 'Signup failed';
    
    // Try to parse JSON error response
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      // If response is not JSON (like HTML 404 page), use status text
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function refreshToken(body: PostRefreshTokenDto): Promise<TokenResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN), {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = 'Token refresh failed';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const data: TokenResponse = await response.json();
  return data;
}
