import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearch } from '../hooks/useSearch';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import RuminationCard from './RuminationCard';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const { data: results, isLoading: loading, error } = useSearch(query, isOpen && query.trim().length >= 2);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4" onClick={onClose}>
      <div className="w-full max-w-3xl h-[50vh] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header with input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users and ruminations..."
              className="w-full pl-10 pr-10 py-2 rounded-md bg-slate-100/80 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200/70 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <button onClick={onClose} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
          {!query.trim() && (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">Start typing to search</div>
          )}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 dark:text-red-400 py-4">{error.message}</div>
          )}

          {!loading && !error && query.trim() && results && (
            <>
              {/* Users */}
              <section>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Users</h3>
                {results.users.length === 0 ? (
                  <div className="text-slate-500 dark:text-slate-400 text-sm">No users found</div>
                ) : (
                  <ul className="space-y-2">
                    {results.users.map((u) => (
                      <li key={u.id}>
                        <Link
                          to={`/user/${u.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <UserAvatar userId={u.id} name={(u as any).name} username={u.username} size="sm" showUsername={true} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Ruminations */}
              <section>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Ruminations</h3>
                {results.ruminations.length === 0 ? (
                  <div className="text-slate-500 dark:text-slate-400 text-sm">No ruminations found</div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {results.ruminations.map((r) => (
                      <RuminationCard key={r.id} rumination={{ ...r, audiences: r.audiences || [] }} showUserInfo={true} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
