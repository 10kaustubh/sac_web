import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Database, Layout, ArrowRight, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SearchResult } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStory: (storyId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectStory }) => {
  const { searchAll, stories, setActiveStory, setActivePageIndex } = useData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('sac_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchAll(query);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, searchAll]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelectResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('sac_recent_searches', JSON.stringify(newRecent));

    if (result.type === 'story') {
      const story = stories.find(s => s.id === result.id);
      if (story) {
        setActiveStory(story);
        setActivePageIndex(0);
      }
    } else if (result.type === 'page' && result.storyId) {
      const story = stories.find(s => s.id === result.storyId);
      if (story) {
        const pageIndex = story.pages.findIndex(p => p.id === result.id);
        setActiveStory(story);
        setActivePageIndex(pageIndex >= 0 ? pageIndex : 0);
      }
    }
    
    onClose();
    setQuery('');
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('sac_recent_searches');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'story': return <FileText size={18} className="text-sap-blue" />;
      case 'model': return <Database size={18} className="text-green-500" />;
      case 'page': return <Layout size={18} className="text-orange-500" />;
      default: return <FileText size={18} className="text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search stories, pages, models..."
            className="flex-1 text-lg outline-none bg-transparent dark:text-white"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X size={18} className="text-gray-400" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            // Recent Searches
            <div className="p-4">
              {recentSearches.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Searches</h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-sap-blue hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentSearch(search)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                      >
                        <Clock size={16} className="text-gray-400" />
                        <span className="dark:text-white">{search}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Search size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Start typing to search</p>
                  <p className="text-sm mt-1">Search for stories, pages, or data models</p>
                </div>
              )}
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, idx) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelectResult(result)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    idx === selectedIndex
                      ? 'bg-sap-blue/10 border border-sap-blue'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sap-dark dark:text-white truncate">{result.title}</h4>
                      <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 capitalize">
                        {result.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{result.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
              to select
            </span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
