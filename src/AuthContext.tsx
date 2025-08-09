import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidateToken, useRefreshToken } from './hooks/useAuth';
import { tokenStorage } from './utils/tokenStorage';
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
  const navigate = useNavigate();

  const accessToken = tokenStorage.getAccessToken();

  const {
    data: user,
    isLoading: isLoadingUser,
  } = useValidateToken(accessToken);

  const refreshTokenMutation = useRefreshToken();

  useEffect(() => {
    if (isLoadingUser) {
      setLoading(true);
      return;
    }

    // If user is null (token invalid/expired) and we have a refresh token, try refreshing
    if (!user && accessToken && !refreshTokenMutation.isPending) {
      const tokenData = tokenStorage.get();
      if (tokenData?.refreshToken) {
        // Attempt to refresh the token when validation fails
        refreshTokenMutation.mutate({
          userId: tokenData.refreshToken, // Assuming userId is derived from refresh token for now
          refreshToken: tokenData.refreshToken
        });
        return;
      }
    }

    setIsAuthenticated(!!user);
    setLoading(false);
  }, [user, isLoadingUser, accessToken, refreshTokenMutation]);

  const login = (loginResponse: LoginResponse) => {
    // Store tokens securely
    tokenStorage.save({
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
      expiresIn: loginResponse.expiresIn
    });
    
    setIsAuthenticated(true);
    setRequiresTosAcceptance(loginResponse.requiresTosAcceptance);
    setLatestTosVersion(loginResponse.latestTosVersion);
    
    if (loginResponse.requiresTosAcceptance) {
      navigate('/terms-acceptance');
    } else {
      navigate('/my-ruminations');
    }
  };

  const logout = () => {
    tokenStorage.clear();
    setIsAuthenticated(false);
    setRequiresTosAcceptance(false);
    setLatestTosVersion(null);
    navigate('/login');
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