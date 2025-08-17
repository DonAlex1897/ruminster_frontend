import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ placeholder, className }: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') ?? '';
  }, [location.search]);

  const [value, setValue] = useState(currentQuery);

  useEffect(() => {
    // Keep local state in sync when route/search changes from elsewhere
    setValue(currentQuery);
  }, [currentQuery]);

  // Debounced navigation when typing
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrl(value, true);
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const updateUrl = (q: string, replace = false) => {
    const params = new URLSearchParams(location.search);
    if (q.trim().length === 0) {
      params.delete('q');
    } else {
      // Preserve spaces exactly as typed (no trim) so users can enter multi-word phrases naturally
      params.set('q', q);
    }
    const search = params.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ''}`, { replace });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(value, false);
  };

  const onClear = () => {
    setValue('');
    updateUrl('', false);
  };

  return (
    <form onSubmit={onSubmit} className={`w-full max-w-xl ${className ?? ''}`} role="search">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder={placeholder || 'Search ruminations...'}
          className="w-full pl-10 pr-10 py-2 rounded-md bg-slate-100/80 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200/70 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
}
