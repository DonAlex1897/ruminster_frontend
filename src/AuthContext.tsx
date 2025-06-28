import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidateToken } from './hooks/useAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  token: string | null;
  requiresTosAcceptance: boolean;
  latestTosVersion: string | null;
  login: (token: string, requiresTos?: boolean, tosVersion?: string | null) => void;
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

  const token = localStorage.getItem('authToken');

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useValidateToken(token);

  useEffect(() => {
    if (isLoadingUser) {
      setLoading(true);
      return;
    }
    setIsAuthenticated(!!user && !isErrorUser);
    setLoading(false);
  }, [user, isLoadingUser, isErrorUser]);

  const login = (token: string, requiresTos: boolean = false, tosVersion: string | null = null) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setRequiresTosAcceptance(requiresTos);
    setLatestTosVersion(tosVersion);
    
    if (requiresTos) {
      navigate('/terms-acceptance');
    } else {
      navigate('/my-ruminations');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
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
      token, 
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