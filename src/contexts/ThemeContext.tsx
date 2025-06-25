import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Calculate effective theme based on user preference and system
  const calculateEffectiveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Apply theme to DOM
  const applyTheme = (newEffectiveTheme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (newEffectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme-preference', newTheme);
    
    const newEffectiveTheme = calculateEffectiveTheme(newTheme);
    setEffectiveTheme(newEffectiveTheme);
    applyTheme(newEffectiveTheme);
  };

  // Toggle between light and dark (not system)
  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently on system, switch to opposite of current effective theme
      const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    } else {
      // Toggle between light and dark
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    // Get saved preference or default to system
    const savedTheme = localStorage.getItem('theme-preference') as Theme | null;
    const initialTheme = savedTheme || 'system';
    
    const initialEffectiveTheme = calculateEffectiveTheme(initialTheme);
    
    setThemeState(initialTheme);
    setEffectiveTheme(initialEffectiveTheme);
    applyTheme(initialEffectiveTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          const newEffectiveTheme = e.matches ? 'dark' : 'light';
          setEffectiveTheme(newEffectiveTheme);
          applyTheme(newEffectiveTheme);
        }
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } 
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleSystemThemeChange);
        return () => mediaQuery.removeListener(handleSystemThemeChange);
      }
    }
  }, [theme]); // theme is the only dependency we need here

  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get theme-aware styles
export const useThemeStyles = () => {
  const { effectiveTheme } = useTheme();
  
  return {
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
    effectiveTheme,
    
    // Common style combinations
    cardClass: 'card theme-shadow-md',
    buttonPrimaryClass: 'btn-primary',
    inputClass: 'form-input',
    textPrimaryClass: 'theme-text-primary',
    textSecondaryClass: 'theme-text-secondary',
    textMutedClass: 'theme-text-muted',
    bgPrimaryClass: 'theme-bg-primary',
    bgSecondaryClass: 'theme-bg-secondary',
    bgCardClass: 'theme-bg-card',
  };
};
