import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../hooks/useAuth';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetStatus, setResetStatus] = useState<'form' | 'success' | 'error'>('form');
  const [message, setMessage] = useState<string>('');
  
  const resetPasswordMutation = useResetPassword();
  const token = searchParams.get('token');
  
  useEffect(() => {
    if (!token) {
      setResetStatus('error');
      setMessage('Invalid reset link. No token provided.');
    }
  }, [token]);
  
  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      setResetStatus('success');
      setMessage(resetPasswordMutation.data?.message || 'Password reset successfully!');
    }
    
    if (resetPasswordMutation.isError) {
      setErrors({ general: resetPasswordMutation.error?.message || 'Failed to reset password. Please try again.' });
    }
  }, [resetPasswordMutation.isSuccess, resetPasswordMutation.isError, resetPasswordMutation.data, resetPasswordMutation.error]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm() || !token) return;
    
    resetPasswordMutation.mutate({
      token,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleLoginRedirect = () => {
    navigate('/login');
  };
  
  if (resetStatus === 'error' && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="card text-center">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              Invalid Reset Link
            </h2>
            <div className="mt-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-text-secondary mb-6">
                {message}
              </p>
              <button
                onClick={handleLoginRedirect}
                className="btn-primary w-full"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (resetStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="card text-center">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              Password Reset Successful
            </h2>
            <div className="mt-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-text-secondary mb-6">
                {message}
              </p>
              <button
                onClick={handleLoginRedirect}
                className="btn-primary w-full"
              >
                Continue to Login
              </button>
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Enter your new password below
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className={`form-input w-full ${
                  errors.newPassword ? 'border-border-error' : ''
                }`}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-error">{errors.newPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`form-input w-full ${
                  errors.confirmPassword ? 'border-border-error' : ''
                }`}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {errors.general && (
            <div className="rounded-md bg-error/10 border border-error/20 p-4">
              <div className="text-sm text-error">{errors.general}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="btn-primary w-full flex justify-center py-3"
            >
              {resetPasswordMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="text-sm text-accent hover:text-primary transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
