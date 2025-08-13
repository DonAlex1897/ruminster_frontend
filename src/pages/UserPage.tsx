import { useState } from 'react';
import { useParams } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';
import UserRelations from '../components/UserRelations';
import { useUserRuminations } from '../hooks/useRuminations';
import { UserRelationType } from '../types/rumination';
import { useUser } from '../hooks/useUser';

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: userProfile, isLoading: isUserLoading, error: userError } = useUser(userId);
  const username = userProfile?.username || 'Unknown User';
  const [showPublicOnly, setShowPublicOnly] = useState(true);

  const { 
    data: ruminations = [], 
    isLoading, 
    error 
  } = useUserRuminations(userId!, { isPublic: showPublicOnly });

  const getAudienceLabels = (audiences: { relationType: UserRelationType }[]) => {
    const labels = audiences.map(a => {
      switch (a.relationType) {
        case UserRelationType.Acquaintance: return 'Acquaintance';
        case UserRelationType.Family: return 'Family';
        case UserRelationType.Friend: return 'Friend';
        case UserRelationType.BestFriend: return 'Best Friend';
        case UserRelationType.Partner: return 'Partner';
        case UserRelationType.Therapist: return 'Therapist';
        default: return 'Unknown';
      }
    });
    return labels.join(', ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Invalid user ID</p>
      </div>
    );
  }

  if (isLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || userError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          {error instanceof Error ? error.message : userError instanceof Error ? userError.message : 'Failed to fetch data'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* User Avatar Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          <UserAvatar 
            userId={userId} 
            username={username} 
            size="lg" 
            showUsername={false}
            clickable={false}
            className="shadow-lg"
          />
          <div className="flex flex-col space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {username}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {ruminations.length} rumination{ruminations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        
        {/* Public/Private Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setShowPublicOnly(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showPublicOnly
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setShowPublicOnly(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showPublicOnly
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Visible
          </button>
        </div>
      </div>
      {/* User Relations */}
      <UserRelations userId={userId} />

      {/* Ruminations List */}
      {ruminations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {showPublicOnly 
              ? "No public ruminations to display."
              : "No ruminations visible to you."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {ruminations.map((rumination) => (
            <div
              key={rumination.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rumination.isPublished
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {rumination.isPublished ? 'Published' : 'Draft'}
                  </span>
                  {rumination.audiences.length > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {getAudienceLabels(rumination.audiences)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(rumination.createTms)}
                </span>
              </div>
              
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {rumination.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
