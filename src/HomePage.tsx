import React from 'react';
import { useAuth } from './AuthContext';
import { useThemeStyles } from './contexts/ThemeContext';

const HomePage = () => {
  const { logout } = useAuth();
  const themeStyles = useThemeStyles();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-text-primary font-sans px-4 text-center">
      <div className={`${themeStyles.cardClass} max-w-2xl w-full`}>
        <h1 className="text-4xl font-bold mb-6 text-text-primary">
          🚧 Under Construction 🚧
        </h1>
        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
          We're working hard to bring something great. Stay tuned!
        </p>
        
        {/* Theme demonstration section */}
        <div className="grid gap-4 mb-8">
          <div className="bg-background-secondary border border-border rounded-lg p-4">
            <h3 className="text-text-primary font-semibold mb-2">Theme System Active</h3>
            <p className="text-text-muted text-sm">
              Current theme: <span className="text-accent font-medium">{themeStyles.effectiveTheme}</span>
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <div className="bg-success text-text-inverse px-3 py-1 rounded text-sm">Success</div>
            <div className="bg-warning text-text-inverse px-3 py-1 rounded text-sm">Warning</div>
            <div className="bg-error text-text-inverse px-3 py-1 rounded text-sm">Error</div>
            <div className="bg-info text-text-inverse px-3 py-1 rounded text-sm">Info</div>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className={`${themeStyles.buttonPrimaryClass} w-full`}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
