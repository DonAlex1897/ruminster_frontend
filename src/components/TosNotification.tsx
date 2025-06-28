import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

interface TosStatus {
  hasAcceptedLatest: boolean;
  currentVersion: string;
  requiresAcceptance: boolean;
}

const TosNotification: React.FC = () => {
  const [tosStatus, setTosStatus] = useState<TosStatus | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkTosStatus();
    }
  }, [isAuthenticated]);

  const checkTosStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://localhost:5001'}/api/TermsOfService/acceptance-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const status = await response.json();
        setTosStatus(status);
        if (status.requiresAcceptance) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to check TOS status:', error);
    }
  };

  const acceptTos = async () => {
    if (!tosStatus?.currentVersion) return;
    
    setIsAccepting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://localhost:5001'}/api/TermsOfService/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ version: tosStatus.currentVersion })
      });

      if (response.ok) {
        setTosStatus(prev => prev ? { ...prev, hasAcceptedLatest: true, requiresAcceptance: false } : null);
        setShowModal(false);
      } else {
        console.error('Failed to accept TOS');
      }
    } catch (error) {
      console.error('Error accepting TOS:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isAuthenticated || !tosStatus?.requiresAcceptance || !showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              Updated Terms of Service
            </h3>
          </div>
          
          <p className="text-text-secondary mb-4">
            Our Terms of Service have been updated (Version {tosStatus.currentVersion}). 
            Please review and accept the new terms to continue using Ruminster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex-1 text-center"
            >
              Review Terms
            </a>
            <button
              onClick={acceptTos}
              disabled={isAccepting}
              className="btn-primary flex-1"
            >
              {isAccepting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Accepting...
                </div>
              ) : (
                'Accept Terms'
              )}
            </button>
          </div>
          
          <p className="text-xs text-text-secondary mt-3 text-center">
            You must accept the updated terms to continue using the service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TosNotification;
