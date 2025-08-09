import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  DocumentTextIcon, 
  GlobeAltIcon, 
  PlusIcon, 
  ArrowRightOnRectangleIcon, 
  MoonIcon, 
  SunIcon, 
  Bars3Icon, 
  XMarkIcon,
  RssIcon
} from '@heroicons/react/24/solid';
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
      <nav className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-8 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
            <Link to="/public" onClick={() => setShowSidebar(false)} className="hover:scale-105 transition-transform duration-200">
              <img src={logo} alt="Ruminster" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-6 py-8 space-y-1">

            {/* New Rumination Button */}
            {isAuthenticated && (
              <button
                onClick={requiresTosAcceptance ? undefined : () => {
                  onNewRumination();
                  setShowSidebar(false);
                }}
                disabled={requiresTosAcceptance}
                className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-200 mb-6 shadow-lg ${
                  requiresTosAcceptance 
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Rumination</span>
              </button>
            )}
            {isAuthenticated && (
              <>
                <Link
                  to="/my-ruminations"
                  onClick={() => setShowSidebar(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive('/my-ruminations')
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>My Ruminations</span>
                </Link>
                
                <Link
                  to="/my-feed"
                  onClick={() => setShowSidebar(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive('/my-feed')
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <RssIcon className="h-4 w-4" />
                  <span>My Feed</span>
                </Link>
              </>
            )}
            
            <Link
              to="/public"
              onClick={() => setShowSidebar(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive('/public')
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <GlobeAltIcon className="h-4 w-4" />
              <span>Explore</span>
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowSidebar(false);
                  }}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {effectiveTheme === 'dark' ? (
                    <SunIcon className="h-4 w-4" />
                  ) : (
                    <MoonIcon className="h-4 w-4" />
                  )}
                  <span>{effectiveTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowSidebar(false);
                  }}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setShowSidebar(false)}
                className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
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
