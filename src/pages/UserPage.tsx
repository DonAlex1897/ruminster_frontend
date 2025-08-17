import { useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';
import UserRelations from '../components/UserRelations';
import { useUserRuminations } from '../hooks/useRuminations';
import { UserRelationType } from '../types/rumination';
import { useUser } from '../hooks/useUser';

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { data: userProfile, isLoading: isUserLoading, error: userError } = useUser(userId);
  const displayName = (userProfile as any)?.name || userProfile?.username || 'Unknown User';
  const [showPublicOnly, setShowPublicOnly] = useState(true);

  const { 
    data: ruminations = [], 
    isLoading, 
    error 
  } = useUserRuminations(userId!, { isPublic: showPublicOnly });
  const query = useMemo(() => new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '', [location.search]);
  const filtered = useMemo(() => {
    if (!query) return ruminations;
    return ruminations.filter(r => r.content.toLowerCase().includes(query));
  }, [ruminations, query]);

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
      <div className="flex items-center justify-start mb-8">
        <div className="flex items-center space-x-6">
          <UserAvatar 
            userId={userId} 
            name={(userProfile as any)?.name}
            username={userProfile?.username || ''} 
            size="lg" 
            showUsername={false}
            clickable={false}
            className="shadow-lg"
          />
          <div className="flex flex-col space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayName}
              </h1>
              {userProfile?.username && (
                <p className="text-gray-500 dark:text-gray-400">@{userProfile.username}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400">
                {filtered.length} rumination{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* User Relations */}
      <UserRelations userId={userId} />

      {/* Tabs: Public / All Visible (above ruminations list) */}
      <div className="w-full mt-6">
        <nav className="w-full mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700" aria-label="Ruminations tabs">
          <div className="grid grid-cols-2 w-full" role="tablist" aria-orientation="horizontal">
            <button
              type="button"
              role="tab"
              aria-selected={showPublicOnly}
              onClick={() => setShowPublicOnly(true)}
              className={`-mb-px w-full text-center whitespace-nowrap py-2 px-3 sm:px-4 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                showPublicOnly
                  ? 'border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
              }`}
            >
              Public
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!showPublicOnly}
              onClick={() => setShowPublicOnly(false)}
              className={`-mb-px w-full text-center whitespace-nowrap py-2 px-3 sm:px-4 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                !showPublicOnly
                  ? 'border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
              }`}
            >
              All Visible
            </button>
          </div>
        </nav>
      </div>

      {/* Ruminations List */}
    {filtered.length === 0 ? (
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
      {filtered.map((rumination) => (
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
