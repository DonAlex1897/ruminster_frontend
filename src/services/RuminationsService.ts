import { RuminationResponse, PostRuminationDto } from '../types/rumination';
import { buildApiUrl, API_CONFIG } from '../config/api';

export async function getMyRuminations(token: string): Promise<RuminationResponse[]> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.MY_RUMINATIONS), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch my ruminations');
  }

  return await response.json();
}

export async function getAllRuminations(token: string): Promise<RuminationResponse[]> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.LIST), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch all ruminations');
  }

  return await response.json();
}

export async function getOthersRuminations(token: string): Promise<RuminationResponse[]> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.OTHERS_RUMINATIONS), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch others ruminations');
  }

  return await response.json();
}

export async function createRumination(token: string, rumination: PostRuminationDto): Promise<RuminationResponse> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.LIST), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rumination),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create rumination';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  return await response.json();
}
