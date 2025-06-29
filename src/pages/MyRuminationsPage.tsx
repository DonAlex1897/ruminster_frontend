import { useState } from 'react';
import { useMyRuminations } from '../hooks/useRuminations';
import { RuminationResponse } from '../types/rumination';
import RuminationCard from '../components/RuminationCard';
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
        <div className="space-y-8">
          {filteredRuminations.map((rumination) => (
            <RuminationCard
              key={rumination.id}
              rumination={rumination}
              variant="editable"
              onClick={() => handleEditRumination(rumination)}
              onDelete={(e) => handleDeleteRumination(rumination, e)}
              showUserInfo={false}
            />
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
