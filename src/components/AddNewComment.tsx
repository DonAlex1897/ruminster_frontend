import React, { useMemo, useState } from 'react';
import { useAddComment } from '../hooks/useComments';
import { PostCommentDto } from '../types/comment';
import UserAvatar from './UserAvatar';
import { useAuth } from '../AuthContext';

interface AddNewCommentProps {
  ruminationId: number;
  parentCommentId?: number;
  onCommentAdded?: () => void;
  placeholder?: string;
}

export default function AddNewComment({ 
  ruminationId, 
  parentCommentId, 
  onCommentAdded, 
  placeholder = 'Write your comment',
}: AddNewCommentProps) {
  const { user } = useAuth();
  const userId = useMemo(() => user?.id, [user]);
  const [commentText, setCommentText] = useState('');
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

  if (!userId) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl" onClick={(e) => e.stopPropagation()}>
      <UserAvatar 
        userId={userId} 
  name={(user as any)?.name}
        username={user.username}
        size="sm" 
        showUsername={false}
        clickable={false}
        className="shadow-lg"
      />
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
