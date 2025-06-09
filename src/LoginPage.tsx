import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [token, setToken] = useState('');
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/'); // Redirect to home page if already authenticated
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = () => {
    // Validate token (e.g., via API call)
    login(token);
  };

  return (
    <>
      {loading || isAuthenticated ? <div>Loading...</div> :
      <div>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    }  
    </>
  );
};

export default LoginPage;