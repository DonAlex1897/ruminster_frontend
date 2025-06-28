export interface PostForgotPasswordDto {
  email: string;
}

export interface PostResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface GetActivateDto {
  token: string;
}

export interface ApiResponse {
  message: string;
}
