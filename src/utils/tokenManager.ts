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
      const tokenData = tokenStorage.get();
      if (!tokenData?.userId) {
        throw new Error('No user ID available for token refresh');
      }
      
      const refreshDto: PostRefreshTokenDto = {
        userId: tokenData.userId,
        refreshToken: refreshTokenValue
      };

      const response = await refreshToken(refreshDto);
      
      // Save the new tokens
      tokenStorage.save({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn || 3600, // Default to 1 hour
        userId: tokenData.userId
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
