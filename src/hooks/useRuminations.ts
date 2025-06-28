import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getMyRuminations, 
  getFeedRuminations, 
  getPublicRuminations, 
  createRumination,
  updateRumination,
  deleteRumination 
} from '../services/RuminationsService';
import { MyRuminationsQueryParams, PostRuminationDto, UpdateRuminationDto } from '../types/rumination';
import { useAuth } from '../AuthContext';

export const useMyRuminations = (queryParams?: MyRuminationsQueryParams) => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['myRuminations', token, queryParams],
    queryFn: () => token ? getMyRuminations(token, queryParams) : Promise.resolve([]),
    enabled: !!token,
  });
};

export const useFeedRuminations = (queryParams?: MyRuminationsQueryParams) => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['feedRuminations', token, queryParams],
    queryFn: () => token ? getFeedRuminations(token, queryParams) : Promise.resolve([]),
    enabled: !!token,
  });
};

export const usePublicRuminations = (queryParams?: MyRuminationsQueryParams) => {
  return useQuery({
    queryKey: ['publicRuminations', queryParams],
    queryFn: () => getPublicRuminations(queryParams),
  });
};

export const useCreateRumination = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: (rumination: PostRuminationDto) => {
      if (!token) throw new Error('No authentication token available');
      return createRumination(token, rumination);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['myRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['feedRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRuminations'] });
    },
  });
};

export const useUpdateRumination = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: (rumination: UpdateRuminationDto) => {
      if (!token) throw new Error('No authentication token available');
      return updateRumination(token, rumination);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['myRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['feedRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRuminations'] });
    },
  });
};

export const useDeleteRumination = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: (ruminationId: string) => {
      if (!token) throw new Error('No authentication token available');
      return deleteRumination(token, ruminationId);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['myRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['feedRuminations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRuminations'] });
    },
  });
};
