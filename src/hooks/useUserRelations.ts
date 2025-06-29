import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../AuthContext";
import { acceptUserRelation, deleteUserRelation, getUserRelations, GetUserRelationsQueryParams, PostUserRelationDto, rejectUserRelation, requestUserRelation } from "../services/UserRelationsService";

export const useUserRelations = (queryParams: GetUserRelationsQueryParams) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['userRelations', queryParams],
    queryFn: () => token ? getUserRelations(token, queryParams) : Promise.resolve(null),
    enabled: !!token,
  });
};

export const useRequestUserRelation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (userRelation: PostUserRelationDto) => {
      if (!token) throw new Error('No authentication token available');
      return requestUserRelation(token, userRelation);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
};

export const useAcceptUserRelation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (userRelationId: number) => {
      if (!token) throw new Error('No authentication token available');
      return acceptUserRelation(token, userRelationId);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
};

export const useRejectUserRelation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (userRelationId: number) => {
      if (!token) throw new Error('No authentication token available');
      return rejectUserRelation(token, userRelationId);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
}

export const useDeleteUserRelation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (userRelationId: number) => {
      if (!token) throw new Error('No authentication token available');
      return deleteUserRelation(token, userRelationId);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['userRelations'] });
    },
  });
}