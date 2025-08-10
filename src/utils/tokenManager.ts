import { tokenStorage } from './tokenStorage';
import { refreshToken } from '../services/AuthService';
import { PostRefreshTokenDto } from '../types/auth';

export class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string | null> | null = null;
  private onTokenRefreshed?: (newToken: string) => void;
  private onRefreshFailed?: () => void;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setCallbacks(
    onTokenRefreshed: (newToken: string) => void,
    onRefreshFailed: () => void
  ) {
    this.onTokenRefreshed = onTokenRefreshed;
    this.onRefreshFailed = onRefreshFailed;
  }

  async getValidAccessToken(): Promise<string | null> {
    const tokenData = tokenStorage.get();
    
    if (!tokenData) {
      return null;
    }

    // If token is not expired, return it
    if (!tokenStorage.isExpired()) {
      return tokenData.accessToken;
    }

    // If token is expired, try to refresh
    return this.refreshAccessToken();
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload (second part)
      const payload = parts[1];
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decodedPayload = atob(paddedPayload);
      const parsedPayload = JSON.parse(decodedPayload);

      // Return the user ID from the token payload
      return parsedPayload.sub || parsedPayload.userId || parsedPayload.nameid || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const tokenData = tokenStorage.get();
    if (!tokenData?.refreshToken) {
      this.onRefreshFailed?.();
      return null;
    }

    this.refreshPromise = this.performRefresh(tokenData.refreshToken);
    
    try {
      const newToken = await this.refreshPromise;
      if (newToken) {
        this.onTokenRefreshed?.(newToken);
      } else {
        this.onRefreshFailed?.();
      }
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.onRefreshFailed?.();
      return null;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(refreshTokenValue: string): Promise<string | null> {
    try {
      // Decode the refresh token to get user ID
      const userId = this.getUserIdFromToken(refreshTokenValue);
      
      const refreshDto: PostRefreshTokenDto = {
        userId: userId || '',
        refreshToken: refreshTokenValue
      };

      const response = await refreshToken(refreshDto);
      
      // Save the new tokens
      tokenStorage.save({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn || 3600 // Default to 1 hour
      });

      return response.accessToken;
    } catch (error) {
      console.error('Token refresh API call failed:', error);
      tokenStorage.clear();
      throw error;
    }
  }

  clearTokens(): void {
    tokenStorage.clear();
    this.refreshPromise = null;
  }
}

export const tokenManager = TokenManager.getInstance();
