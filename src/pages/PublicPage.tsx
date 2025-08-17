import React, { useMemo } from 'react';
import { usePublicRuminations } from '../hooks/useRuminations';
import RuminationCard from '../components/RuminationCard';
import { useLocation } from 'react-router-dom';

export default function PublicPage() {
  const location = useLocation();
  const { 
    data: ruminations = [], 
    isLoading: loading, 
    error 
  } = usePublicRuminations();
  const query = useMemo(() => new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '', [location.search]);
  const filtered = useMemo(() => {
    if (!query) return ruminations;
    return ruminations.filter(r => r.content.toLowerCase().includes(query) || (r.createdBy?.username || '').toLowerCase().includes(query) || (r.createdBy as any)?.name?.toLowerCase?.().includes(query));
  }, [ruminations, query]);


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
    {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No public ruminations available.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
      {filtered.map((rumination) => (
            <RuminationCard
              key={rumination.id}
              rumination={rumination}
              showUserInfo={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
