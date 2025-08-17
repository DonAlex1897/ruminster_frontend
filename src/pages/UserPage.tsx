import { useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';
import UserRelations from '../components/UserRelations';
import { useFeedRuminations, useUserRuminations } from '../hooks/useRuminations';
import { useUser } from '../hooks/useUser';
import RuminationCard from '../components/RuminationCard';

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { data: userProfile, isLoading: isUserLoading, error: userError } = useUser(userId);
  const displayName = (userProfile as any)?.name || userProfile?.username || 'Unknown User';
  const [showPublicOnly, setShowPublicOnly] = useState(true);

  // Public ruminations made by this user
  const { 
    data: publicRuminations = [], 
    isLoading: loadingPublic, 
    error: errorPublic 
  } = useUserRuminations(userId!);

  // Ruminations created by this user and shared with the current viewer (feed filtered by userId)
  const {
    data: sharedWithMe = [],
    isLoading: loadingShared,
    error: errorShared,
  } = useFeedRuminations({ userId: userId! });

  const activeList = showPublicOnly ? publicRuminations : sharedWithMe;
  const query = useMemo(() => new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '', [location.search]);
  const filtered = useMemo(() => {
    if (!query) return activeList;
    return activeList.filter(r => r.content.toLowerCase().includes(query));
  }, [activeList, query]);

  // Cards now reuse shared RuminationCard component like other pages.

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Invalid user ID</p>
      </div>
    );
  }

  if (isUserLoading || (showPublicOnly ? loadingPublic : loadingShared)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userError || (showPublicOnly ? errorPublic : errorShared)) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          {userError instanceof Error
            ? userError.message
            : (showPublicOnly
                ? (errorPublic instanceof Error ? errorPublic.message : 'Failed to fetch public ruminations')
                : (errorShared instanceof Error ? errorShared.message : 'Failed to fetch shared ruminations'))}
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

  {/* Tabs: Public / Shared with Me */}
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
              Shared with Me
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
              : "No ruminations shared with you."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((rumination) => (
            <RuminationCard
              key={rumination.id}
              rumination={{
                ...rumination,
                audiences: rumination.audiences || [],
              }}
              showUserInfo={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
