import React from 'react';
import UserAvatar from './UserAvatar';
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
}

export default function RuminationCard({
  rumination,
  variant = 'default',
  onClick,
  onDelete,
  showUserInfo = true
}: RuminationCardProps) {
  const isEditable = variant === 'editable';

  return (
    <article 
      className={`
        group relative overflow-hidden
        bg-white dark:bg-gray-800
        rounded-2xl border border-gray-200/60 dark:border-gray-700/60
        transition-all duration-300 ease-in-out
        ${isEditable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'hover:scale-[1.01]'}
        ${isEditable ? 'hover:border-primary/30 dark:hover:border-primary/40' : 'hover:border-gray-300/80 dark:hover:border-gray-600/80'}
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
      </div>
      

    </article>
  );
}
