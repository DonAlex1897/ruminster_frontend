import { useState } from 'react';
import { useMyRuminations } from '../hooks/useRuminations';
import { UserRelationType, RuminationResponse } from '../types/rumination';
import EditRuminationDialog from '../components/EditRuminationDialog';
import DeleteRuminationDialog from '../components/DeleteRuminationDialog';

export default function MyRuminationsPage() {
  const [showPublished, setShowPublished] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRumination, setSelectedRumination] = useState<RuminationResponse | null>(null);

  const { 
    data: ruminations = [], 
    isLoading: loading, 
    error 
  } = useMyRuminations({ isPublic: showPublished });

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

  const handleEditRumination = (rumination: RuminationResponse) => {
    setSelectedRumination(rumination);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRumination(null);
  };

  const handleEditSuccess = () => {
    handleCloseEditDialog();
    // Refetch will happen automatically due to query invalidation
  };

  const handleDeleteRumination = (rumination: RuminationResponse, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setSelectedRumination(rumination);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedRumination(null);
  };

  const handleDeleteSuccess = () => {
    handleCloseDeleteDialog();
    // Refetch will happen automatically due to query invalidation
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
          {error instanceof Error ? error.message : 'Failed to fetch ruminations'}
        </p>
      </div>
    );
  }

  const filteredRuminations = ruminations;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md font-bold text-gray-900 dark:text-white">
          My Ruminations
        </h1>
        
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setShowPublished(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showPublished
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setShowPublished(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showPublished
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {filteredRuminations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {showPublished 
              ? "You haven't published any ruminations yet."
              : "You don't have any draft ruminations."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRuminations.map((rumination) => (
            <div
              key={rumination.id}
              onClick={() => handleEditRumination(rumination)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(rumination.createTMS)}
                  </span>
                  <button
                    onClick={(e) => handleDeleteRumination(rumination, e)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete rumination"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {rumination.content}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <EditRuminationDialog
        isOpen={editDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
        rumination={selectedRumination}
      />
      
      <DeleteRuminationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSuccess={handleDeleteSuccess}
        rumination={selectedRumination}
      />
    </div>
  );
}
