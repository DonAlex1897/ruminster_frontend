import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { handleApiError } from '../utils/errorHandler';
import { UserResponse } from '../types/user';
import { RuminationResponse } from '../types/rumination';

export interface SearchResults {
  users: UserResponse[];
  ruminations: RuminationResponse[];
}

export async function searchAll(query: string, signal?: AbortSignal): Promise<SearchResults> {
  const q = (query || '').trim();
  if (!q) return { users: [], ruminations: [] };

  let url = buildApiUrl(API_CONFIG.ENDPOINTS.SEARCH.BASE);

  const params = new URLSearchParams();
  params.append('Query', q);

  url += `?${params.toString()}`;
  
  const response = await apiClient.get(url, { signal });

  if (!response.ok) {
    await handleApiError(response, 'Failed to search');
  }

  const data = await response.json();
  const users: UserResponse[] = Array.isArray(data?.users) ? data.users : [];
  const ruminationsRaw: any[] = Array.isArray(data?.ruminations) ? data.ruminations : [];
  const ruminations: RuminationResponse[] = ruminationsRaw.map(normalizeRumination);

  return { users, ruminations };
}

// Normalize backend field naming to our TS types
function normalizeRumination(input: any): RuminationResponse {
  if (!input) return input as RuminationResponse;
  return {
    ...input,
    createTms:
      input.createTms ??
      input.createTMS ??
      input.createdAt ??
      input.created_at ??
      input.create_time ??
      input.createTime ??
      input.createdOn ??
      input.created_on,
    updateTms:
      input.updateTms ??
      input.updateTMS ??
      input.updatedAt ??
      input.updated_at ??
      input.update_time ??
      input.updateTime ??
      input.updatedOn ??
      input.updated_on,
  } as RuminationResponse;
}
