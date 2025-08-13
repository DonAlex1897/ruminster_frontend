import React, { useMemo, useState } from 'react';
import { CommentResponse, UpdateCommentDto } from '../types/comment';
import { useComments, useUpdateComment, useDeleteComment, useCommentReplies } from '../hooks/useComments';
import { useAuth } from '../AuthContext';
import AddNewComment from './AddNewComment';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

interface CommentsProps {
  ruminationId: number;
}

interface CommentItemProps {
  ruminationId: number;
  comment: CommentResponse;
  onReply: (parentCommentId: number) => void;
  onEdit: (comment: CommentResponse) => void;
  onDelete: (commentId: number) => void;
  currentUserId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ ruminationId, comment, onReply, onEdit, onDelete, currentUserId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useAuth();
  const { data: replies } = useCommentReplies(comment.id, comment.childComments.length > 0);
  const childComments = useMemo(() => {
    return comment.childComments.length > 0 ? comment.childComments : replies;
  }, [replies, comment.childComments]);

  const canEdit = currentUserId === comment.createdBy.id;
  const isDeleted = comment.isDeleted;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {comment.createdBy.username}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(comment.createTms).toLocaleDateString()}
            </span>
          </div>
          {canEdit && !isDeleted && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(comment)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
              >
                <PencilIcon className="inline-block w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm"
              >
                <TrashIcon className="inline-block w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <p className={`text-gray-700 dark:text-gray-300 mb-2 ${isDeleted ? 'italic text-gray-500' : ''}`}>
          {comment.content}
        </p>
        
        {user && !isDeleted && (
          <AddNewComment ruminationId={ruminationId} parentCommentId={comment.id} />
        )}
        
        {childComments && childComments.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
            >
              {showReplies ? 'Hide' : 'Show'} {childComments.length} replies
            </button>
            
            {showReplies && (
              <div className="mt-3">
                {childComments && childComments.length > 0 && childComments.map(childComment => (
                  <CommentItem
                    ruminationId={ruminationId}
                    key={childComment.id}
                    comment={childComment}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface EditCommentDialogProps {
  comment: CommentResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

const EditCommentDialog: React.FC<EditCommentDialogProps> = ({ comment, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState(comment.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Edit Comment
        </h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            rows={4}
            required
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Comments: React.FC<CommentsProps> = ({ ruminationId }) => {
  const [editingComment, setEditingComment] = useState<CommentResponse | null>(null);
  
  const { user } = useAuth();
  const { data: comments = [], isLoading: loading, error } = useComments(ruminationId);
  const { mutateAsync: updateComment } = useUpdateComment();
  const { mutateAsync: deleteComment } = useDeleteComment();

  const handleEditComment = async (content: string) => {
    if (!editingComment) return;

    try {
      const updateDto: UpdateCommentDto = {
        id: editingComment.id,
        content,
      };
      
      await updateComment(updateDto);
      setEditingComment(null);
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="mt-4 p-4">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comments ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded">
          {error.message}
        </div>
      )}

      {editingComment && (
        <EditCommentDialog
          comment={editingComment}
          isOpen={true}
          onClose={() => setEditingComment(null)}
          onSave={handleEditComment}
        />
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No comments yet. {user ? 'Be the first to comment!' : 'Log in to add a comment.'}
          </p>
        ) : (
          comments.map((comment: CommentResponse) => (
            <CommentItem
              ruminationId={ruminationId}
              key={comment.id}
              comment={comment}
              onReply={() => null}
              onEdit={setEditingComment}
              onDelete={handleDeleteComment}
              currentUserId={user?.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
