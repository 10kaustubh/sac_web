import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { WidgetRenderer } from './WidgetRenderer';
import { EditWidgetModal } from './EditWidgetModal';
import { FilterBar } from './FilterBar';
import { Widget } from '../types';

export const StoryEditor: React.FC = () => {
  const { 
    activeStory, 
    activePageIndex, 
    setActiveStory, 
    setActivePageIndex,
    addPageToStory,
    addWidgetToPage,
    updateWidget,
    deleteWidget,
    saveStory,
    filters,
    applyFilter
  } = useData();
  
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  if (!activeStory) return null;

  const currentPage = activeStory.pages[activePageIndex];

  const handleEditWidget = (widget: Widget) => {
    setEditingWidget(widget);
    setIsWidgetModalOpen(true);
  };

  const handleSaveWidget = (widget: Widget) => {
    if (currentPage) {
      if (editingWidget) {
        updateWidget(activeStory.id, currentPage.id, widget.id, widget);
      } else {
        addWidgetToPage(activeStory.id, currentPage.id, widget);
      }
    }
    setEditingWidget(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (currentPage && window.confirm('Are you sure you want to delete this widget?')) {
      deleteWidget(activeStory.id, currentPage.id, widgetId);
    }
  };

  const handleAddPage = () => {
    if (newPageTitle.trim()) {
      addPageToStory(activeStory.id, newPageTitle);
      setNewPageTitle('');
      setShowAddPage(false);
    }
  };

  const handleSaveStory = () => {
    setSaveStatus('saving');
    saveStory(activeStory.id);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const goToPrevPage = () => {
    if (activePageIndex > 0) {
      setActivePageIndex(activePageIndex - 1);
    }
  };

  const goToNextPage = () => {
    if (activePageIndex < activeStory.pages.length - 1) {
      setActivePageIndex(activePageIndex + 1);
    }
  };

  const openAddWidget = () => {
    setEditingWidget(null);
    setIsWidgetModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Story Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveStory(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-sap-dark">{activeStory.title}</h1>
                {!activeStory.isSaved && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    Unsaved
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{activeStory.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveStory}
              disabled={saveStatus === 'saving'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                saveStatus === 'saved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-sap-dark'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check size={18} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Story
                </>
              )}
            </button>
            <button
              onClick={openAddWidget}
              className="flex items-center gap-2 bg-sap-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Widget
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-gray-50 border-b">
        <FilterBar filters={filters} onFilterChange={applyFilter} />
      </div>

      {/* Page Navigation */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={activePageIndex === 0}
            className={`p-1 rounded ${activePageIndex === 0 ? 'text-gray-300' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            {activeStory.pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setActivePageIndex(index)}
                className={`px-3 py-1 rounded text-sm ${
                  index === activePageIndex
                    ? 'bg-sap-blue text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
          <button
            onClick={goToNextPage}
            disabled={activePageIndex === activeStory.pages.length - 1}
            className={`p-1 rounded ${activePageIndex === activeStory.pages.length - 1 ? 'text-gray-300' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {showAddPage ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="Page title"
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPage();
                if (e.key === 'Escape') setShowAddPage(false);
              }}
            />
            <button
              onClick={handleAddPage}
              className="text-sm bg-sap-blue text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddPage(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddPage(true)}
            className="flex items-center gap-1 text-sm text-sap-blue hover:underline"
          >
            <Plus size={16} />
            Add Page
          </button>
        )}
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-100">
        {currentPage && currentPage.widgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPage.widgets.map((widget) => (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                onEdit={() => handleEditWidget(widget)}
                onDelete={() => handleDeleteWidget(widget.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-gray-400" />
              </div>
              <p className="text-lg mb-2">No widgets on this page</p>
              <p className="text-sm text-gray-400 mb-4">Add charts, KPIs, or tables to visualize your data</p>
              <button
                onClick={openAddWidget}
                className="flex items-center gap-2 bg-sap-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-auto"
              >
                <Plus size={18} />
                Add Your First Widget
              </button>
            </div>
          </div>
        )}
      </div>

      <EditWidgetModal
        isOpen={isWidgetModalOpen}
        widget={editingWidget}
        onClose={() => {
          setIsWidgetModalOpen(false);
          setEditingWidget(null);
        }}
        onSave={handleSaveWidget}
      />
    </div>
  );
};
