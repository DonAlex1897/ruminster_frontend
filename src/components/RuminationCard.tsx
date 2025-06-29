import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import UserAvatar from './UserAvatar';
import Comments from './Comments';
import AddNewComment from './AddNewComment';
import { UserRelationType } from '../types/rumination';

// Utility functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getAudienceLabels = (audiences: { relationType: UserRelationType }[]): string => {
  const labels = audiences.map(a => {
    switch (a.relationType) {
      case UserRelationType.Acquaintance: return 'Acquaintance';
      case UserRelationType.Family: return 'Family';
      case UserRelationType.Friend: return 'Friend';
      case UserRelationType.BestFriend: return 'Best Friend';
      case UserRelationType.Partner: return 'Partner';
      case UserRelationType.Therapist: return 'Therapist';
      default: return 'Unknown';
    }
  });
  return labels.join(', ');
};

interface RuminationCardProps {
  rumination: {
    id: string | number;
    content: string;
    createTMS: string;
    isPublished?: boolean;
    audiences: { relationType: UserRelationType }[];
    createdBy: {
      id: string;
      username: string;
    };
  };
  variant?: 'default' | 'editable';
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  showUserInfo?: boolean;
  showComments?: boolean;
}

export default function RuminationCard({
  rumination,
  variant = 'default',
  onClick,
  onDelete,
  showUserInfo = true,
  showComments = false
}: RuminationCardProps) {
  const isEditable = variant === 'editable';
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  return (
    <>
      <article 
        className={`
          group relative overflow-hidden
          bg-white dark:bg-card
          rounded-2xl border border-gray-200/60 dark:border-gray-700/60
          transition-all duration-300 ease-in-out
          ${isEditable ? 'cursor-pointer' : 'cursor-default'}
          hover:border-gray-300/80 dark:hover:border-gray-600/80
        `}
        onClick={onClick}
      >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header */}
        <header className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {showUserInfo && (
              <UserAvatar
                userId={rumination.createdBy.id}
                username={rumination.createdBy.username}
                size="sm"
                showUsername={true}
                className="ring-2 ring-white/50 shadow-md"
              />
            )}
            
            {/* Status and audience badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {isEditable && rumination.isPublished !== undefined && (
                <span className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide
                  transition-all duration-200
                  ${rumination.isPublished
                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 ring-1 ring-emerald-200/50 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300 dark:ring-emerald-700/50'
                    : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 ring-1 ring-amber-200/50 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-300 dark:ring-amber-700/50'
                  }
                `}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${rumination.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {rumination.isPublished ? 'Published' : 'Draft'}
                </span>
              )}
              
              {rumination.audiences.length > 0 && (
                <span className="
                  inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide
                  bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 ring-1 ring-blue-200/50
                  dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:ring-blue-700/50
                  transition-all duration-200
                ">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                  {getAudienceLabels(rumination.audiences)}
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3 ml-4">
            <time className="text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
              {formatDate(rumination.createTMS)}
            </time>
            
            {onDelete && (
              <button
                onClick={onDelete}
                className="
                  group/delete relative p-2 rounded-xl
                  text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400
                  hover:bg-red-50 dark:hover:bg-red-900/20
                  transition-all duration-200 ease-in-out
                  hover:scale-110 active:scale-95
                  ring-0 hover:ring-2 hover:ring-red-200/50 dark:hover:ring-red-800/50
                "
                title="Delete rumination"
                aria-label="Delete rumination"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 transition-transform duration-200 group-hover/delete:rotate-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="relative">
          <p className="
            text-gray-900 dark:text-gray-100 
            leading-relaxed text-base
            whitespace-pre-wrap break-words
            selection:bg-primary/20 selection:text-primary-foreground
          ">
            {rumination.content}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Comment Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCommentDialogOpen(true);
              }}
              className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <div className="p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
              </div>
            </button>

            {/* Share Button */}
            <button className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200">
              <div className="p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Comment Input */}
        <AddNewComment ruminationId={Number(rumination.id)} />

      </div>

      </article>

      {/* Comment Dialog - Rendered using Portal */}
      {commentDialogOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCommentDialogOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rumination</h3>
              <button
                onClick={() => setCommentDialogOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Original Rumination */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                {showUserInfo && (
                  <UserAvatar
                    userId={rumination.createdBy.id}
                    username={rumination.createdBy.username}
                    size="sm"
                    showUsername={true}
                    className="ring-2 ring-white/50 shadow-md"
                  />
                )}
                <time className="text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                  {formatDate(rumination.createTMS)}
                </time>
              </div>
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-base whitespace-pre-wrap break-words">
                {rumination.content}
              </p>
            </div>
            
            {/* Comments in Dialog */}
            <div className="max-h-96 overflow-y-auto">
              <Comments ruminationId={Number(rumination.id)} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
