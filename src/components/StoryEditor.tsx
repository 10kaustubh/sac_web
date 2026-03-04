import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Save, Check, Trash2, Download, MoreVertical, Sparkles, Bookmark, Link, Unlink, Search, Copy, FileText, Database } from 'lucide-react';
import { useData } from '../context/DataContext';
import { WidgetRenderer } from './WidgetRenderer';
import { EditWidgetModal } from './EditWidgetModal';
import { FilterBar } from './FilterBar';
import { SearchToInsight } from './SearchToInsight';
import { SmartInsightsPanel } from './SmartInsightsPanel';
import { BookmarksPanel } from './BookmarksPanel';
import { Widget } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Save Dialog Component
const SaveDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  currentTitle: string;
  currentDescription: string;
  isSaveAs?: boolean;
}> = ({ isOpen, onClose, onSave, currentTitle, currentDescription, isSaveAs }) => {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);

  React.useEffect(() => {
    setTitle(currentTitle);
    setDescription(currentDescription);
  }, [currentTitle, currentDescription, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-sap-dark dark:text-white mb-4">
          {isSaveAs ? 'Save Story As' : 'Save Story'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title"
              className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter story description"
              rows={3}
              className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave(title, description);
                onClose();
              }
            }}
            disabled={!title.trim()}
            className="px-4 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Copy to Page Dialog Component
const CopyToPageDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCopy: (pageId: string) => void;
  pages: { id: string; title: string }[];
  currentPageId: string;
}> = ({ isOpen, onClose, onCopy, pages, currentPageId }) => {
  const [selectedPageId, setSelectedPageId] = useState('');

  if (!isOpen) return null;

  const otherPages = pages.filter(p => p.id !== currentPageId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-sap-dark dark:text-white mb-4">
          Copy Widget to Page
        </h2>
        {otherPages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No other pages available. Create a new page first.
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            {otherPages.map(page => (
              <button
                key={page.id}
                onClick={() => setSelectedPageId(page.id)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  selectedPageId === page.id
                    ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="dark:text-white">{page.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedPageId) {
                onCopy(selectedPageId);
                onClose();
              }
            }}
            disabled={!selectedPageId || otherPages.length === 0}
            className="px-4 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export const StoryEditor: React.FC = () => {
  const { 
    activeStory, 
    activePageIndex, 
    setActiveStory, 
    setActivePageIndex,
    addPageToStory,
    deletePageFromStory,
    addWidgetToPage,
    updateWidget,
    duplicateWidget,
    copyWidgetToPage,
    deleteWidget,
    saveStory,
    saveStoryAs,
    filters,
    applyFilter,
    resetFilters,
    clearWidgetFilters,
    widgetFilters,
    linkedAnalysisEnabled,
    toggleLinkedAnalysis,
    dataModels,
    selectedModel,
    selectModel
  } = useData();
  
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showPageMenu, setShowPageMenu] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isNLPSearchOpen, setIsNLPSearchOpen] = useState(false);
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);
  const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSaveAsDialog, setIsSaveAsDialog] = useState(false);
  const [copyToPageWidget, setCopyToPageWidget] = useState<string | null>(null);

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

  const handleNLPCreateWidget = (widgetConfig: Partial<Widget>) => {
    if (currentPage) {
      const widget = {
        ...widgetConfig,
        id: `widget-${Date.now()}`,
        filters: []
      } as Widget;
      addWidgetToPage(activeStory.id, currentPage.id, widget);
    }
  };

  const handleDuplicateWidget = (widgetId: string) => {
    if (currentPage) {
      duplicateWidget(activeStory.id, currentPage.id, widgetId);
    }
  };

  const handleCopyToPage = (widgetId: string, toPageId: string) => {
    if (currentPage) {
      copyWidgetToPage(activeStory.id, currentPage.id, widgetId, toPageId);
    }
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

  const handleDeletePage = (pageId: string) => {
    if (activeStory.pages.length > 1) {
      if (window.confirm('Are you sure you want to delete this page?')) {
        deletePageFromStory(activeStory.id, pageId);
        setShowPageMenu(null);
      }
    } else {
      alert('Cannot delete the only page in the story.');
    }
  };

  const handleSaveStory = (title?: string) => {
    setSaveStatus('saving');
    saveStory(activeStory.id, title);
    setShowSaveMenu(false);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleSaveAsStory = (title: string, description: string) => {
    setSaveStatus('saving');
    saveStoryAs(activeStory.id, title, description);
    setShowSaveMenu(false);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const openSaveDialog = () => {
    setIsSaveAsDialog(false);
    setIsSaveDialogOpen(true);
    setShowSaveMenu(false);
  };

  const openSaveAsDialog = () => {
    setIsSaveAsDialog(true);
    setIsSaveDialogOpen(true);
    setShowSaveMenu(false);
  };

  const handleModelChange = (modelId: string) => {
    selectModel(modelId);
    setShowModelMenu(false);
  };

  const handleExportPDF = async () => {
    const content = document.getElementById('story-content');
    if (content) {
      try {
        const canvas = await html2canvas(content, { scale: 2, backgroundColor: '#f3f4f6' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${activeStory.title.replace(/\s+/g, '_')}.pdf`);
      } catch (error) {
        console.error('PDF export failed:', error);
      }
    }
    setShowExportMenu(false);
  };

  const handleExportImage = async () => {
    const content = document.getElementById('story-content');
    if (content) {
      try {
        const canvas = await html2canvas(content, { scale: 2, backgroundColor: '#f3f4f6' });
        const link = document.createElement('a');
        link.download = `${activeStory.title.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Image export failed:', error);
      }
    }
    setShowExportMenu(false);
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
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Story Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                clearWidgetFilters();
                setActiveStory(null);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft size={20} className="dark:text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-sap-dark dark:text-white">{activeStory.title}</h1>
                {!activeStory.isSaved && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    Unsaved
                  </span>
                )}
                {widgetFilters.length > 0 && (
                  <button
                    onClick={clearWidgetFilters}
                    className="text-xs bg-sap-blue/10 text-sap-blue px-2 py-0.5 rounded flex items-center gap-1 hover:bg-sap-blue/20"
                  >
                    Clear {widgetFilters.length} filter{widgetFilters.length > 1 ? 's' : ''}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{activeStory.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
              >
                <Database size={16} />
                <span className="hidden md:inline max-w-[120px] truncate">{selectedModel?.name || 'Select Model'}</span>
              </button>
              {showModelMenu && (
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[200px]">
                  {dataModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-between ${
                        selectedModel?.id === model.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'dark:text-white'
                      }`}
                    >
                      <span>{model.name}</span>
                      {selectedModel?.id === model.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Analysis Toggle */}
            <button
              onClick={toggleLinkedAnalysis}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                linkedAnalysisEnabled 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
              title={linkedAnalysisEnabled ? 'Linked Analysis On' : 'Linked Analysis Off'}
            >
              {linkedAnalysisEnabled ? <Link size={16} /> : <Unlink size={16} />}
              <span className="hidden md:inline">Linked</span>
            </button>

            {/* Smart Insights */}
            <button
              onClick={() => setIsInsightsPanelOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50"
            >
              <Sparkles size={16} />
              <span className="hidden md:inline">Insights</span>
            </button>

            {/* Bookmarks */}
            <button
              onClick={() => setIsBookmarksPanelOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50"
            >
              <Bookmark size={16} />
              <span className="hidden md:inline">{activeStory.bookmarks?.length || 0}</span>
            </button>

            {/* Search to Insight */}
            <button
              onClick={() => setIsNLPSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
            >
              <Search size={16} />
              <span className="hidden md:inline">Ask</span>
            </button>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-3 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download size={18} className="dark:text-white" />
                <span className="dark:text-white hidden md:inline">Export</span>
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[150px]">
                  <button
                    onClick={handleExportPDF}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={handleExportImage}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
                  >
                    Export as Image
                  </button>
                </div>
              )}
            </div>

            {/* Save Button with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSaveMenu(!showSaveMenu)}
                disabled={saveStatus === 'saving'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  saveStatus === 'saved'
                    ? 'bg-green-500 text-white'
                    : 'bg-sap-blue text-white hover:bg-blue-700'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                    Save
                  </>
                )}
              </button>
              {showSaveMenu && saveStatus === 'idle' && (
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[150px]">
                  <button
                    onClick={openSaveDialog}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={openSaveAsDialog}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
                  >
                    Save As...
                  </button>
                </div>
              )}
            </div>

            {/* Add Widget Button */}
            <button
              onClick={openAddWidget}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus size={18} />
              Add Widget
            </button>
          </div>
        </div>
      </div>

      {/* Model Info Bar */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b dark:border-gray-700 px-4 py-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-2">
            <Database size={14} />
            {selectedModel?.name}
          </span>
          <span className="text-gray-500 dark:text-gray-400">|</span>
          <span className="text-gray-600 dark:text-gray-400">{selectedModel?.description}</span>
          <span className="text-gray-500 dark:text-gray-400">|</span>
          <span className="text-gray-600 dark:text-gray-400">{selectedModel?.rowCount?.toLocaleString()} rows</span>
        </div>
      </div>

      {/* Filters - Now dynamic based on model */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <FilterBar filters={filters} onFilterChange={applyFilter} onResetAll={resetFilters} />
      </div>

      {/* Page Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={activePageIndex === 0}
            className={`p-1 rounded ${activePageIndex === 0 ? 'text-gray-300 dark:text-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            {activeStory.pages.map((page, index) => (
              <div key={page.id} className="relative">
                <button
                  onClick={() => setActivePageIndex(index)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setShowPageMenu(page.id);
                  }}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                    index === activePageIndex
                      ? 'bg-sap-blue text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {page.title}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPageMenu(showPageMenu === page.id ? null : page.id);
                    }}
                    className="ml-1 p-0.5 rounded hover:bg-black/10"
                  >
                    <MoreVertical size={12} />
                  </button>
                </button>

                {/* Page Menu */}
                {showPageMenu === page.id && (
                  <div className="absolute top-8 left-0 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[120px]">
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      disabled={activeStory.pages.length <= 1}
                      className={`w-full px-3 py-1.5 text-left text-sm flex items-center gap-2 ${
                        activeStory.pages.length <= 1
                          ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed'
                          : 'text-red-500 hover:bg-red-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Trash2 size={14} />
                      Delete Page
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={goToNextPage}
            disabled={activePageIndex === activeStory.pages.length - 1}
            className={`p-1 rounded ${activePageIndex === activeStory.pages.length - 1 ? 'text-gray-300 dark:text-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'}`}
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
              className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
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
              className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
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
      <div id="story-content" className="flex-1 overflow-auto p-6">
        {currentPage && currentPage.widgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPage.widgets.map((widget) => (
              <div key={widget.id} className="relative group">
                <WidgetRenderer
                  widget={widget}
                  onEdit={() => handleEditWidget(widget)}
                  onDuplicate={() => handleDuplicateWidget(widget.id)}
                  onDelete={() => handleDeleteWidget(widget.id)}
                />
                {/* Copy to Page Button */}
                {activeStory.pages.length > 1 && (
                  <button
                    onClick={() => setCopyToPageWidget(widget.id)}
                    className="absolute top-2 right-24 p-1.5 bg-white dark:bg-gray-700 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-600"
                    title="Copy to another page"
                  >
                    <Copy size={14} className="text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center max-w-md">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-gray-400" />
              </div>
              <p className="text-lg mb-2 dark:text-white">No widgets on this page</p>
              <p className="text-sm text-gray-400 mb-4">Add charts, KPIs, or tables to visualize your data</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={openAddWidget}
                  className="flex items-center gap-2 bg-sap-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Widget
                </button>
                <button
                  onClick={() => setIsNLPSearchOpen(true)}
                  className="flex items-center gap-2 border border-sap-blue text-sap-blue px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Sparkles size={18} />
                  Ask a Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close menus when clicking outside */}
      {(showPageMenu || showExportMenu || showSaveMenu || showModelMenu) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowPageMenu(null);
            setShowExportMenu(false);
            setShowSaveMenu(false);
            setShowModelMenu(false);
          }}
        />
      )}

      {/* Modals and Panels */}
      <EditWidgetModal
        isOpen={isWidgetModalOpen}
        widget={editingWidget}
        onClose={() => {
          setIsWidgetModalOpen(false);
          setEditingWidget(null);
        }}
        onSave={handleSaveWidget}
      />

      <SearchToInsight
        isOpen={isNLPSearchOpen}
        onClose={() => setIsNLPSearchOpen(false)}
        onCreateWidget={handleNLPCreateWidget}
      />

      <SmartInsightsPanel
        isOpen={isInsightsPanelOpen}
        onClose={() => setIsInsightsPanelOpen(false)}
      />

      <BookmarksPanel
        isOpen={isBookmarksPanelOpen}
        onClose={() => setIsBookmarksPanelOpen(false)}
      />

      <SaveDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={isSaveAsDialog ? handleSaveAsStory : (title) => handleSaveStory(title)}
        currentTitle={activeStory.title}
        currentDescription={activeStory.description}
        isSaveAs={isSaveAsDialog}
      />

      <CopyToPageDialog
        isOpen={copyToPageWidget !== null}
        onClose={() => setCopyToPageWidget(null)}
        onCopy={(pageId) => {
          if (copyToPageWidget) {
            handleCopyToPage(copyToPageWidget, pageId);
          }
        }}
        pages={activeStory.pages}
        currentPageId={currentPage?.id || ''}
      />
    </div>
  );
};
