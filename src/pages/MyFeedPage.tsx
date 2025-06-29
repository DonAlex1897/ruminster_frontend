import { useFeedRuminations } from '../hooks/useRuminations';
import RuminationCard from '../components/RuminationCard';

export default function MyFeedPage() {
  const { 
    data: ruminations = [], 
    isLoading: loading, 
    error 
  } = useFeedRuminations();



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
        <div className="space-y-8">
          {ruminations.map((rumination) => (
            <RuminationCard
              key={rumination.id}
              rumination={{
                ...rumination,
                audiences: rumination.audiences || []
              }}
              showUserInfo={true}
              showComments={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
