import React, { useState } from 'react';
import { CommentResponse, PostCommentDto, UpdateCommentDto } from '../types/comment';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../AuthContext';

interface CommentsProps {
  ruminationId: number;
}

interface CommentItemProps {
  comment: CommentResponse;
  onReply: (parentCommentId: number) => void;
  onEdit: (comment: CommentResponse) => void;
  onDelete: (commentId: number) => void;
  currentUserId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onEdit, onDelete, currentUserId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useAuth();
  
  const canEdit = currentUserId === comment.createdBy.id;
  const isDeleted = comment.isDeleted;

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-2 mb-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {comment.createdBy.username}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(comment.createTMS).toLocaleDateString()}
            </span>
          </div>
          {canEdit && !isDeleted && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(comment)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <p className={`text-gray-700 dark:text-gray-300 mb-2 ${isDeleted ? 'italic text-gray-500' : ''}`}>
          {comment.content}
        </p>
        
        {user && !isDeleted && (
          <button
            onClick={() => onReply(comment.id)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
          >
            Reply
          </button>
        )}
        
        {comment.childComments.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
            >
              {showReplies ? 'Hide' : 'Show'} {comment.childComments.length} replies
            </button>
            
            {showReplies && (
              <div className="mt-3">
                {comment.childComments.map(childComment => (
                  <CommentItem
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

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, onCancel, initialContent = '', placeholder = 'Write a comment...' }) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
        rows={3}
        required
      />
      <div className="flex justify-end space-x-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {initialContent ? 'Update' : 'Post'} Comment
        </button>
      </div>
    </form>
  );
};

export const Comments: React.FC<CommentsProps> = ({ ruminationId }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<CommentResponse | null>(null);
  
  const { user, token } = useAuth();
  const { 
    comments, 
    loading, 
    error, 
    addComment, 
    updateComment, 
    deleteComment
  } = useComments(ruminationId);

  const handleAddComment = async (content: string) => {
    if (!token) return;

    try {
      const commentDto: PostCommentDto = {
        content,
        ruminationId,
      };
      
      await addComment({ token, commentDto });
      setShowCommentForm(false);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleReply = async (content: string) => {
    if (!token || !replyingTo) return;

    try {
      const commentDto: PostCommentDto = {
        content,
        parentCommentId: replyingTo,
      };
      
      await addComment({ token, commentDto });
      setReplyingTo(null);
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  const handleEditComment = async (content: string) => {
    if (!token || !editingComment) return;

    try {
      const updateDto: UpdateCommentDto = {
        id: editingComment.id,
        content,
      };
      
      await updateComment({ token, commentDto: updateDto });
      setEditingComment(null);
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment({ token, commentId });
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
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comments ({comments.length})
        </h3>
        {user && (
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm"
          >
            {showCommentForm ? 'Cancel' : 'Add Comment'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {showCommentForm && (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowCommentForm(false)}
          placeholder="Write a comment..."
        />
      )}

      {replyingTo && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Replying to comment:</h4>
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setReplyingTo(null)}
            placeholder="Write a reply..."
          />
        </div>
      )}

      {editingComment && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Editing comment:</h4>
          <CommentForm
            onSubmit={handleEditComment}
            onCancel={() => setEditingComment(null)}
            initialContent={editingComment.content}
            placeholder="Edit your comment..."
          />
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No comments yet. {user ? 'Be the first to comment!' : 'Log in to add a comment.'}
          </p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={setReplyingTo}
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
