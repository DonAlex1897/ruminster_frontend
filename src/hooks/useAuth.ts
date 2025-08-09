import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, signup, validateToken, refreshToken } from '../services/AuthService';
import { forgotPassword, resetPassword, activateAccount } from '../services/AuthServiceExtended';
import { PostLoginDto, PostSignUpDto, PostRefreshTokenDto } from '../types/auth';
import { PostForgotPasswordDto, PostResetPasswordDto } from '../types/authExtended';
import { tokenStorage } from '../utils/tokenStorage';

export const useValidateToken = (token: string | null) => {
  return useQuery({
    queryKey: ['validateToken', token],
    queryFn: async () => {
      if (!token) return null;
      return validateToken(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: PostLoginDto) => login(credentials),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (credentials: PostSignUpDto) => signup(credentials),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (credentials: PostForgotPasswordDto) => forgotPassword(credentials),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (credentials: PostResetPasswordDto) => resetPassword(credentials),
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (refreshTokenDto: PostRefreshTokenDto) => refreshToken(refreshTokenDto),
    onSuccess: (data) => {
      // Save new tokens
      tokenStorage.save({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: 3600 // Default to 1 hour
      });
      
      // Invalidate and refetch the user validation query
      queryClient.invalidateQueries({ queryKey: ['validateToken'] });
    },
    onError: () => {
      // Refresh failed, clear tokens and redirect to login
      tokenStorage.clear();
      queryClient.clear();
      window.location.href = '/login';
    }
  });
};

export const useActivateAccount = () => {
  return useMutation({
    mutationFn: (token: string) => activateAccount(token),
  });
};
