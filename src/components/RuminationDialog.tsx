import React from 'react';
import { createPortal } from 'react-dom';
import Comments from './Comments';
import AddNewComment from './AddNewComment';
import { RuminationResponse } from '../types/rumination';
import { XMarkIcon } from '@heroicons/react/24/outline';
import UserAvatar from './UserAvatar';

interface RuminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rumination: RuminationResponse;
}

export default function RuminationDialog({
  isOpen,
  onClose,
  rumination,
}: RuminationDialogProps) {
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] m-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rumination</h3>
          <button
            onClick={onClose}
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
              name={(rumination.createdBy as any).name}
              username={rumination.createdBy.username}
              size="sm"
              showUsername={true}
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(rumination.createTms)}
              </span>
            </div>
          </div>
          <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg whitespace-pre-wrap break-words pl-10">
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
  );
}
