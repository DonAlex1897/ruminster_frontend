import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserName } from '../services/UserService';
import { useAuth } from '../AuthContext';

interface NameChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NameChangeDialog: React.FC<NameChangeDialogProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Initialize input with current user name when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName((user?.name as string) || '');
      setError('');
    }
  }, [isOpen, user?.name]);

  const isUnchanged = useMemo(() => {
    return name.trim() === (user?.name || '').trim();
  }, [name, user?.name]);

  const validate = (value: string) => {
    const v = value.trim();
    if (!v) return 'Name cannot be empty';
    if (v.length < 2) return 'Name must be at least 2 characters';
    if (v.length > 50) return 'Name must be 50 characters or fewer';
    return '';
  };

  const mutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: () => {
      // Refresh validated user in auth context
      queryClient.invalidateQueries({ queryKey: ['validateToken'] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to update name');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationMessage = validate(name);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    if (isUnchanged) return;
    mutation.mutate(name.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="name-change-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 id="name-change-title" className="text-xl font-semibold text-gray-900 dark:text-white">Update display name</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This is how others will see you across Ruminster.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Alex Johnson"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
              disabled={mutation.isPending}
              maxLength={50}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">2–50 characters. You can change this anytime.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{name.trim().length}/50</p>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}
        {/* Footer */}
        <div className="px-1 py-3 dark:border-gray-700 rounded-b-xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
            disabled={mutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            disabled={mutation.isPending || !name.trim() || isUnchanged || !!validate(name)}
          >
            {mutation.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
       </form>
      </div>
    </div>
  );
};
