import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserName } from '../services/UserService';
import { useAuth } from '../AuthContext';

interface NameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NameChangeModal: React.FC<NameChangeModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: (updatedUser) => {
      // Update the auth context user data
      queryClient.invalidateQueries({ queryKey: ['validateToken'] });
      onClose();
      setName('');
      setError('');
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    mutation.mutate(name.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Change Your Name
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Current Name: {user?.name}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={mutation.isPending}
            />
          </div>
          
          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              disabled={mutation.isPending || !name.trim()}
            >
              {mutation.isPending ? 'Updating...' : 'Update Name'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
