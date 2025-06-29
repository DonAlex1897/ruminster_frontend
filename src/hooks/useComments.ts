import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../AuthContext';
import { PostCommentDto, UpdateCommentDto } from '../types/comment';
import * as commentsService from '../services/CommentsService';

export const useComments = (ruminationId: number) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['comments', ruminationId],
    queryFn: () => token ? commentsService.getCommentsByRumination(ruminationId) : Promise.resolve([]),
    enabled: !!token && !!ruminationId,
  });
};

export const useCommentReplies = (commentId: number, hasChildren: boolean) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['commentReplies', commentId],
    queryFn: () => token ? commentsService.getCommentReplies(commentId) : Promise.resolve([]),
    enabled: !!token && !!commentId && !hasChildren,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (commentDto: PostCommentDto) => {
      if (!token) throw new Error('No authentication token available');
      let dtoModified = { ...commentDto };
      if (!!dtoModified.parentCommentId) {
        dtoModified.ruminationId = undefined; // Ensure ruminationId is not set if parentCommentId is present
      }
      return commentsService.postComment(token, dtoModified);
    },
    onSuccess: (_, commentDto) => {
      queryClient.invalidateQueries({ queryKey: ['comments', commentDto.ruminationId] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (commentDto: UpdateCommentDto) => {
      if (!token) throw new Error('No authentication token available');
      return commentsService.updateComment(token, commentDto);
    },
    onSuccess: (_, commentDto) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (commentId: number) => {
      if (!token) throw new Error('No authentication token available');
      return commentsService.deleteComment(token, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['commentReplies'] });
    },
  });
};
