import { CommentResponse, PostCommentDto, UpdateCommentDto } from '../types/comment';
import { buildApiUrl } from '../config/api';

export async function getCommentsByRumination(ruminationId: number): Promise<CommentResponse[]> {
  const url = buildApiUrl(`/api/comments/rumination/${ruminationId}`);

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return await response.json();
}

export async function getCommentReplies(commentId: number): Promise<CommentResponse[]> {
  const url = buildApiUrl(`/api/comments/comment/${commentId}/replies`);

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comment replies');
  }

  return await response.json();
}

export async function postComment(token: string, commentDto: PostCommentDto): Promise<CommentResponse> {
  const url = buildApiUrl('/api/comments');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(commentDto),
  });

  if (!response.ok) {
    throw new Error('Failed to post comment');
  }

  return await response.json();
}

export async function updateComment(token: string, commentDto: UpdateCommentDto): Promise<CommentResponse> {
  const url = buildApiUrl(`/api/comments/${commentDto.id}`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(commentDto),
  });

  if (!response.ok) {
    throw new Error('Failed to update comment');
  }

  return await response.json();
}

export async function deleteComment(token: string, commentId: number): Promise<void> {
  const url = buildApiUrl(`/api/comments/${commentId}`);

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
}
