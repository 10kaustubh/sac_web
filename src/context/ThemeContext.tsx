import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  setThemeColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'sac_clone_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { mode: 'light', primaryColor: '#0a6ed1' };
      }
    }
    return { mode: 'light', primaryColor: '#0a6ed1' };
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    
    // Apply theme to document
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }));
  };

  const setThemeColor = (color: string) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: color
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
