import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../services/UserService';

export const useUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });
};
