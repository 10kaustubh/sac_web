import React, { useState } from 'react';
import { Search, Bell, User, HelpCircle, Moon, Sun, Command } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SearchModal } from './SearchModal';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-14 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-80"
          >
            <Search size={18} className="text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">Search stories, models, data...</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded text-gray-500 dark:text-gray-400">
                <Command size={12} className="inline" />
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded text-gray-500 dark:text-gray-400">
                K
              </kbd>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title={theme.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme.mode === 'light' ? (
              <Moon size={20} className="text-gray-600" />
            ) : (
              <Sun size={20} className="text-yellow-400" />
            )}
          </button>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <HelpCircle size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative">
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-sap-blue rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </button>
        </div>
      </header>

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStory={() => {}}
      />
    </>
  );
};
