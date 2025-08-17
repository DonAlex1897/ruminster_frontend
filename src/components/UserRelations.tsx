import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UserRelationType } from '../types/rumination';
import {
  useUserRelations,
  useRequestUserRelation,
  useAcceptUserRelation,
  useRejectUserRelation,
  useDeleteUserRelation
} from '../hooks/useUserRelations';
import { useAuth } from '../AuthContext';
import Tooltip from './Tooltip';
import {
  UserIcon,
  UserGroupIcon,
  SparklesIcon,
  HomeModernIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';

interface UserRelationsProps {
  userId: string;
}

const RELATION_LABELS = {
  [UserRelationType.Acquaintance]: 'Acquaintance',
  [UserRelationType.Family]: 'Family',
  [UserRelationType.Friend]: 'Friend',
  [UserRelationType.BestFriend]: 'Best Friend',
  [UserRelationType.Partner]: 'Partner',
  [UserRelationType.Therapist]: 'Therapist',
} as const;

const RELATION_OPTIONS = [
  UserRelationType.Acquaintance,
  UserRelationType.Friend,
  UserRelationType.BestFriend,
  UserRelationType.Family,
  UserRelationType.Partner,
  UserRelationType.Therapist,
] as const;

export default function UserRelations({ userId }: UserRelationsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { user } = useAuth();
  const currentUserId = useMemo(() => user?.id, [user]);

  const { data: relations = [], isLoading, error } = useUserRelations({
    userId: userId,
    withMe: true
  });

  const requestRelationMutation = useRequestUserRelation();
  const acceptRelationMutation = useAcceptUserRelation();
  const rejectRelationMutation = useRejectUserRelation();
  const deleteRelationMutation = useDeleteUserRelation();

  const getRelationLabel = useCallback((relationType: UserRelationType, receiverId?: string): string => {
    if (relationType === UserRelationType.Therapist) {
      if (!receiverId) return 'Therapist';
      return receiverId === currentUserId ? 'Patient' : 'Therapist';
    }

    return RELATION_LABELS[relationType] || 'Unknown';
  }, [currentUserId]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isDropdownOpen]);

  const getRelationIcon = useCallback((relationType: UserRelationType) => {
    const iconMap = {
      [UserRelationType.Acquaintance]: <UserIcon className="h-4 w-4" />,
      [UserRelationType.Friend]: <UserGroupIcon className="h-4 w-4" />,
      [UserRelationType.BestFriend]: <SparklesIcon className="h-4 w-4" />,
      [UserRelationType.Family]: <HomeModernIcon className="h-4 w-4" />,
      [UserRelationType.Partner]: <HeartIcon className="h-4 w-4" />,
      [UserRelationType.Therapist]: <ChatBubbleLeftRightIcon className="h-4 w-4" />,
    } as const;

    return iconMap[relationType] || <UserIcon className="h-4 w-4" />;
  }, []);

  const handleRequestRelation = useCallback(async (relationType: UserRelationType) => {
    try {
      await requestRelationMutation.mutateAsync({ userId, relationType });
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('Failed to request relation:', err);
    }
  }, [requestRelationMutation, userId]);

  const handleAcceptRelation = useCallback(async (relationId: number) => {
    try {
      await acceptRelationMutation.mutateAsync(relationId);
    } catch (err) {
      console.error('Failed to accept relation:', err);
    }
  }, [acceptRelationMutation]);

  const handleRejectRelation = useCallback(async (relationId: number) => {
    try {
      await rejectRelationMutation.mutateAsync(relationId);
    } catch (err) {
      console.error('Failed to reject relation:', err);
    }
  }, [rejectRelationMutation]);

  const handleDeleteRelation = useCallback(async (relationId: number) => {
    try {
      await deleteRelationMutation.mutateAsync(relationId);
    } catch (err) {
      console.error('Failed to delete relation:', err);
    }
  }, [deleteRelationMutation]);

  // Computed values
  const visibleRelations = useMemo(() =>
    relations?.filter(relation => !relation.isRejected) || [],
  [relations]
  );

  const availableRelationTypes = useMemo(() =>
    RELATION_OPTIONS.filter((relationType) =>
      !visibleRelations.some((relation) => relation.type === relationType)
    ),
  [visibleRelations]
  );

  const hasAvailableRelations = availableRelationTypes.length > 0;

  // Sort so accepted first, then incoming pending, then outgoing pending
  const sortedRelations = useMemo(() => {
    const accepted = visibleRelations.filter(r => r.isAccepted);
    const pending = visibleRelations.filter(r => !r.isAccepted);
    const incoming = pending.filter(r => r.receiver.id === currentUserId);
    const outgoing = pending.filter(r => r.initiator.id === currentUserId);
    return [...accepted, ...incoming, ...outgoing];
  }, [visibleRelations, currentUserId]);

  const updateScrollIndicators = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollIndicators();
  }, [sortedRelations, updateScrollIndicators]);

  useEffect(() => {
    const onResize = () => updateScrollIndicators();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateScrollIndicators]);

  const handleScroll = useCallback(() => {
    updateScrollIndicators();
  }, [updateScrollIndicators]);

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 240;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  // Early returns after all hooks
  if (userId === currentUserId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="text-red-600 dark:text-red-400 text-sm">
            Failed to load relationship data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="flex items-center gap-2">
        {hasAvailableRelations && (
          <div ref={dropdownRef} className="relative flex-none">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={requestRelationMutation.isPending}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
            >
              {requestRelationMutation.isPending ? 'Requesting…' : 'Request Relation'}
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden"
                role="menu"
              >
                {availableRelationTypes.map((relationType) => (
                  <button
                    key={relationType}
                    onClick={() => handleRequestRelation(relationType)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    role="menuitem"
                  >
                    <span className="text-gray-600 dark:text-gray-300">
                      {getRelationIcon(relationType)}
                    </span>
                    <span>{getRelationLabel(relationType)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

    <div className="relative flex-1 min-w-0">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
      className="overflow-x-auto no-scrollbar min-w-0"
          >
          {visibleRelations.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 py-2 whitespace-nowrap">
              No relationship set yet.
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-nowrap px-2">
              {sortedRelations.map((relation) => {
                const isIncoming = !relation.isAccepted && relation.receiver.id === currentUserId;
                const isOutgoing = !relation.isAccepted && relation.initiator.id === currentUserId;

                // Simplified neutral styling for all statuses
                const statusStyles = 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200';

                return (
                  <div
                    key={relation.id}
                    className={`flex-none flex items-center justify-between px-2.5 py-1 rounded-full text-sm border transition-colors whitespace-nowrap ${statusStyles}`}
                  >
                    <div className="flex items-center gap-1.5 pr-1">
                      <span className="opacity-80">{getRelationIcon(relation.type)}</span>
                      <span className="font-medium whitespace-nowrap leading-none">{getRelationLabel(relation.type, relation.receiver.id)}</span>
                      {!relation.isAccepted && (
                        isIncoming ? (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/60 dark:bg-black/20 border border-current/20 whitespace-nowrap">
                            Incoming
                          </span>
                        ) : (
                          <Tooltip content="Requested" position="top">
                            <span
                              className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200"
                              aria-label="Requested"
                            >
                              <ClockIcon className="h-3 w-3" />
                            </span>
                          </Tooltip>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {!relation.isAccepted && isIncoming && (
                        <>
                          <Tooltip content="Accept request" position="top">
                            <button
                              onClick={() => handleAcceptRelation(relation.id)}
                              disabled={acceptRelationMutation.isPending}
                              className="p-1 rounded-md text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent disabled:opacity-60 transition-colors"
                              aria-label="Accept relation request"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Reject request" position="top">
                            <button
                              onClick={() => handleRejectRelation(relation.id)}
                              disabled={rejectRelationMutation.isPending}
                              className="p-1 rounded-md text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent disabled:opacity-60 transition-colors"
                              aria-label="Reject relation request"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </>
                      )}

                      {(!relation.isAccepted && isOutgoing) || relation.isAccepted ? (
                        <Tooltip content={relation.isAccepted ? 'Remove relationship' : 'Cancel request'} position="top">
                          <button
                            onClick={() => handleDeleteRelation(relation.id)}
                            disabled={deleteRelationMutation.isPending}
                            className="p-1 rounded-md bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/60 disabled:opacity-60 transition-colors"
                            aria-label={relation.isAccepted ? 'Delete relation' : 'Cancel relation request'}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>

          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white/95 dark:from-gray-900/80 to-transparent z-10" />
          )}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollBy('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200/90 dark:bg-gray-700/80 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-950 dark:text-white" />
            </button>
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/95 dark:from-gray-900/80 to-transparent z-10" />
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollBy('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200/90 dark:bg-gray-700/80 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-950 dark:text-white" />
            </button>
          )}
        </div>

  {/* Button moved to the left; nothing on the right so it stays fixed */}
      </div>
    </section>
  );
}
