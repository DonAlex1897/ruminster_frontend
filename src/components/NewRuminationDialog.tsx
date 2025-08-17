import React, { useState } from 'react';
import { UserRelationType } from '../types/rumination';
import { useCreateRumination } from '../hooks/useRuminations';
import { useDraftPersistence } from '../hooks/useDraftPersistence';

interface NewRuminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewRuminationDialog({ isOpen, onClose, onSuccess }: NewRuminationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createRuminationMutation = useCreateRumination();
  
  const {
    content,
    setContent,
    selectedAudiences,
    setSelectedAudiences,
    clearDraft,
    hasDraft,
    isDraftRestored
  } = useDraftPersistence('new-rumination');

  const handleNewRumination = async (content: string, audiences: UserRelationType[], publish: boolean) => {
    await createRuminationMutation.mutateAsync({
      content,
      audiences: audiences.length > 0 ? audiences : undefined,
      publish
    });
  };

  const audienceOptions = [
    { value: UserRelationType.Acquaintance, label: 'Acquaintance' },
    { value: UserRelationType.Family, label: 'Family' },
    { value: UserRelationType.Friend, label: 'Friend' },
    { value: UserRelationType.BestFriend, label: 'Best Friend' },
    { value: UserRelationType.Partner, label: 'Partner' },
    { value: UserRelationType.Therapist, label: 'Therapist' },
  ];

  const handleAudienceToggle = (audience: UserRelationType) => {
    setSelectedAudiences(prev => 
      prev.includes(audience) 
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  const handleSubmit = async (publish: boolean) => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await handleNewRumination(content, selectedAudiences, publish);
      clearDraft(); // Clear the saved draft after successful submission
      onSuccess();
    } catch (error) {
      console.error('Failed to create rumination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Don't clear draft when closing, let it persist
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ruminate
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Share your thoughts with your selected audience
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Draft Restored Indicator */}
          {isDraftRestored && hasDraft() && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Draft restored - your previous work has been saved
                </span>
                <button
                  onClick={clearDraft}
                  className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
                >
                  Clear draft
                </button>
              </div>
            </div>
          )}

          {/* Text Input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="What's on your mind? Share your feelings, thoughts, or experiences..."
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {content.length} characters
            </div>
          </div>

          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Target Audience
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                {audienceOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAudiences.includes(option.value)}
                      onChange={() => handleAudienceToggle(option.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {selectedAudiences.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  No audience selected - rumination will be public
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={!content.trim() || isSubmitting}
              className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 py-2.5 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={!content.trim() || isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
