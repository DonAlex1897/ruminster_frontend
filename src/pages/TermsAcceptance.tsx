import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getCurrentTos, acceptTos } from '../services/TosService';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';

const TermsAcceptance: React.FC = () => {
  const { token, latestTosVersion, updateTosAcceptance, logout } = useAuth();
  const [hasAccepted, setHasAccepted] = useState(false);

  const { data: tosData, isLoading: isLoadingTos, error: tosError } = useQuery({
    queryKey: ['currentTos'],
    queryFn: getCurrentTos,
  });

  const acceptTosMutation = useMutation({
    mutationFn: (version: string) => acceptTos({ version }, token!),
    onSuccess: () => {
      updateTosAcceptance(true);
    },
    onError: (error) => {
      console.error('Failed to accept TOS:', error);
      alert('Failed to accept Terms of Service. Please try again.');
    },
  });

  const handleAccept = () => {
    if (!hasAccepted) {
      alert('Please check the acceptance checkbox before proceeding.');
      return;
    }

    const versionToAccept = latestTosVersion || tosData?.version;
    if (versionToAccept) {
      acceptTosMutation.mutate(versionToAccept);
    }
  };

  const handleDecline = () => {
    logout();
  };

  if (isLoadingTos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Terms of Service...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tosError || !tosData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">
              Failed to load Terms of Service. Please try again later.
            </p>
            <button
              onClick={handleDecline}
              className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-card-foreground">
              Terms of Service Update Required
            </h1>
            <p className="text-muted-foreground mt-2">
              Our Terms of Service have been updated. Please review and accept the new terms to continue using the service.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Version: {tosData.version} | Updated: {new Date(tosData.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="p-6">
            <div className="border border-border rounded-md p-4 max-h-96 overflow-y-auto bg-muted/30">
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                <ReactMarkdown>{tosData.content}</ReactMarkdown>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-start space-x-3 mb-6">
                <input
                  type="checkbox"
                  id="accept-tos"
                  checked={hasAccepted}
                  onChange={(e) => setHasAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded accent-primary"
                />
                <label htmlFor="accept-tos" className="text-sm text-card-foreground cursor-pointer">
                  I have read, understood, and agree to be bound by these Terms of Service (Version {tosData.version}).
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAccept}
                  disabled={!hasAccepted || acceptTosMutation.isPending}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {acceptTosMutation.isPending ? 'Accepting...' : 'Accept and Continue'}
                </button>
                <button
                  onClick={handleDecline}
                  disabled={acceptTosMutation.isPending}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 px-6 rounded-md hover:bg-secondary/80 disabled:opacity-50 transition-colors font-medium"
                >
                  Decline and Logout
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                If you decline these terms, you will be logged out and unable to use the service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAcceptance;
