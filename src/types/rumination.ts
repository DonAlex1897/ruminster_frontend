import { UserResponse } from './user';

export enum UserRelationType {
  Acquaintance = 0,
  Family = 1,
  Friend = 2,
  BestFriend = 3,
  Partner = 4,
  Therapist = 5,
}

export interface MyRuminationsQueryParams {
  isPublic?: boolean;
}

export interface PostRuminationDto {
  content: string;
  publish: boolean;
  audiences?: UserRelationType[];
}

export interface UpdateRuminationDto {
  id: number;
  content: string;
  publish: boolean;
  audiences?: UserRelationType[];
}

export interface RuminationAudienceResponse {
  id: number;
  relationType: UserRelationType;
}

export interface RuminationResponse {
  id: number;
  content: string;
  isPublished: boolean;
  audiences: RuminationAudienceResponse[];
  createdBy: UserResponse;
  updatedBy: UserResponse;
  createTms: string;
  updateTms: string;
}
