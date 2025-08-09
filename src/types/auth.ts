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
  userId: string;
  refreshToken: string;
}
