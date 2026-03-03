import React, { useState } from 'react';
import { Bookmark, Plus, Trash2, X, Clock, Filter, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Bookmark as BookmarkType } from '../types';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({ isOpen, onClose }) => {
  const { activeStory, addBookmark, applyBookmark, deleteBookmark, filters, widgetFilters } = useData();
  const [newBookmarkName, setNewBookmarkName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [appliedBookmarkId, setAppliedBookmarkId] = useState<string | null>(null);

  if (!isOpen || !activeStory) return null;

  const bookmarks = activeStory.bookmarks || [];

  const handleAddBookmark = () => {
    if (newBookmarkName.trim() && activeStory) {
      addBookmark(activeStory.id, newBookmarkName.trim());
      setNewBookmarkName('');
      setIsAdding(false);
    }
  };

  const handleApplyBookmark = (bookmarkId: string) => {
    if (activeStory) {
      applyBookmark(activeStory.id, bookmarkId);
      setAppliedBookmarkId(bookmarkId);
      setTimeout(() => setAppliedBookmarkId(null), 2000);
    }
  };

  const handleDeleteBookmark = (e: React.MouseEvent, bookmarkId: string) => {
    e.stopPropagation();
    if (activeStory && window.confirm('Delete this bookmark?')) {
      deleteBookmark(activeStory.id, bookmarkId);
    }
  };

  const getActiveFiltersCount = (bookmark: BookmarkType) => {
    const filterCount = bookmark.filters.filter(f => f.selected !== 'All').length;
    const widgetFilterCount = bookmark.widgetFilters.length;
    return filterCount + widgetFilterCount;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Bookmark size={24} />
            <div>
              <h2 className="font-semibold">Bookmarks</h2>
              <p className="text-xs text-amber-100">Save & restore filter states</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Current State */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current State</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {filters.filter(f => f.selected !== 'All').length + widgetFilters.length} active filters
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {filters.filter(f => f.selected !== 'All').map(f => (
            <span key={f.id} className="text-xs px-2 py-1 bg-sap-blue/10 text-sap-blue rounded">
              {f.label}: {f.selected}
            </span>
          ))}
          {widgetFilters.map((wf, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
              {wf.field}: {wf.selectedValues.join(', ')}
            </span>
          ))}
          {filters.every(f => f.selected === 'All') && widgetFilters.length === 0 && (
            <span className="text-xs text-gray-400">No active filters</span>
          )}
        </div>
      </div>

      {/* Add Bookmark */}
      <div className="p-4 border-b dark:border-gray-700">
        {isAdding ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newBookmarkName}
              onChange={(e) => setNewBookmarkName(e.target.value)}
              placeholder="Bookmark name"
              className="flex-1 px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddBookmark();
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
            <button
              onClick={handleAddBookmark}
              disabled={!newBookmarkName.trim()}
              className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <Plus size={18} />
            Save Current State
          </button>
        )}
      </div>

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto p-4">
        {bookmarks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Bookmark size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No bookmarks yet</p>
            <p className="text-xs mt-1">Save your current filter state to quickly return to it later</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                onClick={() => handleApplyBookmark(bookmark.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  appliedBookmarkId === bookmark.id
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {appliedBookmarkId === bookmark.id ? (
                      <Check size={18} className="text-green-500 mt-0.5" />
                    ) : (
                      <Bookmark size={18} className="text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{bookmark.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={12} />
                        {formatDate(bookmark.createdAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteBookmark(e, bookmark.id)}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                {/* Bookmark filters preview */}
                <div className="mt-2 flex items-center gap-1 flex-wrap">
                  <Filter size={12} className="text-gray-400" />
                  {getActiveFiltersCount(bookmark) > 0 ? (
                    <>
                      {bookmark.filters.filter(f => f.selected !== 'All').slice(0, 2).map(f => (
                        <span key={f.id} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300">
                          {f.selected}
                        </span>
                      ))}
                      {getActiveFiltersCount(bookmark) > 2 && (
                        <span className="text-xs text-gray-400">
                          +{getActiveFiltersCount(bookmark) - 2} more
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">No filters</span>
                  )}
                </div>

                {appliedBookmarkId === bookmark.id && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Applied successfully
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} saved
        </p>
      </div>
    </div>
  );
};
