import React from 'react';
import { usePublicRuminations } from '../hooks/useRuminations';
import RuminationCard from '../components/RuminationCard';

export default function PublicPage() {
  const { 
    data: ruminations = [], 
    isLoading: loading, 
    error 
  } = usePublicRuminations();



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
          {error instanceof Error ? error.message : 'Failed to fetch public ruminations'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {ruminations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No public ruminations available.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {ruminations.map((rumination) => (
            <RuminationCard
              key={rumination.id}
              rumination={rumination}
              showUserInfo={true}
              showComments={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
