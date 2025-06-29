import React from 'react';
import { ShareIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

interface RuminationActionButtonsProps {
  onCommentClick?: (e: React.MouseEvent) => void;
  onShareClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export default function RuminationActionButtons({
  onCommentClick,
  onShareClick,
  className = ""
}: RuminationActionButtonsProps) {
  return (
    <div className={`flex items-center justify-between pt-4 pb-3 border-b border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Comment Button */}
        <button
          onClick={onCommentClick}
          className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <div className="rounded-full">
            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
          </div>
        </button>

        {/* Share Button */}
        <button 
          onClick={onShareClick}
          className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <div className="rounded-full">
            <ShareIcon className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}
