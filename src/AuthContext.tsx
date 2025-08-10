import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  } = useValidateToken(accessToken);

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
        setAccessToken(newToken);
        console.log('Token refreshed successfully');
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

  // Set up automatic token refresh timer - simplified
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const checkTokenRefresh = async () => {
      if (tokenStorage.needsRefresh()) {
        await tokenManager.refreshAccessToken();
      }
    };

    // Check every 30 seconds for more responsive refresh
    const interval = setInterval(checkTokenRefresh, 30 * 1000);
    
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
          tokenManager.refreshAccessToken().then((newToken) => {
            if (newToken) {
              console.log('Token refresh successful');
              setAccessToken(newToken);
              // Don't set loading here, let the next cycle handle it
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

  const login = (loginResponse: LoginResponse) => {
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
  };

  const updateTosAcceptance = (accepted: boolean) => {
    setRequiresTosAcceptance(!accepted);
    if (accepted) {
      navigate('/my-ruminations');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      user, 
      token: accessToken, 
      requiresTosAcceptance,
      latestTosVersion,
      login, 
      logout,
      updateTosAcceptance 
    }}>
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