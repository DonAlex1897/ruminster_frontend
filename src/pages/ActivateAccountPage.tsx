import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useActivateAccount } from '../hooks/useAuth';

const ActivateAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activationStatus, setActivationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  
  const activateAccountMutation = useActivateAccount();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setActivationStatus('error');
      setMessage('Invalid activation link. No token provided.');
      return;
    }
    
    activateAccountMutation.mutate(token);
  }, [searchParams, activateAccountMutation]);
  
  useEffect(() => {
    if (activateAccountMutation.isSuccess) {
      setActivationStatus('success');
      setMessage(activateAccountMutation.data?.message || 'Account activated successfully!');
    }
    
    if (activateAccountMutation.isError) {
      setActivationStatus('error');
      setMessage(activateAccountMutation.error?.message || 'Failed to activate account. Please try again.');
    }
  }, [activateAccountMutation.isSuccess, activateAccountMutation.isError, activateAccountMutation.data, activateAccountMutation.error]);
  
  const handleLoginRedirect = () => {
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Account Activation
          </h2>
          
          <div className="mt-8">
            {activationStatus === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-text-secondary">Activating your account...</p>
              </div>
            )}
            
            {activationStatus === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
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
                <div>
                  <h3 className="text-lg font-medium text-green-600 mb-2">
                    Success!
                  </h3>
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
            )}
            
            {activationStatus === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
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
                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">
                    Activation Failed
                  </h3>
                  <p className="text-text-secondary mb-6">
                    {message}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleLoginRedirect}
                      className="btn-primary w-full"
                    >
                      Go to Login
                    </button>
                    <p className="text-sm text-text-secondary">
                      If you continue to have issues, please contact support.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccountPage;
