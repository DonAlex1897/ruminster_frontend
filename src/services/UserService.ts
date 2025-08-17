import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { UserResponse } from '../types/user';

export async function getUserById(userId: string): Promise<UserResponse> {
  const response = await apiClient.get(buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${userId}`));

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return await response.json();
}

export async function updateUserName(name: string): Promise<UserResponse> {
  const response = await apiClient.put(buildApiUrl(API_CONFIG.ENDPOINTS.USERS.NAME), {
    name
  });

  if (!response.ok) {
    throw new Error('Failed to update user name');
  }

  return await response.json();
}
