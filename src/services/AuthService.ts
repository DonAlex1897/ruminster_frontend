import { UserResponse } from '../types/user';
import { LoginResponse, PostLoginDto, PostRefreshTokenDto, PostSignUpDto, TokenResponse } from '../types/auth';
import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { handleApiError } from '../utils/errorHandler';

export async function validateToken(): Promise<UserResponse | null> {
  const response = await apiClient.get(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ME));

  if (!response.ok) {
    return null;
  }

  const data: UserResponse = await response.json();
  return data;
}

export async function login(credentials: PostLoginDto): Promise<LoginResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), credentials, {
    skipAuth: true,
  });

  if (!response.ok) {
    await handleApiError(response, 'Login failed');
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function signup(credentials: PostSignUpDto): Promise<LoginResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), credentials, {
    skipAuth: true,
  });

  if (!response.ok) {
    await handleApiError(response, 'Signup failed');
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function refreshToken(body: PostRefreshTokenDto): Promise<TokenResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN), body, {
    skipAuth: true, // Don't include auth header for refresh token requests
    skipRefresh: true, // Prevent infinite refresh loops
  });

  if (!response.ok) {
    await handleApiError(response, 'Token refresh failed');
  }

  const data: TokenResponse = await response.json();
  return data;
}
