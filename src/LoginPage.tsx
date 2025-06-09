import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const LoginPage: React.FC = () => {
  const [token, setToken] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    // Validate token (e.g., via API call)
    login(token);
  };

  return (
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
  );
};

export default LoginPage;