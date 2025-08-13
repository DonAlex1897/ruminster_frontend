import { useState, useEffect, useRef, useMemo } from 'react';
import { UserRelationType, RuminationResponse } from '../types/rumination';
import { useUpdateRumination } from '../hooks/useRuminations';

interface EditRuminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rumination: RuminationResponse | null;
}

export default function EditRuminationDialog({ isOpen, onClose, onSuccess, rumination }: EditRuminationDialogProps) {
  const [content, setContent] = useState('');
  const [selectedAudiences, setSelectedAudiences] = useState<UserRelationType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateRuminationMutation = useUpdateRumination();

  useEffect(() => {
    if (rumination) {
      setContent(rumination.content);
      setSelectedAudiences(rumination.audiences?.map(a => a.relationType) || []);
    }
  }, [rumination]);

  // Auto-resize textarea when content changes
  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      resizeTextarea();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [content]);

  // Also resize when the dialog opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      const timer = setTimeout(() => {
        resizeTextarea();
      }, 100); // Small delay to ensure the dialog is fully rendered
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      onSuccess();
    } catch (error) {
      console.error('Failed to update rumination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (rumination) {
      setContent(rumination.content);
      setSelectedAudiences(rumination.audiences?.map(a => a.relationType) || []);
    }
    onClose();
  };

  const isNotModified = useMemo(() => {
    return content === rumination?.content &&
           selectedAudiences.length === (rumination?.audiences?.length || 0) &&
           selectedAudiences.every(a => rumination?.audiences?.some(r => r.relationType === a));
  }, [content, selectedAudiences, rumination]);

  if (!isOpen || !rumination) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
          {/* Text Input */}
          <div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                // Immediate resize on input
                setTimeout(() => resizeTextarea(), 0);
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
