import { UserResponse } from '../types/user';
import { LoginResponse, PostLoginDto, PostSignUpDto } from '../types/auth';
import { PostForgotPasswordDto, PostResetPasswordDto, GetActivateDto, ApiResponse } from '../types/authExtended';
import { buildApiUrl, API_CONFIG } from '../config/api';

export async function validateToken(token: string): Promise<UserResponse | null> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ME), {
    method: 'GET',
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
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
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
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
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
