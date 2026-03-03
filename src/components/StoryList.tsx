import React from 'react';
import { FileText, Calendar, User, Trash2, Check, AlertCircle } from 'lucide-react';
import { Story } from '../types';

interface StoryListProps {
  stories: Story[];
  onStoryClick: (story: Story) => void;
  onDelete?: (storyId: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({ stories, onStoryClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this story?')) {
      onDelete(storyId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-sap-dark dark:text-white">Recent Stories</h3>
      </div>
      <div className="divide-y dark:divide-gray-700 max-h-96 overflow-y-auto">
        {stories.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No stories yet. Create your first story!
          </div>
        ) : (
          stories.map((story) => (
            <div 
              key={story.id} 
              onClick={() => onStoryClick(story)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-sap-blue/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-sap-blue" size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sap-dark dark:text-white">{story.title}</h4>
                    {story.isSaved ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
                        <Check size={10} />
                        Saved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded">
                        <AlertCircle size={10} />
                        Unsaved
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{story.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {story.updatedAt || story.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} /> {story.author}
                    </span>
                    <span className="text-sap-blue">
                      {story.pages.length} page{story.pages.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onDelete && (
                  <button 
                    onClick={(e) => handleDelete(e, story.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full text-gray-400 hover:text-red-500"
                    title="Delete story"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
