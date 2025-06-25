import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main toggle button */}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full shadow-lg bg-primary text-text-inverse hover:bg-primary-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2 mb-2"
        aria-label={`Current theme: ${theme}. Click to toggle theme`}
        title={`Current: ${theme} (${effectiveTheme}). Click to toggle`}
      >
        {effectiveTheme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.635-7.64 6.374-9.123a.75.75 0 01.976.937A7.501 7.501 0 0019.5 15.75a.75.75 0 01.937.976z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m8.485-8.485l-1.06 1.06M4.515 4.515l1.06 1.06M21 12h-1.5M4.5 12H3m15.485 4.485l-1.06-1.06M4.515 19.485l1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
        )}
      </button>

      {/* Theme selector dropdown */}
      <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[140px] opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none hover:pointer-events-auto">
        <div className="text-text-secondary text-sm font-medium mb-2 px-2">Theme</div>
        
        <button
          onClick={() => handleThemeChange('light')}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
            theme === 'light' 
              ? 'bg-primary text-text-inverse' 
              : 'text-text-primary hover:bg-surface'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m8.485-8.485l-1.06 1.06M4.515 4.515l1.06 1.06M21 12h-1.5M4.5 12H3m15.485 4.485l-1.06-1.06M4.515 19.485l1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          Light
        </button>
        
        <button
          onClick={() => handleThemeChange('dark')}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
            theme === 'dark' 
              ? 'bg-primary text-text-inverse' 
              : 'text-text-primary hover:bg-surface'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.635-7.64 6.374-9.123a.75.75 0 01.976.937A7.501 7.501 0 0019.5 15.75a.75.75 0 01.937.976z" />
          </svg>
          Dark
        </button>
        
        <button
          onClick={() => handleThemeChange('system')}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
            theme === 'system' 
              ? 'bg-primary text-text-inverse' 
              : 'text-text-primary hover:bg-surface'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
          </svg>
          System
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
