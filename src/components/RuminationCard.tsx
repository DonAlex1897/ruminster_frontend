import React, { useState } from 'react';
import RuminationDialog from './RuminationDialog';
import { RuminationResponse, UserRelationType } from '../types/rumination';
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import UserAvatar from './UserAvatar';

interface RuminationCardProps {
  rumination: RuminationResponse;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  showUserInfo?: boolean;
}

export default function RuminationCard({
  rumination,
  onClick,
  onDelete,
  showUserInfo = true,
}: RuminationCardProps) {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
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
            {rumination.content.length > 300 ? (
              <>
                {isExpanded ? rumination.content : rumination.content.substring(0, 300) + '...'}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="ml-2 px-3 py-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium border border-gray-500 dark:border-gray-400 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-all duration-200"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              </>
            ) : (
              rumination.content
            )}
          </h2>
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
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(e as React.MouseEvent);
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                  <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Comment Dialog - Using RuminationDialog Component */}
      <RuminationDialog
        isOpen={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        rumination={rumination}
      />
    </>
  );
}
