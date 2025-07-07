import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { BookOpenIcon, RssIcon, GlobeAltIcon, PlusIcon, ArrowLeftEndOnRectangleIcon, EllipsisVerticalIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import logo from '../assets/ruminster_logo.png';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  onNewRumination: () => void;
}

export default function Navbar({ onNewRumination }: NavbarProps) {
  const location = useLocation();
  const { isAuthenticated, logout, requiresTosAcceptance } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-background-secondary shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-8">
            <Link to="/public" className="flex items-center space-x-2">
              <img src={logo} alt="Ruminster" className="h-9 w-auto" />
            </Link>
            
            <div className="flex space-x-1 sm:space-x-3 lg:space-x-6">
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-ruminations"
                    className={`flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/my-ruminations')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    <BookOpenIcon className="h-5 w-5" />
                    <span className="hidden lg:inline">My Ruminations</span>
                    <span className="hidden sm:inline lg:hidden text-xs">Mine</span>
                  </Link>
                  
                  <Link
                    to="/my-feed"
                    className={`flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/my-feed')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    <RssIcon className="h-5 w-5" />
                    <span className="hidden lg:inline">My Feed</span>
                    <span className="hidden sm:inline lg:hidden text-xs">Feed</span>
                  </Link>
                </>
              )}
              
              <Link
                to="/public"
                className={`flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/public')
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <GlobeAltIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Public</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Desktop/Tablet buttons */}
                <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
                  <button
                    onClick={requiresTosAcceptance ? undefined : onNewRumination}
                    disabled={requiresTosAcceptance}
                    className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                      requiresTosAcceptance 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <PlusIcon className="h-4 lg:h-5 w-4 lg:w-5" />
                    <span className="hidden lg:inline">New Rumination</span>
                    <span className="inline lg:hidden">New</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1 lg:gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-colors"
                    aria-label="Toggle theme"
                  >
                    {effectiveTheme === 'dark' ? (
                      <SunIcon className="h-4 lg:h-5 w-4 lg:w-5" />
                    ) : (
                      <MoonIcon className="h-4 lg:h-5 w-4 lg:w-5" />
                    )}
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 lg:gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-colors"
                  >
                    <ArrowLeftEndOnRectangleIcon className="h-4 lg:h-5 w-4 lg:w-5" />
                    <span className="hidden lg:inline">Sign Out</span>
                  </button>
                </div>

                {/* Mobile menu */}
                <div className="relative sm:hidden">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2 py-2 text-sm font-medium transition-colors"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                  
                  {showMobileMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowMobileMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        <div className="py-1">
                          <button
                            onClick={requiresTosAcceptance ? undefined : () => {
                              onNewRumination();
                              setShowMobileMenu(false);
                            }}
                            disabled={requiresTosAcceptance}
                            className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                              requiresTosAcceptance 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <PlusIcon className="h-4 w-4" />
                            New Rumination
                          </button>
                          <button
                            onClick={() => {
                              toggleTheme();
                              setShowMobileMenu(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {effectiveTheme === 'dark' ? (
                              <SunIcon className="h-4 w-4" />
                            ) : (
                              <MoonIcon className="h-4 w-4" />
                            )}
                            Toggle Theme
                          </button>
                          <button
                            onClick={() => {
                              logout();
                              setShowMobileMenu(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
