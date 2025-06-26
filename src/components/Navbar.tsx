import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onNewRumination: () => void;
}

export default function Navbar({ onNewRumination }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Ruminster
            </Link>
            
            <div className="flex space-x-6">
              <Link
                to="/my-ruminations"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/my-ruminations')
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                My Ruminations
              </Link>
              
              <Link
                to="/my-feed"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/my-feed')
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                My Feed
              </Link>
              
              <Link
                to="/public"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/public')
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Public
              </Link>
            </div>
          </div>

          <button
            onClick={onNewRumination}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            New Rumination
          </button>
        </div>
      </div>
    </nav>
  );
}
