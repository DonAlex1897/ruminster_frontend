import { useMutation, useQuery } from '@tanstack/react-query';
import { login, signup, validateToken } from '../services/AuthService';
import { forgotPassword, resetPassword, activateAccount } from '../services/AuthServiceExtended';
import { PostLoginDto, PostSignUpDto } from '../types/auth';
import { PostForgotPasswordDto, PostResetPasswordDto } from '../types/auth';

export const useValidateToken = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['validateToken'],
    queryFn: () => validateToken(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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

export const useActivateAccount = () => {
  return useMutation({
    mutationFn: (token: string) => activateAccount(token),
  });
};
