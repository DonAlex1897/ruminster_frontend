export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: import('./user').UserResponse;
  requiresTosAcceptance: boolean;
  latestTosVersion: string | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface PostLoginDto {
  username: string;
  password: string;
}

export interface PostSignUpDto {
  username: string;
  email: string;
  password: string;
  acceptedTosVersion: string;
}

export interface PostRefreshTokenDto {
  refreshToken: string;
}

// Extended auth types (previously in authExtended.ts)
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
