import React, { useState } from 'react';
import { X, FileText, BarChart2, PieChart, Table, Layout } from 'lucide-react';
import { useData } from '../context/DataContext';
import { StoryTemplate } from '../types';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose }) => {
  const { templates, createStoryFromTemplate, createStory } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      createStoryFromTemplate(selectedTemplate);
      onClose();
    }
  };

  const handleBlankStory = () => {
    createStory('Untitled Story', 'New story description');
    onClose();
  };

  const getTemplateIcon = (thumbnail: string) => {
    switch (thumbnail) {
      case '📊': return <BarChart2 size={32} className="text-sap-blue" />;
      case '📈': return <PieChart size={32} className="text-green-500" />;
      case '💰': return <Table size={32} className="text-orange-500" />;
      case '📄': return <FileText size={32} className="text-gray-500" />;
      default: return <Layout size={32} className="text-sap-blue" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-sap-dark dark:text-white">Create New Story</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose a template or start from scratch</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-4 border-b dark:border-gray-700">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-sap-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Blank Template Card */}
            <div
              onClick={handleBlankStory}
              className="border-2 border-dashed dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-sap-blue hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mb-3">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="font-medium text-sap-dark dark:text-white">Blank Story</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">Start with an empty canvas</p>
            </div>

            {/* Template Cards */}
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-sap-blue bg-blue-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-600 hover:border-sap-blue hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getTemplateIcon(template.thumbnail)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sap-dark dark:text-white">{template.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{template.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                        {template.pages.length} page{template.pages.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                        {template.pages.reduce((acc, p) => acc + p.widgets.length, 0)} widgets
                      </span>
                    </div>
                  </div>
                </div>

                {/* Template Preview */}
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <div className="grid grid-cols-2 gap-1 h-20">
                    {template.pages[0]?.widgets.slice(0, 4).map((widget, idx) => (
                      <div
                        key={idx}
                        className={`rounded ${
                          widget.type === 'chart' ? 'bg-blue-200 dark:bg-blue-900' :
                          widget.type === 'kpi' ? 'bg-green-200 dark:bg-green-900' :
                          'bg-orange-200 dark:bg-orange-900'
                        }`}
                      />
                    ))}
                    {template.pages[0]?.widgets.length === 0 && (
                      <div className="col-span-2 flex items-center justify-center text-gray-400 text-xs">
                        Empty page
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedTemplate ? (
              <span>Selected: <strong className="text-sap-dark dark:text-white">{selectedTemplate.name}</strong></span>
            ) : (
              <span>Select a template to preview</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleUseTemplate}
              disabled={!selectedTemplate}
              className={`px-4 py-2 rounded-lg ${
                selectedTemplate
                  ? 'bg-sap-blue text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
