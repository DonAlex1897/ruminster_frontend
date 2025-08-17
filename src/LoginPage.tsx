import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin, useSignup } from './hooks/useAuth';
import logo from './assets/ruminster_logo.png';

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
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showActivationMessage) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-background-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6 flex justify-center">
              <img src={logo} alt="Ruminster" className="h-12 w-auto" />
            </div>
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">Check Your Email</h2>
              <p className="text-text-secondary mb-4 leading-relaxed">
                We've sent an activation email to <br/>
                <strong className="text-text-primary">{formData.email}</strong>
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Please check your email and click the activation link to complete your account setup.
              </p>
            </div>
            <button
              onClick={toggleMode}
              className="btn-primary w-full py-3 rounded-lg font-medium transition-all hover:shadow-md"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-background-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="Ruminster" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Welcome to Ruminster
          </h1>
          <p className="text-text-secondary">
            {isLogin ? 'Sign in to continue to your account' : 'Create an account to get started'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-1 mb-4">
              <button
                onClick={() => !isLogin && toggleMode()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLogin 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => isLogin && toggleMode()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !isLogin 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
                {isLogin ? 'Username or Email' : 'Username'}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`form-input w-full ${
                  errors.username ? 'border-border-error focus:border-border-error' : ''
                }`}
                placeholder={isLogin ? "Enter your username or email" : "Choose a username"}
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-error flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </p>
              )}
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`form-input w-full ${
                    errors.email ? 'border-border-error focus:border-border-error' : ''
                  }`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-error flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`form-input w-full ${
                  errors.password ? 'border-border-error focus:border-border-error' : ''
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-error flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`form-input w-full ${
                    errors.confirmPassword ? 'border-border-error focus:border-border-error' : ''
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-error flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
                
            {!isLogin && (
              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="acceptedTos"
                    name="acceptedTos"
                    type="checkbox"
                    required
                    className={`w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 ${
                      errors.acceptedTos ? 'border-border-error' : ''
                    }`}
                    checked={formData.acceptedTos}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptedTos" className="text-text-secondary">
                    I agree to the{' '}
                    <Link
                      to="/terms-of-service"
                      className="text-primary hover:text-primary-hover underline font-medium"
                    >
                      Terms of Service
                    </Link>
                  </label>
                  {errors.acceptedTos && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.acceptedTos}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.general && (
            <div className="rounded-lg bg-error/10 border border-error/20 p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-error mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-error font-medium">{errors.general}</div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending || signupMutation.isPending}
            className="btn-primary w-full flex justify-center items-center py-3 text-base font-medium rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(loginMutation.isPending || signupMutation.isPending) ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign in' : 'Create account'
            )}
          </button>
          
          {isLogin && (
            <div className="text-center pt-4">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-hover transition-colors font-medium"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;