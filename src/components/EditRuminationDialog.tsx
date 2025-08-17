import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { UserRelationType, RuminationResponse } from '../types/rumination';
import { useUpdateRumination } from '../hooks/useRuminations';
import { useDraftPersistence } from '../hooks/useDraftPersistence';

interface EditRuminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rumination: RuminationResponse | null;
}

export default function EditRuminationDialog({ isOpen, onClose, onSuccess, rumination }: EditRuminationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateRuminationMutation = useUpdateRumination();

  // Use draft persistence with rumination-specific key
  const draftKey = rumination ? `edit-rumination-${rumination.id}` : 'edit-rumination-temp';
  const initialContent = rumination?.content || '';
  const initialAudiences = useMemo(() => 
    rumination?.audiences?.map(a => a.relationType) || [], 
    [rumination?.audiences]
  );
  
  const {
    content,
    setContent,
    selectedAudiences,
    setSelectedAudiences,
    clearDraft,
    resetToInitial
  } = useDraftPersistence(draftKey, initialContent, initialAudiences);

  // Reset to initial values when rumination changes
  useEffect(() => {
    if (rumination && isOpen) {
      resetToInitial();
    }
  }, [rumination, isOpen, resetToInitial]);

  // Auto-resize textarea function
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  // Resize on content change
  useLayoutEffect(() => {
    resizeTextarea();
  }, [content, resizeTextarea]);

  // Resize when dialog becomes visible
  useLayoutEffect(() => {
    if (isOpen) {
      resizeTextarea();
    }
  }, [isOpen, resizeTextarea]);

  const handleUpdateRumination = async (content: string, audiences: UserRelationType[], publish: boolean) => {
    if (!rumination) return;
    
    await updateRuminationMutation.mutateAsync({
      id: rumination.id,
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
    if (!content.trim() || !rumination) return;
    
    setIsSubmitting(true);
    try {
      await handleUpdateRumination(content, selectedAudiences, publish);
      clearDraft(); // Clear the saved draft after successful submission
      onSuccess();
    } catch (error) {
      console.error('Failed to update rumination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Don't reset content when closing, let draft persist
    onClose();
  };

  const isNotModified = useMemo(() => {
    return content === rumination?.content &&
           selectedAudiences.length === (rumination?.audiences?.length || 0) &&
           selectedAudiences.every(a => rumination?.audiences?.some(r => r.relationType === a));
  }, [content, selectedAudiences, rumination]);

  const hasChanges = useMemo(() => {
    return content !== initialContent ||
           selectedAudiences.length !== initialAudiences.length ||
           !selectedAudiences.every(a => initialAudiences.includes(a));
  }, [content, selectedAudiences, initialContent, initialAudiences]);

  if (!isOpen || !rumination) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Rumination
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update your thoughts and audience settings
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
          {/* Draft Indicator */}
          {hasChanges && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  You have unsaved changes
                </span>
                <button
                  onClick={() => {
                    resetToInitial();
                    clearDraft();
                  }}
                  className="ml-auto text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 underline"
                >
                  Reset to original
                </button>
              </div>
            </div>
          )}

          {/* Text Input */}
          <div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              rows={4}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 min-h-[6rem] max-h-96 overflow-y-auto"
              placeholder="What's on your mind? Share your thoughts..."
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
                {audienceOptions.map((option) => {
                  const isChecked = selectedAudiences.includes(option.value);
                  return (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAudienceToggle(option.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
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
              disabled={!content.trim() || isSubmitting || isNotModified}
              className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 py-2.5 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={!content.trim() || isSubmitting || isNotModified}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? 'Publishing...' : 'Update & Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
