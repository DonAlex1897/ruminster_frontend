import { RuminationResponse, PostRuminationDto, MyRuminationsQueryParams } from '../types/rumination';
import { buildApiUrl, API_CONFIG } from '../config/api';

export async function getMyRuminations(token: string, queryParams?: MyRuminationsQueryParams): Promise<RuminationResponse[]> {
  let url = buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.MY_RUMINATIONS);
  
  if (queryParams) {
    const params = new URLSearchParams();
    if (queryParams.isPublic !== undefined) {
      params.append('isPublic', queryParams.isPublic.toString());
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  const response = await fetch(url, {
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

export async function getFeedRuminations(token: string, queryParams?: MyRuminationsQueryParams): Promise<RuminationResponse[]> {
  let url = buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.FEED);

  if (queryParams) {
    const params = new URLSearchParams();
    if (queryParams.isPublic !== undefined) {
      params.append('isPublic', queryParams.isPublic.toString());
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  const response = await fetch(url, {
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

export async function getPublicRuminations(queryParams?: MyRuminationsQueryParams): Promise<RuminationResponse[]> {
  let url = buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.PUBLIC);

  if (queryParams) {
    const params = new URLSearchParams();
    if (queryParams.isPublic !== undefined) {
      params.append('isPublic', queryParams.isPublic.toString());
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch all ruminations');
  }

  return await response.json();
}

export async function createRumination(token: string, rumination: PostRuminationDto): Promise<RuminationResponse> {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.BASE), {
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
