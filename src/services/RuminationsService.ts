import { RuminationResponse, PostRuminationDto, MyRuminationsQueryParams, UpdateRuminationDto } from '../types/rumination';
import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';

export async function getMyRuminations(queryParams?: MyRuminationsQueryParams): Promise<RuminationResponse[]> {
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

  const response = await apiClient.get(url);

  if (!response.ok) {
    throw new Error('Failed to fetch my ruminations');
  }

  const data = await response.json();
  return normalizeRuminations(data);
}

export async function getFeedRuminations(queryParams?: MyRuminationsQueryParams): Promise<RuminationResponse[]> {
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

  const response = await apiClient.get(url);

  if (!response.ok) {
    throw new Error('Failed to fetch all ruminations');
  }

  const data = await response.json();
  return normalizeRuminations(data);
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

  const response = await apiClient.get(url);

  if (!response.ok) {
    throw new Error('Failed to fetch all ruminations');
  }

  const data = await response.json();
  return normalizeRuminations(data);
}

export async function createRumination(rumination: PostRuminationDto): Promise<RuminationResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.BASE), rumination);

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

  const data = await response.json();
  return normalizeRumination(data);
}

export async function updateRumination(rumination: UpdateRuminationDto): Promise<RuminationResponse> {
  const response = await apiClient.put(
    buildApiUrl(`${API_CONFIG.ENDPOINTS.RUMINATIONS.BASE}/${rumination.id}`),
    {
      content: rumination.content,
      audiences: rumination.audiences,
      publish: rumination.publish
    }
  );

  if (!response.ok) {
    let errorMessage = 'Failed to update rumination';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return normalizeRumination(data);
}

export async function deleteRumination(ruminationId: string): Promise<void> {
  const response = await apiClient.delete(buildApiUrl(`${API_CONFIG.ENDPOINTS.RUMINATIONS.BASE}/${ruminationId}`));

  if (!response.ok) {
    let errorMessage = 'Failed to delete rumination';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }
}

export async function getUserRuminations(userId: string, queryParams?: MyRuminationsQueryParams): Promise<RuminationResponse[]> {
  let url = buildApiUrl(API_CONFIG.ENDPOINTS.RUMINATIONS.PUBLIC);
  
  const params = new URLSearchParams();
  params.append('UserId', userId);
  
  if (queryParams?.isPublic !== undefined) {
    params.append('isPublic', queryParams.isPublic.toString());
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await apiClient.get(url);

  if (!response.ok) {
    throw new Error('Failed to fetch user ruminations');
  }

  const data = await response.json();
  return normalizeRuminations(data);
}

// Helpers to normalize backend field naming to our TS types
function normalizeRumination(input: any): RuminationResponse {
  if (!input) return input as RuminationResponse;
  return {
    ...input,
    // Normalize backend keys like createTMS/updateTMS to createTms/updateTms
    createTms: input.createTms ?? input.createTMS ?? input.createdAt ?? input.created_at ?? input.create_time ?? input.createTime ?? input.createdOn ?? input.created_on,
    updateTms: input.updateTms ?? input.updateTMS ?? input.updatedAt ?? input.updated_at ?? input.update_time ?? input.updateTime ?? input.updatedOn ?? input.updated_on,
  } as RuminationResponse;
}

function normalizeRuminations(input: any): RuminationResponse[] {
  if (!Array.isArray(input)) return input as RuminationResponse[];
  return input.map(normalizeRumination);
}
