// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:5001',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      BASE: '/api/auth',
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      REFRESH_TOKEN: '/api/auth/refresh-token',
      ME: '/api/auth/me',
    },
    USERS: {
      BASE: '/api/users',
      CURRENT: '/api/users/current',
      LIST: '/api/users',
    },
    RUMINATIONS: {
      BASE: '/api/ruminations',
      FEED: '/api/ruminations/feed',
      PUBLIC: '/api/ruminations/public',
      MY_RUMINATIONS: '/api/ruminations/my',
    },
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 