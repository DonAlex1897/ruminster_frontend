export interface PostCommentDto {
  content: string;
  ruminationId?: number;
  parentCommentId?: number;
}

export interface UpdateCommentDto {
  id: number;
  content: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface CommentResponse {
  id: number;
  content: string;
  isDeleted: boolean;
  ruminationId?: number;
  parentCommentId?: number;
  createTMS: string;
  updateTMS: string;
  createdBy: UserResponse;
  updatedBy: UserResponse;
  childComments: CommentResponse[];
}
