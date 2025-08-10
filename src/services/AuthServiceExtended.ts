import { PostForgotPasswordDto, PostResetPasswordDto, ApiResponse } from '../types/auth';
import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { handleApiError } from '../utils/errorHandler';

export async function forgotPassword(credentials: PostForgotPasswordDto): Promise<ApiResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD), credentials, {
    skipAuth: true,
  });

  if (!response.ok) {
    await handleApiError(response, 'Failed to send password reset email');
  }

  const data: ApiResponse = await response.json();
  return data;
}

export async function resetPassword(credentials: PostResetPasswordDto): Promise<ApiResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD), credentials, {
    skipAuth: true,
  });

  if (!response.ok) {
    await handleApiError(response, 'Failed to reset password');
  }

  const data: ApiResponse = await response.json();
  return data;
}

export async function activateAccount(token: string): Promise<ApiResponse> {
  const response = await apiClient.get(buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH.ACTIVATE}?token=${encodeURIComponent(token)}`), {
    skipAuth: true,
  });

  if (!response.ok) {
    await handleApiError(response, 'Failed to activate account');
  }

  const data: ApiResponse = await response.json();
  return data;
}
