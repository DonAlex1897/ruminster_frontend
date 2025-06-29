import { UserRelationType } from '../types/rumination';
import { API_CONFIG, buildApiUrl } from '../config/api';

export interface UserRelationResponse {
  id: number;
  initiator: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
  receiver: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
  isAccepted: boolean;
  isRejected: boolean;
  type: UserRelationType;
}

export interface PostUserRelationDto {
  userId: string;
  relationType: UserRelationType;
}

export interface GetUserRelationsQueryParams {
  Id?: number[];
  UserId?: string;
  WithMe?: boolean;
  FromTMS?: string; // ISO date string
  ToTMS?: string;   // ISO date string
  IncludeDeleted?: boolean;
  Sort?: string;
  Limit?: number;
  Offset?: number;
}

export async function getUserRelations(token: string, queryParams?: GetUserRelationsQueryParams): Promise<UserRelationResponse[]> {
  let url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_RELATIONS.BASE);

  if (queryParams) {
    const params = new URLSearchParams();

    if (queryParams.Id) {
      params.append('Id', JSON.stringify(queryParams.Id));
    }
    if (queryParams.UserId) {
      params.append('UserId', queryParams.UserId);
    }
    if (queryParams.WithMe) {
      params.append('WithMe', JSON.stringify(queryParams.WithMe));
    }
    if (queryParams.FromTMS) {
      params.append('FromTMS', queryParams.FromTMS);
    }
    if (queryParams.ToTMS) {
      params.append('ToTMS', queryParams.ToTMS);
    }
    if (queryParams.IncludeDeleted) {
      params.append('IncludeDeleted', JSON.stringify(queryParams.IncludeDeleted));
    }
    if (queryParams.Sort) {
      params.append('Sort', queryParams.Sort);
    }
    if (queryParams.Limit) {
      params.append('Limit', JSON.stringify(queryParams.Limit));
    }
    if (queryParams.Offset) {
      params.append('Offset', JSON.stringify(queryParams.Offset));
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user relations');
  }

  return await response.json();
}

export async function requestUserRelation(token: string, dto: PostUserRelationDto): Promise<UserRelationResponse> {
  const url = buildApiUrl('/api/UserRelations');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error('Failed to request user relation');
  }

  return await response.json();
}

export async function acceptUserRelation(token: string, userRelationId: number): Promise<UserRelationResponse> {
  const url = buildApiUrl(`/api/UserRelations/${userRelationId}/accept`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to accept user relation');
  }

  return await response.json();
}

export async function rejectUserRelation(token: string, userRelationId: number): Promise<UserRelationResponse> {
  const url = buildApiUrl(`/api/UserRelations/${userRelationId}/reject`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to reject user relation');
  }

  return await response.json();
}

export async function deleteUserRelation(token: string, userRelationId: number): Promise<void> {
  const url = buildApiUrl(`/api/UserRelations/${userRelationId}`);

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user relation');
  }
}
