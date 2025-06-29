import React, { useState } from 'react';
import { useAddComment } from '../hooks/useComments';
import { useAuth } from '../AuthContext';
import { PostCommentDto } from '../types/comment';

interface AddNewCommentProps {
  ruminationId: number;
  parentCommentId?: number;
  onCommentAdded?: () => void;
  placeholder?: string;
  variant?: 'inline' | 'form';
}

export default function AddNewComment({ 
  ruminationId, 
  parentCommentId, 
  onCommentAdded, 
  placeholder = 'Write your comment',
  variant = 'inline'
}: AddNewCommentProps) {
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  const { mutateAsync: addComment, isPending: isAddingComment } = useAddComment();

  const handleSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!commentText.trim()) return;

    try {
      const commentDto: PostCommentDto = {
        content: commentText.trim(),
        ruminationId: ruminationId,
        ...(parentCommentId && { parentCommentId }),
      };
      
      await addComment(commentDto);
      setCommentText('');
      onCommentAdded?.();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (variant === 'form') {
    return (
      <div className="mb-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
          rows={3}
          disabled={isAddingComment}
        />
        <div className="flex justify-end space-x-2 mt-2">
          <button
            type="button"
            onClick={() => onCommentAdded?.()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!commentText.trim() || isAddingComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
          disabled={isAddingComment}
          className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none text-sm disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!commentText.trim() || isAddingComment}
          className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400 dark:disabled:text-gray-500 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {isAddingComment ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
