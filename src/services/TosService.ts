import { buildApiUrl, API_CONFIG } from '../config/api';

export interface TosResponse {
  version: string;
  content: string;
  createdAt: string;
}

export interface AcceptTosRequest {
  version: string;
}

export async function getCurrentTos(): Promise<TosResponse> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.TERMS_OF_SERVICE.CURRENT), {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current Terms of Service');
  }

  return await response.json();
}

export async function acceptTos(request: AcceptTosRequest, token: string): Promise<{ message: string }> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.TERMS_OF_SERVICE.ACCEPT), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to accept Terms of Service');
  }

  return await response.json();
}
