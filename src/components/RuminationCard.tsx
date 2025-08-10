import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Comments from './Comments';
import AddNewComment from './AddNewComment';
import { RuminationResponse, UserRelationType } from '../types/rumination';
import {
  XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import UserAvatar from './UserAvatar';

interface RuminationCardProps {
  rumination: RuminationResponse;
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
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getAudienceLabel = (audience: { relationType: UserRelationType }): string => {
    switch (audience.relationType) {
      case UserRelationType.Acquaintance: return 'Acquaintance Circle';
      case UserRelationType.Family: return 'Family Circle';
      case UserRelationType.Friend: return 'Friend Circle';
      case UserRelationType.BestFriend: return 'Best Friend Circle';
      case UserRelationType.Partner: return 'Partner';
      case UserRelationType.Therapist: return 'Therapist';
      default: return 'Public';
    }
  };

  return (
    <>
      <article
        className="
          border-b border-gray-200 dark:border-gray-800
          p-6 cursor-pointer
        "
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              userId={rumination.createdBy.id}
              username={rumination.createdBy.username}
              size="sm"
              showUsername={true}
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(rumination.createTMS)}
              </span>
            </div>
          </div>
        </div>

        {/* Category/Audience */}
        {rumination.audiences.length > 0 && (
          <div className="mb-3 ml-10">
            {rumination.audiences.sort((a, b) => a.relationType - b.relationType).map((audience, index) => (
              <span key={index} className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400 mr-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {getAudienceLabel(audience)}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mb-4 ml-10">
          <h2 className="text-md text-gray-900 dark:text-gray-100 mb-2 leading-relaxed whitespace-pre-wrap break-words">
            {rumination.content.length > 100 ?
              rumination.content.substring(0, 100) + '...' :
              rumination.content
            }
          </h2>
          {rumination.content.length > 100 && (
            <p className="text-gray-600 dark:text-gray-400 text-base font-serif leading-relaxed whitespace-pre-wrap break-words">
              {rumination.content.substring(100, 200)}...
            </p>
          )}
        </div>

        {/* Engagement Actions */}
        <div className="flex items-center justify-between ml-10">
          <div className="flex items-center gap-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCommentDialogOpen(true);
              }}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            >
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-blue-500 transition-colors duration-200">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>

      {/* Comment Dialog - Rendered using Portal */}
      {commentDialogOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCommentDialogOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] m-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rumination</h3>
              <button
                onClick={() => setCommentDialogOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Original Rumination */}
            <div className="p-5 border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <UserAvatar
                  userId={rumination.createdBy.id}
                  username={rumination.createdBy.username}
                  size="sm"
                  showUsername={false}
                />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {rumination.createdBy.username}
                  </span>
                  <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatDate(rumination.createTMS)}
                  </span>
                </div>
              </div>
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg font-serif whitespace-pre-wrap break-words">
                {rumination.content}
              </p>
              <div className='pt-4'>
                <AddNewComment ruminationId={Number(rumination.id)} />
              </div>
            </div>

            {/* Comments in Dialog */}
            <div className="border-t border-gray-200 dark:border-gray-700 overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden">
              <div className='px-1'>
                <Comments ruminationId={Number(rumination.id)} />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
