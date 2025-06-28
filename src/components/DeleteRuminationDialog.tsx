import React, { useState } from 'react';
import { RuminationResponse } from '../types/rumination';
import { useDeleteRumination } from '../hooks/useRuminations';

interface DeleteRuminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rumination: RuminationResponse | null;
}

export default function DeleteRuminationDialog({ isOpen, onClose, onSuccess, rumination }: DeleteRuminationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteRuminationMutation = useDeleteRumination();

  const handleDelete = async () => {
    if (!rumination) return;
    
    setIsDeleting(true);
    try {
      await deleteRuminationMutation.mutateAsync(rumination.id.toString());
      onSuccess();
    } catch (error) {
      console.error('Failed to delete rumination:', error);
      alert('Failed to delete rumination. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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

  if (!isOpen || !rumination) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg p-4 sm:p-6 w-full max-w-md sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
            Delete Rumination
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            disabled={isDeleting}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Are you sure you want to delete this rumination?
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                rumination.isPublished
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              }`}>
                {rumination.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(rumination.createTMS)}
              </span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap line-clamp-3">
              {rumination.content}
            </p>
          </div>

          <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:disabled:bg-gray-700 dark:text-gray-300 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
