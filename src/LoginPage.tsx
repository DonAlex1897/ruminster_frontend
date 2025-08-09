import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin, useSignup } from './hooks/useAuth';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTos: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showActivationMessage, setShowActivationMessage] = useState(false);
  
  const { isAuthenticated, loading, login: authLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/my-ruminations');
    }
  }, [isAuthenticated, loading, navigate]);

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  // Handle login success/error
  React.useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data) {
      authLogin(loginMutation.data);
    }
    if (loginMutation.isError) {
      setErrors({ general: loginMutation.error.message });
    }
  }, [loginMutation.isSuccess, loginMutation.isError, loginMutation.data, loginMutation.error, authLogin]);

  // Handle signup success/error
  React.useEffect(() => {
    if (signupMutation.isSuccess && signupMutation.data) {
      setShowActivationMessage(true);
    }
    if (signupMutation.isError) {
      setErrors({ general: signupMutation.error.message });
    }
  }, [signupMutation.isSuccess, signupMutation.isError, signupMutation.data, signupMutation.error]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
    }
    
    if (!isLogin && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!isLogin && !formData.acceptedTos) {
      newErrors.acceptedTos = 'You must accept the Terms of Service to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;
    
    if (isLogin) {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password
      });
    } else {
      signupMutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        acceptedTosVersion: "1.0"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '', confirmPassword: '', acceptedTos: false });
    setErrors({});
    setShowActivationMessage(false);
  };

  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showActivationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="card text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Check Your Email</h2>
              <p className="text-text-secondary mb-4">
                We've sent an activation email to <strong>{formData.email}</strong>
              </p>
              <p className="text-text-secondary text-sm">
                Please check your email and click the activation link to complete your account setup.
              </p>
            </div>
            <button
              onClick={toggleMode}
              className="text-accent hover:text-primary transition-colors font-medium"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="font-medium text-accent hover:text-primary transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`form-input w-full ${
                  errors.username ? 'border-border-error' : ''
                }`}
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-error">{errors.username}</p>
              )}
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`form-input w-full ${
                    errors.email ? 'border-border-error' : ''
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email}</p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`form-input w-full ${
                  errors.password ? 'border-border-error' : ''
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password}</p>
              )}
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`form-input w-full ${
                    errors.confirmPassword ? 'border-border-error' : ''
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
                )}
              </div>
              )}
                
              {!isLogin && (
                  <div>
                  <div className="flex items-start">
                    <input
                      id="acceptedTos"
                      name="acceptedTos"
                      type="checkbox"
                      required
                      className={`mt-1 mr-3 h-4 w-4 text-primary focus:ring-primary border-border rounded ${
                        errors.acceptedTos ? 'border-border-error' : ''
                      }`}
                      checked={formData.acceptedTos}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="acceptedTos" className="text-sm text-text-secondary">
                      I agree to the{' '}
                      <a
                        href="/terms-of-service"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-primary transition-colors underline"
                      >
                        Terms of Service
                      </a>
                    </label>
                  </div>
                  {errors.acceptedTos && (
                    <p className="mt-1 text-sm text-error">{errors.acceptedTos}</p>
                  )}
                </div>
              )}
            </div>

            {errors.general && (
            <div className="rounded-md bg-error/10 border border-error/20 p-4">
              <div className="text-sm text-error">{errors.general}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending || signupMutation.isPending}
              className="btn-primary w-full flex justify-center py-3"
            >
              {(loginMutation.isPending || signupMutation.isPending) ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                isLogin ? 'Sign in' : 'Sign up'
              )}
            </button>
          </div>
          
          {isLogin && (
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:text-primary transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;