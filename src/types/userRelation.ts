import { UserResponse } from './user';
import { UserRelationType } from './rumination';

export interface UserRelationResponse {
  id: number;
  initiator: UserResponse;
  receiver: UserResponse;
  isAccepted: boolean;
  isRejected: boolean;
  type: UserRelationType;
}

export interface PostUserRelationDto {
  userId: string;
  relationType: UserRelationType;
}

export interface GetUserRelationsQueryParams {
  id?: number[];
  userId?: string;
  withMe?: boolean;
  fromTMS?: string; // ISO date string
  toTMS?: string;   // ISO date string
  includeDeleted?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
}
