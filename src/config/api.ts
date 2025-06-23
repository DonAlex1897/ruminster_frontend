// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:5001',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      REFRESH_TOKEN: '/api/auth/refresh-token',
      ME: '/api/auth/me',
    },
    USERS: {
      CURRENT: '/api/users/current',
      LIST: '/api/users',
    },
    RUMINATIONS: {
      LIST: '/api/ruminations',
      MY_RUMINATIONS: '/api/ruminations/my',
      OTHERS_RUMINATIONS: '/api/ruminations/others',
    },
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 