import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchDialog from './SearchDialog';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ placeholder, className }: SearchBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full max-w-xl ${className ?? ''}`}
        aria-label="Open search"
      >
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </span>
          <div className="w-full pl-10 pr-3 py-2 rounded-md bg-slate-100/80 dark:bg-slate-800/70 text-left text-slate-500 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition">
            {placeholder || 'Search users and ruminations...'}
          </div>
        </div>
      </button>

      <SearchDialog isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
