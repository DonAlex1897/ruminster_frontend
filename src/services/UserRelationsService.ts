import { apiClient } from '../utils/apiClient';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { UserRelationResponse, PostUserRelationDto, GetUserRelationsQueryParams } from '../types/userRelation';

export async function getUserRelations(queryParams?: GetUserRelationsQueryParams): Promise<UserRelationResponse[]> {
  let url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_RELATIONS.BASE);

  if (queryParams) {
    const params = new URLSearchParams();

    if (queryParams.id) {
      params.append('Id', JSON.stringify(queryParams.id));
    }
    if (queryParams.userId) {
      params.append('UserId', queryParams.userId);
    }
    if (queryParams.withMe) {
      params.append('WithMe', JSON.stringify(queryParams.withMe));
    }
    if (queryParams.fromTMS) {
      params.append('FromTMS', queryParams.fromTMS);
    }
    if (queryParams.toTMS) {
      params.append('ToTMS', queryParams.toTMS);
    }
    if (queryParams.includeDeleted) {
      params.append('IncludeDeleted', JSON.stringify(queryParams.includeDeleted));
    }
    if (queryParams.sort) {
      params.append('Sort', queryParams.sort);
    }
    if (queryParams.limit) {
      params.append('Limit', JSON.stringify(queryParams.limit));
    }
    if (queryParams.offset) {
      params.append('Offset', JSON.stringify(queryParams.offset));
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  const response = await apiClient.get(url);

  if (!response.ok) {
    throw new Error('Failed to fetch user relations');
  }

  return await response.json();
}

export async function requestUserRelation(dto: PostUserRelationDto): Promise<UserRelationResponse> {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.USER_RELATIONS.BASE), dto);

  if (!response.ok) {
    throw new Error('Failed to request user relation');
  }

  return await response.json();
}

export async function acceptUserRelation(userRelationId: number): Promise<UserRelationResponse> {
  const response = await apiClient.put(buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_RELATIONS.BASE}/${userRelationId}/accept`));

  if (!response.ok) {
    throw new Error('Failed to accept user relation');
  }

  return await response.json();
}

export async function rejectUserRelation(userRelationId: number): Promise<UserRelationResponse> {
  const response = await apiClient.put(buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_RELATIONS.BASE}/${userRelationId}/reject`));

  if (!response.ok) {
    throw new Error('Failed to reject user relation');
  }

  return await response.json();
}

export async function deleteUserRelation(userRelationId: number): Promise<void> {
  const response = await apiClient.delete(buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_RELATIONS.BASE}/${userRelationId}`));

  if (!response.ok) {
    throw new Error('Failed to delete user relation');
  }
}
