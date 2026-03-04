import React, { useState } from 'react';
import { X, Bookmark, Plus, Trash2, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({ isOpen, onClose }) => {
  const { activeStory, addBookmark, applyBookmark, deleteBookmark, filters } = useData();
  const [newBookmarkName, setNewBookmarkName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAddBookmark = () => {
    if (newBookmarkName.trim() && activeStory) {
      addBookmark(activeStory.id, newBookmarkName.trim());
      setNewBookmarkName('');
      setIsAdding(false);
    }
  };

  const handleApplyBookmark = (bookmarkId: string) => {
    if (activeStory) applyBookmark(activeStory.id, bookmarkId);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    if (activeStory && window.confirm('Delete this bookmark?')) deleteBookmark(activeStory.id, bookmarkId);
  };

  const bookmarks = activeStory?.bookmarks || [];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bookmark className="text-amber-500" size={20} />
            <h2 className="text-lg font-semibold dark:text-white">Bookmarks</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} className="dark:text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isAdding ? (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <input type="text" value={newBookmarkName} onChange={(e) => setNewBookmarkName(e.target.value)}
                placeholder="Bookmark name..." autoFocus
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 mb-2"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddBookmark(); if (e.key === 'Escape') setIsAdding(false); }} />
              <div className="flex gap-2">
                <button onClick={handleAddBookmark} disabled={!newBookmarkName.trim()}
                  className="flex-1 bg-amber-500 text-white px-3 py-1.5 rounded text-sm hover:bg-amber-600 disabled:opacity-50">Save</button>
                <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAdding(true)}
              className="w-full mb-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 hover:bg-amber-50">
              <Plus size={18} /> Add Bookmark
            </button>
          )}
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 text-gray-500"><Bookmark size={40} className="mx-auto mb-2 opacity-50" /><p>No bookmarks yet</p></div>
          ) : (
            <div className="space-y-2">
              {bookmarks.map(bookmark => (
                <div key={bookmark.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 group">
                  <div className="flex items-start justify-between">
                    <button onClick={() => handleApplyBookmark(bookmark.id)} className="flex-1 text-left">
                      <h4 className="font-medium text-gray-800 dark:text-white">{bookmark.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock size={12} />{new Date(bookmark.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                    <button onClick={() => handleDeleteBookmark(bookmark.id)}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
