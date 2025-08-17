import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { UserIcon } from '@heroicons/react/24/solid';

interface UserAvatarProps {
  userId: string;
  name?: string;
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

const getAvatarColor = (seed: string): string => {
  if (!seed) return COLORS[0];
  const hash = seed.charCodeAt(0) + (seed.charCodeAt(seed.length - 1) || 0);
  return COLORS[hash % COLORS.length];
};

export default function UserAvatar({ 
  userId, 
  name,
  username, 
  size = 'md', 
  showUsername = true, 
  clickable = true,
  className = ''
}: UserAvatarProps) {
  const { user } = useAuth();
  const sizeMap = {
    sm: { avatar: 'h-8 w-8', nameText: 'text-sm', usernameText: 'text-xs', avatarText: 'text-lg' },
    md: { avatar: 'h-12 w-12', nameText: 'text-base', usernameText: 'text-sm', avatarText: 'text-2xl' },
    lg: { avatar: 'h-16 w-16', nameText: 'text-lg', usernameText: 'text-base', avatarText: 'text-4xl' }
  };

  const { avatar: avatarSize, nameText, usernameText, avatarText: avatarTextSize } = sizeMap[size];
  const bgColor = getAvatarColor(username || name || '');
  
  const initial = (name?.[0] ?? username?.[0] ?? '').toUpperCase();
  const avatarElement = (
    <div className={`${avatarSize} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${avatarTextSize} ${className}`}>
      {initial ? initial : <UserIcon className="h-1/2 w-1/2" />}
    </div>
  );

  const content = (
    <div className="flex items-center gap-2">
      {avatarElement}
      {showUsername && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className={`${nameText} font-semibold text-gray-900 dark:text-gray-100 truncate`}>
            {name || username}
          </span>
          {username && (
            <span className={`${usernameText} text-gray-500 dark:text-gray-400 truncate`}>
              @{username}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    const isCurrentUser = user?.id && String(user.id) === String(userId);
    const to = isCurrentUser ? '/my-ruminations' : `/user/${userId}`;
    return (
      <Link to={to} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
