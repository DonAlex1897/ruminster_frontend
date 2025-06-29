import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentResponse, PostCommentDto, UpdateCommentDto } from '../types/comment';
import * as commentsService from '../services/CommentsService';

const COMMENTS_QUERY_KEY = 'comments';

export const useComments = (ruminationId: number) => {
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading: loading,
    error,
    refetch: refetchComments,
  } = useQuery({
    queryKey: [COMMENTS_QUERY_KEY, ruminationId],
    queryFn: () => commentsService.getCommentsByRumination(ruminationId),
    enabled: !!ruminationId,
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ token, commentDto }: { token: string; commentDto: PostCommentDto }) =>
      commentsService.postComment(token, commentDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY, ruminationId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ token, commentDto }: { token: string; commentDto: UpdateCommentDto }) =>
      commentsService.updateComment(token, commentDto),
    onMutate: async ({ commentDto }) => {
      await queryClient.cancelQueries({ queryKey: [COMMENTS_QUERY_KEY, ruminationId] });
      const previousComments = queryClient.getQueryData<CommentResponse[]>([COMMENTS_QUERY_KEY, ruminationId]);
      
      queryClient.setQueryData<CommentResponse[]>([COMMENTS_QUERY_KEY, ruminationId], (old) =>
        old?.map(comment =>
          comment.id === commentDto.id
            ? { ...comment, content: commentDto.content }
            : comment
        ) || []
      );

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData([COMMENTS_QUERY_KEY, ruminationId], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY, ruminationId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ token, commentId }: { token: string; commentId: number }) =>
      commentsService.deleteComment(token, commentId),
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: [COMMENTS_QUERY_KEY, ruminationId] });
      const previousComments = queryClient.getQueryData<CommentResponse[]>([COMMENTS_QUERY_KEY, ruminationId]);
      
      queryClient.setQueryData<CommentResponse[]>([COMMENTS_QUERY_KEY, ruminationId], (old) =>
        old?.filter(comment => comment.id !== commentId) || []
      );

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData([COMMENTS_QUERY_KEY, ruminationId], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY, ruminationId] });
    },
  });

  return {
    comments,
    loading,
    error: error?.message || null,
    refetchComments,
    addComment: addCommentMutation.mutateAsync,
    updateComment: updateCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    isAddingComment: addCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
  };
};
