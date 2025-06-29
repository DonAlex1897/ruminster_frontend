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
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      ACTIVATE: '/api/auth/activate',
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
    TERMS_OF_SERVICE: {
      BASE: '/api/TermsOfService',
      CURRENT: '/api/TermsOfService/current',
      ACCEPT: '/api/TermsOfService/accept',
      ACCEPTANCE_STATUS: '/api/TermsOfService/acceptance-status',
      CREATE: '/api/TermsOfService/create',
    },
    USER_RELATIONS: {
      BASE: '/api/UserRelations',
      REQUEST: '/api/UserRelations/request',
      ACCEPT: '/api/UserRelations/accept',
      REJECT: '/api/UserRelations/reject',
      DELETE: '/api/UserRelations/delete',
    },
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 