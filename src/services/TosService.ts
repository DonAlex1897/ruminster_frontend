import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { TosResponse, AcceptTosRequest } from '../types/tos';

export async function getCurrentTos(): Promise<TosResponse> {
  const response = await apiClient.get(buildApiUrl(API_CONFIG.ENDPOINTS.TERMS_OF_SERVICE.CURRENT));

  if (!response.ok) {
    throw new Error('Failed to fetch current Terms of Service');
  }

  return await response.json();
}

export async function acceptTos(request: AcceptTosRequest): Promise<{ message: string }> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.TERMS_OF_SERVICE.ACCEPT), request);

  if (!response.ok) {
    throw new Error('Failed to accept Terms of Service');
  }

  return await response.json();
}
