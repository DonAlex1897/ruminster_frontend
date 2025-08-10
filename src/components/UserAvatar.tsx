import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/solid';

interface UserAvatarProps {
  userId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  showUsername?: boolean;
  clickable?: boolean;
  className?: string;
}

const COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500', 
  'bg-purple-500', 'bg-teal-500', 'bg-yellow-500', 'bg-indigo-500',
  'bg-rose-500', 'bg-emerald-500', 'bg-violet-500', 'bg-sky-500',
  'bg-amber-500', 'bg-lime-500', 'bg-cyan-500', 'bg-fuchsia-500',
  'bg-red-500', 'bg-slate-500', 'bg-zinc-500', 'bg-neutral-500'
];

const getAvatarColor = (username: string): string => {
  if (!username) return COLORS[0];
  const hash = username.charCodeAt(0) + (username.charCodeAt(username.length - 1) || 0);
  return COLORS[hash % COLORS.length];
};

export default function UserAvatar({ 
  userId, 
  username, 
  size = 'md', 
  showUsername = true, 
  clickable = true,
  className = ''
}: UserAvatarProps) {
  const sizeMap = {
    sm: { avatar: 'h-8 w-8', text: 'text-sm' },
    md: { avatar: 'h-12 w-12', text: 'text-sm' },
    lg: { avatar: 'h-16 w-16', text: 'text-base' }
  };

  const { avatar: avatarSize, text: textSize } = sizeMap[size];
  const bgColor = getAvatarColor(username);
  
  const avatarElement = (
    <div className={`${avatarSize} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
      {username ? username.charAt(0).toUpperCase() : <UserIcon className="h-1/2 w-1/2" />}
    </div>
  );

  const content = (
    <div className="flex items-center gap-2">
      {avatarElement}
      {showUsername && (
        <span className={`${textSize} font-medium text-gray-700 dark:text-gray-300 truncate`}>
          {username}
        </span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to={`/user/${userId}`} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
