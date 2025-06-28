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

// Predefined gradient combinations for avatars
const AVATAR_GRADIENTS = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-orange-500 to-red-600',
  'from-purple-500 to-indigo-600',
  'from-teal-500 to-cyan-600',
  'from-yellow-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-green-600',
  'from-violet-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-yellow-600',
  'from-lime-500 to-green-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-pink-600',
  'from-red-500 to-rose-600',
  'from-slate-500 to-gray-600',
  'from-zinc-500 to-slate-600',
  'from-neutral-500 to-stone-600'
];

// Generate consistent color based on first 3 letters of username
const getAvatarGradient = (username: string): string => {
  if (!username || username.length === 0) {
    return AVATAR_GRADIENTS[0]; // Default gradient
  }
  
  // Take first 3 characters, pad with 'a' if needed
  const chars = (username.toLowerCase() + 'aaa').slice(0, 3);
  
  // Create a simple hash from the 3 characters
  let hash = 0;
  for (let i = 0; i < chars.length; i++) {
    hash = chars.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Ensure positive number and map to gradient array
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

export default function UserAvatar({ 
  userId, 
  username, 
  size = 'md', 
  showUsername = true, 
  clickable = true,
  className = ''
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const gradient = getAvatarGradient(username);
  
  const avatarElement = (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold ${className}`}>
      {username ? username.charAt(0).toUpperCase() : <UserIcon className="h-1/2 w-1/2" />}
    </div>
  );

  const content = (
    <div className="flex flex-col items-center space-y-1">
      {avatarElement}
      {showUsername && (
        <span className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 text-center truncate max-w-24`}>
          {username}
        </span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link 
        to={`/user/${userId}`} 
        className="hover:opacity-80 transition-opacity cursor-pointer"
      >
        {content}
      </Link>
    );
  }

  return content;
}
