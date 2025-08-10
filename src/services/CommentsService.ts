import { buildApiUrl } from '../config/api';
import { CommentResponse, PostCommentDto, UpdateCommentDto } from '../types/comment';
import { apiClient } from '../utils/apiClient';

export async function getCommentsByRumination(ruminationId: number): Promise<CommentResponse[]> {
  const response = await apiClient.get(buildApiUrl(`/api/comments/rumination/${ruminationId}`));

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return await response.json();
}

export async function getCommentReplies(commentId: number): Promise<CommentResponse[]> {
  const response = await apiClient.get(buildApiUrl(`/api/comments/comment/${commentId}/replies`));

  if (!response.ok) {
    throw new Error('Failed to fetch comment replies');
  }

  return await response.json();
}

export async function postComment(token: string, commentDto: PostCommentDto): Promise<CommentResponse> {
  const response = await apiClient.post(buildApiUrl('/api/comments'), commentDto, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to post comment');
  }

  return await response.json();
}

export async function updateComment(token: string, commentDto: UpdateCommentDto): Promise<CommentResponse> {
  const response = await apiClient.put(buildApiUrl(`/api/comments/${commentDto.id}`), commentDto, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update comment');
  }

  return await response.json();
}

export async function deleteComment(token: string, commentId: number): Promise<void> {
  const response = await apiClient.delete(buildApiUrl(`/api/comments/${commentId}`), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
}
