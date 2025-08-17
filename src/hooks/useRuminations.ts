import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getMyRuminations, 
  getFeedRuminations, 
  getPublicRuminations, 
  getUserRuminations,
  createRumination,
  updateRumination,
  deleteRumination 
} from '../services/RuminationsService';
import { MyRuminationsQueryParams, PostRuminationDto, UpdateRuminationDto } from '../types/rumination';
import type { FeedRuminationsQueryParams } from '../services/RuminationsService';
import { useAuth } from '../AuthContext';

export const useMyRuminations = (queryParams?: MyRuminationsQueryParams) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['myRuminations', queryParams],
    queryFn: () => getMyRuminations(queryParams),
    enabled: isAuthenticated,
  });
};

export const useFeedRuminations = (queryParams?: FeedRuminationsQueryParams) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['feedRuminations', queryParams],
    queryFn: () => getFeedRuminations(queryParams),
    enabled: isAuthenticated,
  });
};

export const usePublicRuminations = (queryParams?: MyRuminationsQueryParams) => {
  return useQuery({
    queryKey: ['publicRuminations', queryParams],
    queryFn: () => getPublicRuminations(queryParams),
  });
};

export const useUserRuminations = (userId: string, queryParams?: MyRuminationsQueryParams) => {
  return useQuery({
    queryKey: ['userRuminations', userId, queryParams],
    queryFn: () => getUserRuminations(userId, queryParams),
    enabled: !!userId,
  });
};

export const useCreateRumination = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: (rumination: PostRuminationDto) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return createRumination(rumination);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['feedRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRuminations'] });
    },
  });
};

export const useUpdateRumination = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: (rumination: UpdateRuminationDto) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return updateRumination(rumination);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['feedRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRuminations'] });
    },
  });
};

export const useDeleteRumination = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  
  return useMutation({
    mutationFn: (ruminationId: string) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      return deleteRumination(ruminationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['feedRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRuminations'] });
    },
  });
};
