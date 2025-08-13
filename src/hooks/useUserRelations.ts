import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../AuthContext";
import { acceptUserRelation, deleteUserRelation, getUserRelations, GetUserRelationsQueryParams, PostUserRelationDto, rejectUserRelation, requestUserRelation } from "../services/UserRelationsService";

export const useUserRelations = (queryParams?: GetUserRelationsQueryParams) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['userRelations', queryParams],
    queryFn: () => getUserRelations(queryParams),
    enabled: isAuthenticated,
  });
};

export const useRequestUserRelation = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (userRelation: PostUserRelationDto) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return requestUserRelation(userRelation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
};

export const useAcceptUserRelation = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (userRelationId: number) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return acceptUserRelation(userRelationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
};

export const useRejectUserRelation = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (userRelationId: number) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return rejectUserRelation(userRelationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
};

export const useDeleteUserRelation = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (userRelationId: number) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return deleteUserRelation(userRelationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
};