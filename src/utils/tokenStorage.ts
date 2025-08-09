export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const TOKEN_KEY = 'authTokens';

export const tokenStorage = {
  save: (tokens: { accessToken: string; refreshToken: string; expiresIn: number }): void => {
    const expiresAt = Date.now() + (tokens.expiresIn * 1000);
    const tokenData: TokenData = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt
    };
    
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  },

  get: (): TokenData | null => {
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) return null;
      
      const tokenData: TokenData = JSON.parse(stored);
      return tokenData;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  },

  getAccessToken: (): string | null => {
    const tokenData = tokenStorage.get();
    return tokenData?.accessToken || null;
  },

  getRefreshToken: (): string | null => {
    const tokenData = tokenStorage.get();
    return tokenData?.refreshToken || null;
  },

  isExpired: (): boolean => {
    const tokenData = tokenStorage.get();
    if (!tokenData) return true;
    
    // Consider token expired if it expires within the next 5 minutes
    return tokenData.expiresAt <= (Date.now() + 5 * 60 * 1000);
  },

  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      // Also remove the old token storage for migration
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
};
