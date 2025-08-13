import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../AuthContext';
import { PostCommentDto, UpdateCommentDto } from '../types/comment';
import * as commentsService from '../services/CommentsService';

export const useComments = (ruminationId: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['comments', ruminationId],
    queryFn: () => commentsService.getCommentsByRumination(ruminationId),
    enabled: isAuthenticated && !!ruminationId,
  });
};

export const useCommentReplies = (commentId: number, hasChildren: boolean) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['commentReplies', commentId],
    queryFn: () => commentsService.getCommentReplies(commentId),
    enabled: isAuthenticated && !!commentId && !hasChildren,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (commentDto: PostCommentDto) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      let dtoModified = { ...commentDto };
      if (!!dtoModified.parentCommentId) {
        dtoModified.ruminationId = undefined;
      }
      return commentsService.postComment(dtoModified);
    },
    onSuccess: (_, commentDto) => {
      queryClient.invalidateQueries({ queryKey: ['comments', commentDto.ruminationId] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (commentDto: UpdateCommentDto) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return commentsService.updateComment(commentDto);
    },
    onSuccess: (_, commentDto) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (commentId: number) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return commentsService.deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['commentReplies'] });
    },
  });
};
