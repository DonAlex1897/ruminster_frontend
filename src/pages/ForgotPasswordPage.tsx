import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useAuth';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const forgotPasswordMutation = useForgotPassword();
  
  useEffect(() => {
    if (forgotPasswordMutation.isSuccess) {
      setIsSuccess(true);
    }
    
    if (forgotPasswordMutation.isError) {
      setErrors({ general: forgotPasswordMutation.error?.message || 'Failed to send reset email. Please try again.' });
    }
  }, [forgotPasswordMutation.isSuccess, forgotPasswordMutation.isError, forgotPasswordMutation.error]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;
    
    forgotPasswordMutation.mutate({ email });
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="card text-center">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              Check Your Email
            </h2>
            <div className="mt-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-text-secondary mb-6">
                We've sent a password reset link to <strong>{email}</strong>.
                Check your email and follow the link to reset your password.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="btn-primary w-full block text-center"
                >
                  Back to Login
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                    setErrors({});
                  }}
                  className="text-sm text-accent hover:text-primary transition-colors"
                >
                  Send another email
                </button>
              </div>
            </div>
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
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
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
              disabled={forgotPasswordMutation.isPending}
              className="btn-primary w-full flex justify-center py-3"
            >
              {forgotPasswordMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-accent hover:text-primary transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
