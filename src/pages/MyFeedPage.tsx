import { UserRelationType } from '../types/rumination';
import { useFeedRuminations } from '../hooks/useRuminations';
import UserAvatar from '../components/UserAvatar';

export default function MyFeedPage() {
  const { 
    data: ruminations = [], 
    isLoading: loading, 
    error 
  } = useFeedRuminations();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          {error instanceof Error ? error.message : 'Failed to fetch feed'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-md font-bold text-gray-900 dark:text-white mb-6">
        My Feed
      </h1>

      {ruminations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No ruminations in your feed yet.
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
                <div className="flex items-center space-x-3">
                  <UserAvatar
                    userId={rumination.createdBy.id}
                    username={rumination.createdBy.username}
                    size="sm"
                    showUsername={true}
                  />
                  {rumination.audiences.length > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {getAudienceLabels(rumination.audiences)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(rumination.createTMS)}
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
