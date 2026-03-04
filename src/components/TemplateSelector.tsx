import React, { useState } from 'react';
import { X, BarChart2, TrendingUp, DollarSign, Users, Package, Megaphone, Factory, FileText, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { StoryTemplate, Widget, Page } from '../types';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const templateIcons: { [key: string]: React.FC<{ size?: number; className?: string }> } = {
  'template1': BarChart2,
  'template2': TrendingUp,
  'template3': DollarSign,
  'template4': FileText,
  'template5': Users,
  'template6': Package,
  'template7': Megaphone,
  'template8': Factory,
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose }) => {
  const { templates, createStory, setActiveStory, stories, setActivePageIndex } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Finance', 'Sales', 'HR', 'Operations', 'Marketing', 'General'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        // Create a deep copy of the template pages with new IDs
        const newPages: Page[] = template.pages.map((page, pageIndex) => {
          const newPageId = `page-${Date.now()}-${pageIndex}`;
          const newWidgets: Widget[] = page.widgets.map((widget, widgetIndex) => ({
            ...widget,
            id: `widget-${Date.now()}-${pageIndex}-${widgetIndex}`,
            dimensions: widget.dimensions.map(d => ({ ...d })),
            measures: widget.measures.map(m => ({ ...m })),
            filters: widget.filters ? widget.filters.map(f => ({ ...f })) : [],
            variance: widget.variance ? { ...widget.variance } : undefined,
            drillDown: widget.drillDown ? { ...widget.drillDown } : undefined,
          }));
          
          return {
            ...page,
            id: newPageId,
            widgets: newWidgets,
            layout: page.layout ? page.layout.map(l => ({ ...l })) : [],
            linkedAnalysis: page.linkedAnalysis !== false,
          };
        });

        // Create the story with the template data
        const newStoryId = `story-${Date.now()}`;
        const newStory = {
          id: newStoryId,
          title: `${template.name} - Copy`,
          description: template.description,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          author: 'Current User',
          isSaved: false,
          isFavorite: false,
          template: template.id,
          tags: [],
          version: 1,
          bookmarks: [],
          pages: newPages
        };

        // Set active story directly
        setActiveStory(newStory);
        setActivePageIndex(0);
        onClose();
      }
    }
  };

  const getTemplateIcon = (templateId: string) => {
    const IconComponent = templateIcons[templateId] || FileText;
    return IconComponent;
  };

  const getWidgetCount = (template: StoryTemplate) => {
    return template.pages.reduce((total, page) => total + page.widgets.length, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-sap-dark dark:text-white">Create New Story</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a template to get started</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-sap-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => {
              const IconComponent = getTemplateIcon(template.id);
              const isSelected = selectedTemplate === template.id;
              const widgetCount = getWidgetCount(template);
              
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-sap-blue rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-sap-blue/20' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <IconComponent size={24} className={isSelected ? 'text-sap-blue' : 'text-gray-500 dark:text-gray-400'} />
                  </div>
                  <h3 className={`font-medium text-sm ${isSelected ? 'text-sap-blue' : 'text-sap-dark dark:text-white'}`}>
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400">
                      {template.pages.length} {template.pages.length === 1 ? 'page' : 'pages'}
                    </span>
                    {widgetCount > 0 && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
                        {widgetCount} widgets
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedTemplate 
                ? `Selected: ${templates.find(t => t.id === selectedTemplate)?.name} (${getWidgetCount(templates.find(t => t.id === selectedTemplate)!)} widgets)`
                : 'Select a template to continue'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUseTemplate}
                disabled={!selectedTemplate}
                className="px-6 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
