export enum UserRelationType {
  Acquaintance = 0,
  Family = 1,
  Friend = 2,
  BestFriend = 3,
  Partner = 4,
  Therapist = 5,
}

export interface PostRuminationDto {
  content: string;
  publish: boolean;
  audiences?: UserRelationType[];
}

export interface RuminationAudienceResponse {
  id: number;
  userRelationType: UserRelationType;
}

export interface RuminationResponse {
  id: number;
  content: string;
  isPublished: boolean;
  audiences: RuminationAudienceResponse[];
  createdBy: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
  updatedBy: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
  createTMS: string;
  updateTMS: string;
}
