import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  DocumentTextIcon as DocumentTextIconSolid, 
  GlobeAltIcon as GlobeAltIconSolid, 
  ArrowRightStartOnRectangleIcon, 
  MoonIcon, 
  SunIcon, 
  Bars3Icon, 
  XMarkIcon,
  RssIcon as RssIconSolid
} from '@heroicons/react/24/solid';
import { 
  DocumentTextIcon as DocumentTextIconOutline, 
  GlobeAltIcon as GlobeAltIconOutline, 
  RssIcon as RssIconOutline
} from '@heroicons/react/24/outline';
import logo from '../assets/ruminster_logo.png';
import { useTheme } from '../contexts/ThemeContext';
import Tooltip from './Tooltip';
import UserAvatar from './UserAvatar';

interface NavbarProps {
  onNewRumination: () => void;
}

export default function Navbar({ onNewRumination }: NavbarProps) {
  const location = useLocation();
  const { isAuthenticated, logout, requiresTosAcceptance, user } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getPageTitle = (): string => {
    const path = location.pathname;
    if (path === '/my-ruminations') return 'My Ruminations';
    if (path === '/my-feed') return 'My Feed';
    if (path === '/public') return 'Explore';
    if (path.startsWith('/user/')) return 'User Profile';
    if (path === '/login') return 'Sign In';
    if (path === '/terms-of-service') return 'Terms of Service';
    if (path === '/terms-acceptance') return 'Terms Acceptance';
    if (path === '/activate') return 'Activate Account';
    if (path === '/forgot-password') return 'Forgot Password';
    if (path === '/reset-password') return 'Reset Password';
    return 'Ruminster';
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 z-40">
        <div className="h-full flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/public" className="hover:scale-105 transition-transform duration-200">
              <img src={logo} alt="Ruminster" className="h-8 w-auto" />
            </Link>
          </div>
          
          {/* Page Title */}
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>
          
          {/* User Avatar or Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Tooltip content={effectiveTheme === 'dark' ? 'Light Mode' : 'Dark Mode'} position="bottom">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors duration-150"
                  >
                    {effectiveTheme === 'dark' ? (
                      <SunIcon className="h-5 w-5" />
                    ) : (
                      <MoonIcon className="h-5 w-5" />
                    )}
                  </button>
                </Tooltip>
                <UserAvatar
                  userId={user?.id || ''}
                  username={user?.username || ''}
                  size="sm"
                  showUsername={false}
                  clickable={true}
                />
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors duration-150"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
        >
          {showSidebar ? (
            <XMarkIcon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          ) : (
            <Bars3Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
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
      <nav className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-20 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full pt-4">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col items-center py-6 space-y-6">

            {/* New Rumination Button */}
            {isAuthenticated && (
              <button
                onClick={requiresTosAcceptance ? undefined : () => {
                  onNewRumination();
                  setShowSidebar(false);
                }}
                disabled={requiresTosAcceptance}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  requiresTosAcceptance 
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed' 
                    : 'bg-accent hover:bg-primary text-white shadow-lg'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
            {isAuthenticated && (
              <>
                <Tooltip content="My Ruminations" position="right" offsetY={-25}>
                  <Link
                    to="/my-ruminations"
                    onClick={() => setShowSidebar(false)}
                    className={`flex p-3 rounded-lg transition-colors duration-150 ${
                      isActive('/my-ruminations')
                        ? 'text-primary dark:text-accent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {isActive('/my-ruminations') ? (
                      <DocumentTextIconSolid className="h-5 w-5" />
                    ) : (
                      <DocumentTextIconOutline className="h-5 w-5" />
                    )}
                  </Link>
                </Tooltip>
                
                <Tooltip content="My Feed" position="right" offsetY={-25}>
                  <Link
                    to="/my-feed"
                    onClick={() => setShowSidebar(false)}
                    className={`flex p-3 rounded-lg transition-colors duration-150 ${
                      isActive('/my-feed')
                        ? 'text-primary dark:text-accent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {isActive('/my-feed') ? (
                      <RssIconSolid className="h-5 w-5" />
                    ) : (
                      <RssIconOutline className="h-5 w-5" />
                    )}
                  </Link>
                </Tooltip>
              </>
            )}
            
            <Tooltip content="Explore" position="right" offsetY={-25}>
              <Link
                to="/public"
                onClick={() => setShowSidebar(false)}
                className={`flex p-3 rounded-lg transition-colors duration-150 ${
                  isActive('/public')
                    ? 'text-primary dark:text-accent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                {isActive('/public') ? (
                  <GlobeAltIconSolid className="h-5 w-5" />
                ) : (
                  <GlobeAltIconOutline className="h-5 w-5" />
                )}
              </Link>
            </Tooltip>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center space-y-4">
            {isAuthenticated ? (
              <>
                <Tooltip content={effectiveTheme === 'dark' ? 'Light Mode' : 'Dark Mode'} position="right" offsetY={-15}>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setShowSidebar(false);
                    }}
                    className="p-3 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors duration-150"
                  >
                    {effectiveTheme === 'dark' ? (
                      <SunIcon className="h-5 w-5" />
                    ) : (
                      <MoonIcon className="h-5 w-5" />
                    )}
                  </button>
                </Tooltip>
                <Tooltip content="Sign Out" position="right" offsetY={-15}>
                  <button
                    onClick={() => {
                      logout();
                      setShowSidebar(false);
                    }}
                    className="p-3 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-150"
                  >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                  </button>
                </Tooltip>
              </>
            ) : (
              <Tooltip content="Sign In" position="right" offsetY={-15}>
                <Link
                  to="/login"
                  onClick={() => setShowSidebar(false)}
                  className="flex p-3 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors duration-150"
                  title="Sign In"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              </Tooltip>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
