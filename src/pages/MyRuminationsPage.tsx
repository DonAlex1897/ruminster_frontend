import { useMemo, useState } from 'react';
import { useMyRuminations } from '../hooks/useRuminations';
import { RuminationResponse } from '../types/rumination';
import RuminationCard from '../components/RuminationCard';
import EditRuminationDialog from '../components/EditRuminationDialog';
import DeleteRuminationDialog from '../components/DeleteRuminationDialog';
import UserAvatar from '../components/UserAvatar';
import { useAuth } from '../AuthContext';

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

  const { user } = useAuth();
  const userId = useMemo(() => user?.id, [user]);

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
    <div className="max-w-3xl mx-auto p-6">
      {/* User Avatar Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-6">
          <UserAvatar 
            userId={userId} 
            username={user?.username || 'Unknown User'} 
            size="md" 
            showUsername={false}
            clickable={false}
            className="shadow-lg sm:w-16 sm:h-16"
          />
          <div className="flex flex-col space-y-1 sm:space-y-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {user?.username || 'Unknown User'}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {ruminations.length} {showPublished ? 'published' : 'draft'} rumination{ruminations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        
        {/* Public/Private Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 sm:p-1">
          <button
            onClick={() => setShowPublished(true)}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              showPublished
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setShowPublished(false)}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              !showPublished
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto py-6">
        {filteredRuminations.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              {/* Empty State Icon */}
              <div className="mx-auto h-20 w-20 text-text-muted mb-6">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {showPublished ? "No published ruminations" : "No draft ruminations"}
              </h3>
              <p className="text-text-secondary mb-6">
                {showPublished 
                  ? "Start sharing your thoughts with the world."
                  : "Save your ideas as drafts to perfect them."
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ruminations Grid */}
            <div className="grid gap-6">
              {filteredRuminations.map((rumination) => (
                <RuminationCard
                  key={rumination.id}
                  rumination={rumination}
                  variant="editable"
                  onClick={() => handleEditRumination(rumination)}
                  onDelete={(e) => handleDeleteRumination(rumination, e)}
                  showUserInfo={false}
                  showComments={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
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
