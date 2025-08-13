import { UserResponse } from './user';

export interface PostCommentDto {
  content: string;
  ruminationId?: number;
  parentCommentId?: number;
}

export interface UpdateCommentDto {
  id: number;
  content: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  isDeleted: boolean;
  ruminationId?: number;
  parentCommentId?: number;
  createTms: string;
  updateTms: string;
  createdBy: UserResponse;
  updatedBy: UserResponse;
  childComments: CommentResponse[];
}
