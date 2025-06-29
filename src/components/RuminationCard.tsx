import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Comments from './Comments';
import AddNewComment from './AddNewComment';
import RuminationHeader from './RuminationHeader';
import RuminationActionButtons from './RuminationActionButtons';
import { UserRelationType } from '../types/rumination';
import { XMarkIcon } from '@heroicons/react/24/solid';

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
        <RuminationHeader
          rumination={rumination}
          showUserInfo={showUserInfo}
          showPublishStatus={isEditable}
          onDelete={onDelete}
        />

        <div className='pl-9'>
          {/* Content */}
          <div className="relative">
            <p className="
              text-gray-900 dark:text-gray-100 
              leading-relaxed text-base
              whitespace-pre-wrap break-words
              selection:bg-primary/20 selection:text-primary-foreground
              pl-1 pr-1
            ">
              {rumination.content}
            </p>
          </div>

          {/* Action Buttons */}
          <RuminationActionButtons
            onCommentClick={(e) => {
              e.stopPropagation();
              setCommentDialogOpen(true);
            }}
          />

          {/* Comment Input */}
          <div className='pt-3'>
            <AddNewComment ruminationId={Number(rumination.id)} />
          </div>
        </div>
      </div>

      </article>

      {/* Comment Dialog - Rendered using Portal */}
      {commentDialogOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCommentDialogOpen(false)}>
          <div className="bg-white dark:bg-card rounded-2xl max-w-2xl w-full max-h-[80vh] m-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
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
              <RuminationHeader
                rumination={rumination}
                showUserInfo={showUserInfo}
                showPublishStatus={false}
                className="mb-4"
              />
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-base whitespace-pre-wrap break-words">
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
