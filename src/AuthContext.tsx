import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidateToken } from './hooks/useAuth';
import { tokenStorage } from './utils/tokenStorage';
import { tokenManager } from './utils/tokenManager';
import { LoginResponse } from './types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  token: string | null;
  requiresTosAcceptance: boolean;
  latestTosVersion: string | null;
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  updateTosAcceptance: (accepted: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requiresTosAcceptance, setRequiresTosAcceptance] = useState(false);
  const [latestTosVersion, setLatestTosVersion] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(tokenStorage.getAccessToken());
  const navigate = useNavigate();

  const {
    data: user,
    isLoading: isLoadingUser,
  } = useValidateToken(!!accessToken);

  const logout = useCallback(() => {
    tokenManager.clearTokens();
    setAccessToken(null);
    setIsAuthenticated(false);
    setRequiresTosAcceptance(false);
    setLatestTosVersion(null);
    navigate('/login');
  }, [navigate]);

  // Set up token manager callbacks
  useEffect(() => {
    tokenManager.setCallbacks(
      (newToken: string) => {
        // Only update if the token is actually different to prevent unnecessary re-renders
        setAccessToken(prevToken => {
          if (prevToken !== newToken) {
            console.log('Token refreshed successfully');
            return newToken;
          }
          return prevToken;
        });
      },
      () => {
        console.log('Token refresh failed, logging out');
        logout();
      }
    );
  }, [logout]);

  // Debug effect to track authentication state changes
  useEffect(() => {
    console.log('Authentication state changed:', { isAuthenticated, loading, hasUser: !!user });
  }, [isAuthenticated, loading, user]);

  // Handle navigation after successful login
  useEffect(() => {
    console.log('Navigation effect:', { 
      isAuthenticated, 
      loading, 
      isLoadingUser, 
      requiresTosAcceptance,
      currentPath: window.location.pathname,
      shouldNavigate: isAuthenticated && !loading && !isLoadingUser
    });
    
    if (isAuthenticated && !loading && !isLoadingUser) {
      if (requiresTosAcceptance) {
        console.log('Navigating to terms-acceptance');
        navigate('/terms-acceptance');
      } else if (window.location.pathname === '/login') {
        console.log('Navigating to my-ruminations');
        navigate('/my-ruminations');
      }
    }
  }, [isAuthenticated, loading, isLoadingUser, requiresTosAcceptance, navigate]);

  // Set up automatic token refresh timer - less aggressive approach
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const checkTokenRefresh = async () => {
      // Only refresh if token expires in less than 2 minutes (instead of 4)
      const tokenData = tokenStorage.get();
      if (tokenData) {
        const timeUntilExpiry = tokenData.expiresAt - Date.now();
        const twoMinutesInMs = 2 * 60 * 1000;
        
        if (timeUntilExpiry < twoMinutesInMs && timeUntilExpiry > 0) {
          console.log('Proactively refreshing token...');
          await tokenManager.refreshAccessToken();
        }
      }
    };

    // Check every 60 seconds instead of 30 seconds
    const interval = setInterval(checkTokenRefresh, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    const handleTokenValidation = () => {
      // If still loading user data, wait
      if (isLoadingUser) {
        setLoading(true);
        return;
      }

      // If no token at all, logout
      if (!accessToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Check if token needs refresh first (4 minutes or less remaining)
      if (tokenStorage.needsRefresh()) {
        const tokenData = tokenStorage.get();
        if (tokenData?.refreshToken) {
          console.log('Token needs refresh, attempting refresh...');
          // Don't set loading state during refresh to prevent dialog closures
          tokenManager.refreshAccessToken().then((newToken) => {
            if (newToken) {
              console.log('Token refresh successful');
              // Token update will be handled by the callback above
            } else {
              console.log('Token refresh failed, logging out');
              setIsAuthenticated(false);
              setLoading(false);
            }
          }).catch(() => {
            console.log('Token refresh failed, logging out');
            setIsAuthenticated(false);
            setLoading(false);
          });
          // Continue with current authentication state during refresh
          if (user) {
            setIsAuthenticated(true);
            setLoading(false);
          }
          return;
        } else {
          // No refresh token available
          console.log('No refresh token available, logging out');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
      }

      // If we have both valid token and user, authenticate
      if (accessToken && user) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // If we have token but no user data and not loading
      if (accessToken && !user && !isLoadingUser) {
        // Token exists but validation failed - don't authenticate but don't logout yet
        // This could be a temporary network issue
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Default: set auth based on user presence
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    handleTokenValidation();
  }, [user, isLoadingUser, accessToken]);

  const login = useCallback((loginResponse: LoginResponse) => {
    // Store tokens securely
    tokenStorage.save({
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
      expiresIn: loginResponse.expiresIn,
      userId: loginResponse.user.id
    });
    
    // Update the local token state immediately
    setAccessToken(loginResponse.accessToken);
    setRequiresTosAcceptance(loginResponse.requiresTosAcceptance);
    setLatestTosVersion(loginResponse.latestTosVersion);
  }, []);

  const updateTosAcceptance = useCallback((accepted: boolean) => {
    setRequiresTosAcceptance(!accepted);
    if (accepted) {
      navigate('/my-ruminations');
    }
  }, [navigate]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated, 
    loading, 
    user, 
    token: accessToken, 
    requiresTosAcceptance,
    latestTosVersion,
    login, 
    logout,
    updateTosAcceptance 
  }), [
    isAuthenticated, 
    loading, 
    user, 
    accessToken, 
    requiresTosAcceptance,
    latestTosVersion,
    login, 
    logout,
    updateTosAcceptance
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};