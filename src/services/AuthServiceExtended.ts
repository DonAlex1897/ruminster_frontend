import { PostForgotPasswordDto, PostResetPasswordDto, ApiResponse } from '../types/authExtended';
import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';

export async function forgotPassword(credentials: PostForgotPasswordDto): Promise<ApiResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD), {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to send password reset email';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const data: ApiResponse = await response.json();
  return data;
}

export async function resetPassword(credentials: PostResetPasswordDto): Promise<ApiResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD), {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to reset password';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const data: ApiResponse = await response.json();
  return data;
}

export async function activateAccount(token: string): Promise<ApiResponse> {
  const response = await apiClient.get(buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH.ACTIVATE}?token=${encodeURIComponent(token)}`));

  if (!response.ok) {
    let errorMessage = 'Failed to activate account';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const data: ApiResponse = await response.json();
  return data;
}
