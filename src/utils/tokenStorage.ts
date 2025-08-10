export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

const TOKEN_KEY = 'authTokens';

export const tokenStorage = {
  save: (tokens: { accessToken: string; refreshToken: string; expiresIn: number; userId: string }): void => {
    const expiresAt = Date.now() + (tokens.expiresIn * 1000);
    const tokenData: TokenData = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt,
      userId: tokens.userId
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
    
    // Consider token expired if it's actually expired (with 30 second buffer)
    return tokenData.expiresAt <= (Date.now() + 30 * 1000);
  },

  needsRefresh: (): boolean => {
    const tokenData = tokenStorage.get();
    if (!tokenData) return false;
    
    // Refresh if token expires within the next 2 minutes
    return tokenData.expiresAt <= (Date.now() + 4 * 60 * 1000);
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
