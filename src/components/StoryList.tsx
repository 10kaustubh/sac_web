import React from 'react';
import { FileText, Clock, User, MoreVertical, Star, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Story } from '../types';
import { useData } from '../context/DataContext';

interface StoryListProps {
  stories: Story[];
  onOpenStory?: (storyId: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({ stories, onOpenStory }) => {
  const { deleteStory, setActiveStory, setActivePageIndex } = useData();
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  const handleOpenStory = (story: Story) => {
    if (onOpenStory) {
      onOpenStory(story.id);
    } else {
      setActiveStory(story);
      setActivePageIndex(0);
    }
  };

  const handleDelete = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this story?')) {
      deleteStory(storyId);
    }
    setMenuOpen(null);
  };

  const handleDuplicate = (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();
    // TODO: Implement duplicate functionality
    setMenuOpen(null);
  };

  if (stories.length === 0) {
    return (
      <div className="p-8 text-center">
        <FileText size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">No stories yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first story to get started</p>
      </div>
    );
  }

  return (
    <div className="divide-y dark:divide-gray-700">
      {stories.map((story) => (
        <div
          key={story.id}
          onClick={() => handleOpenStory(story)}
          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-4 relative"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={24} className="text-sap-blue" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sap-dark dark:text-white truncate">{story.title}</h3>
              {story.isFavorite && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
              {!story.isSaved && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Draft</span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{story.description}</p>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <User size={12} />
                {story.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {story.updatedAt}
              </span>
              <span>{story.pages?.length || 1} page{(story.pages?.length || 1) > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(menuOpen === story.id ? null : story.id);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {menuOpen === story.id && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(null);
                  }}
                />
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[140px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenStory(story);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 dark:text-white"
                  >
                    <ExternalLink size={14} />
                    Open
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(e, story)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 dark:text-white"
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, story.id)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 text-red-500"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
