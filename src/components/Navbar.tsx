import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  DocumentTextIcon as DocumentTextIconSolid, 
  GlobeAltIcon as GlobeAltIconSolid, 
  ArrowRightStartOnRectangleIcon, 
  MoonIcon, 
  SunIcon, 
  RssIcon as RssIconSolid,
  UserIcon,
  ChevronDownIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/solid';
import { 
  DocumentTextIcon as DocumentTextIconOutline, 
  GlobeAltIcon as GlobeAltIconOutline, 
  RssIcon as RssIconOutline,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import logo from '../assets/ruminster_logo.png';
import { useTheme } from '../contexts/ThemeContext';
import Tooltip from './Tooltip';
import SearchBar from './SearchBar';
import SearchDialog from './SearchDialog';
import { NameChangeDialog } from './NameChangeDialog';

interface NavbarProps {
  onNewRumination: () => void;
}

export default function Navbar({ onNewRumination }: NavbarProps) {
  const location = useLocation();
  const { isAuthenticated, logout, requiresTosAcceptance, user } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [nameChangeOpen, setNameChangeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  // Helper function to get avatar color
  const getAvatarColor = (seed: string): string => {
    const COLORS = [
      'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500', 
      'bg-purple-500', 'bg-teal-500', 'bg-yellow-500', 'bg-indigo-500',
      'bg-rose-500', 'bg-emerald-500', 'bg-violet-500', 'bg-sky-500',
      'bg-amber-500', 'bg-lime-500', 'bg-cyan-500', 'bg-fuchsia-500',
      'bg-red-500', 'bg-slate-500', 'bg-zinc-500', 'bg-neutral-500'
    ];
    
  if (!seed) return COLORS[0];
  const hash = seed.charCodeAt(0) + (seed.charCodeAt(seed.length - 1) || 0);
    return COLORS[hash % COLORS.length];
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
        <div className="relative h-full grid grid-cols-[auto_1fr_auto] items-center px-4 md:px-6">
          {/* Left: Logo + Search (desktop) */}
          <div className="flex items-center gap-3">
            <Link to="/public" className="hover:scale-105 transition-transform duration-200">
              <img src={logo} alt="Ruminster" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Middle: Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <h1 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white text-center">
              {getPageTitle()}
            </h1>
          </div>
          
          {/* Right: User Avatar or Actions */}
          <div className="flex items-center gap-1 md:gap-3 justify-end">
            {/* Mobile search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors duration-150 md:hidden"
              aria-label="Open search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            {isAuthenticated ? (
              <>
                {/* Search next to logo on desktop */}
                <div className="hidden md:block w-66 lg:w-96 mr-2">
                  <SearchBar />
                </div>
                
                {/* Standalone theme toggle (desktop only) */}
                <Tooltip content={effectiveTheme === 'dark' ? 'Light Mode' : 'Dark Mode'} position="bottom" disabled={isMobile}>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors duration-150 hidden md:inline-flex"
                  >
                    {effectiveTheme === 'dark' ? (
                      <SunIcon className="h-5 w-5" />
                    ) : (
                      <MoonIcon className="h-5 w-5" />
                    )}
                  </button>
                </Tooltip>
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                  >
                    <div className={`h-8 w-8 ${getAvatarColor((user?.username || user?.name) || '')} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {(user?.name || user?.username) ? (user?.name || user?.username).charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''} hidden md:block`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {user?.name || user?.username}
                        </p>
                        {user?.username && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400">Signed in</p>
                      </div>

                      {/* Theme toggle inside user menu for mobile (and available on desktop) */}
                      <button
                        onClick={() => { toggleTheme(); setShowUserDropdown(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150"
                      >
                        {effectiveTheme === 'dark' ? (
                          <SunIcon className="h-4 w-4" />
                        ) : (
                          <MoonIcon className="h-4 w-4" />
                        )}
                        Toggle Theme
                      </button>
                      
                      <Link
                        to={`/user/${user?.id}`}
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150"
                      >
                        <UserIcon className="h-4 w-4" />
                        View Profile
                      </Link>
                      
                      <button
                        onClick={() => {
                          setNameChangeOpen(true);
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Change Name
                      </button>
                      
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                      >
                        <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 z-40">
        <div className="h-full flex items-center justify-around px-4 gap-2">
          {/* Explore */}
          <Link
            to="/public"
            className={`flex items-center justify-center p-2 rounded-lg transition-colors duration-150 ${
              isActive('/public')
                ? 'text-primary dark:text-accent'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            {isActive('/public') ? (
              <GlobeAltIconSolid className="h-7 w-7" />
            ) : (
              <GlobeAltIconOutline className="h-7 w-7" />
            )}
          </Link>

          {/* My Ruminations (auth) */}
          {isAuthenticated && (
            <Link
              to="/my-ruminations"
              className={`flex items-center justify-center p-2 rounded-lg transition-colors duration-150 ${
                isActive('/my-ruminations')
                  ? 'text-primary dark:text-accent'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              {isActive('/my-ruminations') ? (
                <DocumentTextIconSolid className="h-7 w-7" />
              ) : (
                <DocumentTextIconOutline className="h-6 w-6" />
              )}
            </Link>
          )}

          {/* My Feed (auth) */}
          {isAuthenticated && (
            <Link
              to="/my-feed"
              className={`flex items-center justify-center p-2 rounded-lg transition-colors duration-150 ${
                isActive('/my-feed')
                  ? 'text-primary dark:text-accent'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              {isActive('/my-feed') ? (
                <RssIconSolid className="h-7 w-7" />
              ) : (
                <RssIconOutline className="h-7 w-7" />
              )}
            </Link>
          )}
        </div>
      </nav>

      {/* Desktop Sidebar - Hidden on mobile */}
      <nav className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-20 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700 z-50">
        <div className="flex flex-col h-full pt-4">
          {/* Top spacer */}
          <div className="flex-1"></div>
          
          {/* Middle Navigation Links */}
          <div className="flex flex-col items-center py-6 space-y-6">
            {/* New Rumination Button */}
            {isAuthenticated && (
              <button
                onClick={requiresTosAcceptance ? undefined : onNewRumination}
                disabled={requiresTosAcceptance}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  requiresTosAcceptance 
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed' 
                    : 'bg-accent hover:bg-primary text-white shadow-lg'
                }`}
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
            {isAuthenticated && (
              <>
                <Tooltip content="My Ruminations" position="right" offsetY={-25} disabled={isMobile}>
                  <Link
                    to="/my-ruminations"
                    className={`flex p-3 rounded-lg transition-colors duration-150 ${
                      isActive('/my-ruminations')
                        ? 'text-primary dark:text-accent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {isActive('/my-ruminations') ? (
                      <DocumentTextIconSolid className="h-6 w-6" />
                    ) : (
                      <DocumentTextIconOutline className="h-6 w-6" />
                    )}
                  </Link>
                </Tooltip>
                
                <Tooltip content="My Feed" position="right" offsetY={-25} disabled={isMobile}>
                  <Link
                    to="/my-feed"
                    className={`flex p-3 rounded-lg transition-colors duration-150 ${
                      isActive('/my-feed')
                        ? 'text-primary dark:text-accent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {isActive('/my-feed') ? (
                      <RssIconSolid className="h-6 w-6" />
                    ) : (
                      <RssIconOutline className="h-6 w-6" />
                    )}
                  </Link>
                </Tooltip>
              </>
            )}
            
            <Tooltip content="Explore" position="right" offsetY={-25} disabled={isMobile}>
              <Link
                to="/public"
                className={`flex p-3 rounded-lg transition-colors duration-150 ${
                  isActive('/public')
                    ? 'text-primary dark:text-accent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                {isActive('/public') ? (
                  <GlobeAltIconSolid className="h-6 w-6" />
                ) : (
                  <GlobeAltIconOutline className="h-6 w-6" />
                )}
              </Link>
            </Tooltip>
          </div>
          
          {/* Bottom spacer */}
          <div className="flex-1"></div>
        </div>
      </nav>

      {/* Mobile FAB: New Rumination */}
      {isAuthenticated && (
        <button
          onClick={requiresTosAcceptance ? undefined : onNewRumination}
          disabled={requiresTosAcceptance}
          aria-label="New rumination"
          className={`md:hidden fixed bottom-20 right-4 z-50 p-4 rounded-full transition-all duration-200 shadow-lg ${
            requiresTosAcceptance
              ? 'bg-slate-400 text-slate-600 cursor-not-allowed'
              : 'bg-accent hover:bg-primary text-white'
          }`}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      )}

  {/* Search Dialog for mobile icon */}
  <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  
   {/* Name Change Dialog */}
   <NameChangeDialog isOpen={nameChangeOpen} onClose={() => setNameChangeOpen(false)} />
    </>
  );
}
