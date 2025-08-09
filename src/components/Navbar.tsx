import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { BookOpenIcon, RssIcon, GlobeAltIcon, PlusIcon, ArrowLeftEndOnRectangleIcon, MoonIcon, SunIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/ruminster_logo.png';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  onNewRumination: () => void;
}

export default function Navbar({ onNewRumination }: NavbarProps) {
  const location = useLocation();
  const { isAuthenticated, logout, requiresTosAcceptance } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {showSidebar ? (
            <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-background-secondary shadow-lg border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/public" onClick={() => setShowSidebar(false)}>
              <img src={logo} alt="Ruminster" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6 space-y-2">
            {isAuthenticated && (
              <>
                <Link
                  to="/my-ruminations"
                  onClick={() => setShowSidebar(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-ruminations')
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  <BookOpenIcon className="h-5 w-5" />
                  <span>My Ruminations</span>
                </Link>
                
                <Link
                  to="/my-feed"
                  onClick={() => setShowSidebar(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-feed')
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  <RssIcon className="h-5 w-5" />
                  <span>My Feed</span>
                </Link>
              </>
            )}
            
            <Link
              to="/public"
              onClick={() => setShowSidebar(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/public')
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
              }`}
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span>Public</span>
            </Link>

            {/* New Rumination Button */}
            {isAuthenticated && (
              <button
                onClick={requiresTosAcceptance ? undefined : () => {
                  onNewRumination();
                  setShowSidebar(false);
                }}
                disabled={requiresTosAcceptance}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-4 ${
                  requiresTosAcceptance 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Rumination</span>
              </button>
            )}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowSidebar(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                >
                  {effectiveTheme === 'dark' ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                  <span>Toggle Theme</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowSidebar(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setShowSidebar(false)}
                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
