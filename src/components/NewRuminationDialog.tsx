import React, { useState } from 'react';
import { UserRelationType } from '../types/rumination';
import { useCreateRumination } from '../hooks/useRuminations';

interface NewRuminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewRuminationDialog({ isOpen, onClose, onSuccess }: NewRuminationDialogProps) {
  const [content, setContent] = useState('');
  const [selectedAudiences, setSelectedAudiences] = useState<UserRelationType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createRuminationMutation = useCreateRumination();

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
      setContent('');
      setSelectedAudiences([]);
      onSuccess();
    } catch (error) {
      console.error('Failed to create rumination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setSelectedAudiences([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg p-4 sm:p-6 w-full max-w-md sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Ruminate
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base leading-relaxed"
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audience (optional)
            </label>
            <div className="grid grid-cols-2 gap-2 sm:space-y-2 sm:grid-cols-1">
              {audienceOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAudiences.includes(option.value)}
                    onChange={() => handleAudienceToggle(option.value)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
            <button
              onClick={() => handleSubmit(false)}
              disabled={!content.trim() || isSubmitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={!content.trim() || isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
