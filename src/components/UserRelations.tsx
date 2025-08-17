import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserRelationType } from '../types/rumination';
import { useUserRelations, useRequestUserRelation, useAcceptUserRelation, useRejectUserRelation, useDeleteUserRelation } from '../hooks/useUserRelations';
import { useAuth } from '../AuthContext';

interface UserRelationsProps {
  userId: string;
}

export default function UserRelations({ userId }: UserRelationsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const currentUserId = useMemo(() => {
    return user?.id;
  }, [user]);

  const { data: relations = [], isLoading } = useUserRelations({
    userId: userId,
    withMe: true
  });
  
  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
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
  
  const requestRelationMutation = useRequestUserRelation();
  const acceptRelationMutation = useAcceptUserRelation();
  const rejectRelationMutation = useRejectUserRelation();
  const deleteRelationMutation = useDeleteUserRelation();

  // Don't show component if viewing own profile
  if (userId === currentUserId) {
    return null;
  }

  const getRelationLabel = (relationType: UserRelationType, receiverId?: string) => {
    switch (relationType) {
      case UserRelationType.Acquaintance: return 'Acquaintance';
      case UserRelationType.Family: return 'Family';
      case UserRelationType.Friend: return 'Friend';
      case UserRelationType.BestFriend: return 'Best Friend';
      case UserRelationType.Partner: return 'Partner';
      case UserRelationType.Therapist:
        if (!receiverId) {
          return 'Therapist';
        } else if (receiverId === currentUserId) {
          return 'Patient';
        } else {
          return 'Therapist';
        }
      default: return 'Unknown';
    }
  };

  const relationOptions = [
    UserRelationType.Acquaintance,
    UserRelationType.Friend,
    UserRelationType.BestFriend,
    UserRelationType.Family,
    UserRelationType.Partner,
    UserRelationType.Therapist,
  ];

  const handleRequestRelation = async (relationType: UserRelationType) => {
    try {
      await requestRelationMutation.mutateAsync({ userId, relationType });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to request relation:', error);
    }
  };

  const handleAcceptRelation = async (relationId: number) => {
    try {
      await acceptRelationMutation.mutateAsync(relationId);
    } catch (error) {
      console.error('Failed to accept relation:', error);
    }
  };

  const handleRejectRelation = async (relationId: number) => {
    try {
      await rejectRelationMutation.mutateAsync(relationId);
    } catch (error) {
      console.error('Failed to reject relation:', error);
    }
  };

  const handleDeleteRelation = async (relationId: number) => {
    try {
      await deleteRelationMutation.mutateAsync(relationId);
    } catch (error) {
      console.error('Failed to delete relation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-56 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  // Filter out rejected relations
  const visibleRelations = relations?.filter(relation => !relation.isRejected) || [];

  return (
    <div className="w-full space-y-4">
      {/* Request Button */}
      {visibleRelations.length < relationOptions.length && <div ref={dropdownRef} className="relative w-fit">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={requestRelationMutation.isPending}
          className="mb-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {requestRelationMutation.isPending ? 'Requesting...' : 'Request Relation'}
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-full">
            {relationOptions.filter((relationType) => !visibleRelations.some((relation) => relation.type === relationType)).map((relationType) => (
              <button
                key={relationType}
                onClick={() => handleRequestRelation(relationType)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
              >
                {getRelationLabel(relationType)}
              </button>
            ))}
          </div>
        )}
      </div>}

      {/* Current Relations List - Horizontal Scroll */}
      {visibleRelations && visibleRelations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Relations</h4>
          <div className="flex gap-2 overflow-x-auto pb-2 max-h-16 [-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {visibleRelations.map((relation) => (
              <div
                key={relation.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap flex-shrink-0 ${
                  relation.isAccepted
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700'
                }`}
              >
                <span className={`font-medium ${
                  relation.isAccepted
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {getRelationLabel(relation.type, relation.receiver.id)}
                </span>
                {!relation.isAccepted && relation.receiver.id === currentUserId ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAcceptRelation(relation.id)}
                      disabled={acceptRelationMutation.isPending}
                      className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      title="Accept request"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRejectRelation(relation.id)}
                      disabled={rejectRelationMutation.isPending}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Reject request"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : !relation.isAccepted && relation.initiator.id === currentUserId ? (
                  <button
                    onClick={() => handleDeleteRelation(relation.id)}
                    disabled={deleteRelationMutation.isPending}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Cancel request"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                ) : relation.isAccepted ? (
                  <button
                    onClick={() => handleDeleteRelation(relation.id)}
                    disabled={rejectRelationMutation.isPending}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete relation"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                ) : (
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
