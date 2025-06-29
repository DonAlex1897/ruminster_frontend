import React, { useMemo, useState } from 'react';
import { UserRelationType } from '../types/rumination';
import { useUserRelations, useRequestUserRelation, useAcceptUserRelation, useRejectUserRelation } from '../hooks/useUserRelations';
import { useAuth } from '../AuthContext';

interface UserRelationsProps {
  userId: string;
}

export default function UserRelations({ userId }: UserRelationsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();
  const currentUserId = useMemo(() => {
    return user?.id;
  }, [user]);

  const { data: relations = [], isLoading } = useUserRelations({
    UserId: userId,
    WithMe: true
  });
  
  const requestRelationMutation = useRequestUserRelation();
  const acceptRelationMutation = useAcceptUserRelation();
  const rejectRelationMutation = useRejectUserRelation();

  // Don't show component if viewing own profile
  if (userId === currentUserId) {
    return null;
  }

  const getRelationLabel = (relationType: UserRelationType) => {
    switch (relationType) {
      case UserRelationType.Acquaintance: return 'Acquaintance';
      case UserRelationType.Family: return 'Family';
      case UserRelationType.Friend: return 'Friend';
      case UserRelationType.BestFriend: return 'Best Friend';
      case UserRelationType.Partner: return 'Partner';
      case UserRelationType.Therapist: return 'Therapist';
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

  if (isLoading) {
    return (
      <div className="w-56 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="w-56 space-y-3">
      {/* Request Button */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={requestRelationMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {requestRelationMutation.isPending ? 'Requesting...' : 'Request Relation'}
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
            {relationOptions.map((relationType) => (
              <button
                key={relationType}
                onClick={() => handleRequestRelation(relationType)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
              >
                {getRelationLabel(relationType)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Relations List */}
      {relations && relations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Relations</h4>
          {relations.map((relation) => (
            <div
              key={relation.id}
              className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                relation.isAccepted
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                  : relation.isRejected
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700'
              }`}
            >
              <span className={`font-medium ${
                relation.isAccepted
                  ? 'text-green-700 dark:text-green-300'
                  : relation.isRejected
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-yellow-700 dark:text-yellow-300'
              }`}>
                {getRelationLabel(relation.type)}
              </span>
              {!relation.isAccepted && !relation.isRejected && relation.receiver.id === currentUserId ? (
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleAcceptRelation(relation.id)}
                    disabled={acceptRelationMutation.isPending}
                    className="px-1.5 py-0.5 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded transition-colors min-w-0"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleRejectRelation(relation.id)}
                    disabled={rejectRelationMutation.isPending}
                    className="px-1.5 py-0.5 text-xs bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded transition-colors min-w-0"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className={`text-xs ${
                  relation.isAccepted
                    ? 'text-green-600 dark:text-green-400'
                    : relation.isRejected
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {relation.isAccepted ? 'Accepted' : relation.isRejected ? 'Rejected' : 'Pending'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
