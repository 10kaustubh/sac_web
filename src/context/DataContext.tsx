import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Story, Filter, DataRow, Dimension, Measure, Widget, DataModel, SearchResult, StoryTemplate, WidgetFilter } from '../types';
import { rawData, defaultStories, filters as initialFilters, availableDimensions, availableMeasures, dataModels, storyTemplates } from '../data/mockData';

interface DataContextType {
  data: DataRow[];
  filteredData: DataRow[];
  stories: Story[];
  filters: Filter[];
  dimensions: Dimension[];
  measures: Measure[];
  dataModels: DataModel[];
  templates: StoryTemplate[];
  activeStory: Story | null;
  activePageIndex: number;
  widgetFilters: WidgetFilter[];
  setFilters: (filters: Filter[]) => void;
  applyFilter: (filterId: string, value: string) => void;
  setActiveStory: (story: Story | null) => void;
  setActivePageIndex: (index: number) => void;
  createStory: (title: string, description: string) => void;
  createStoryFromTemplate: (template: StoryTemplate) => void;
  saveStory: (storyId: string) => void;
  addPageToStory: (storyId: string, pageTitle: string) => void;
  deletePageFromStory: (storyId: string, pageId: string) => void;
  addWidgetToPage: (storyId: string, pageId: string, widget: any) => void;
  updateWidget: (storyId: string, pageId: string, widgetId: string, widget: any) => void;
  duplicateWidget: (storyId: string, pageId: string, widgetId: string) => void;
  deleteWidget: (storyId: string, pageId: string, widgetId: string) => void;
  deleteStory: (storyId: string) => void;
  searchAll: (query: string) => SearchResult[];
  applyWidgetFilter: (filter: WidgetFilter) => void;
  clearWidgetFilters: () => void;
  getAggregatedData: (dimension: string, measure: string) => { name: string; value: number }[];
  getMultiMeasureData: (dimension: string, measures: string[]) => any[];
  getFilteredDataForWidget: (widgetFilters: WidgetFilter[]) => DataRow[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'sac_clone_stories';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data] = useState<DataRow[]>(rawData);
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultStories;
      }
    }
    return defaultStories;
  });
  const [filters, setFilters] = useState<Filter[]>(initialFilters);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [widgetFilters, setWidgetFilters] = useState<WidgetFilter[]>([]);

  const filteredData = data.filter(row => {
    const yearFilter = filters.find(f => f.label === 'Year');
    const regionFilter = filters.find(f => f.label === 'Region');
    const productFilter = filters.find(f => f.label === 'Product');

    if (yearFilter && yearFilter.selected !== 'All' && row.year !== yearFilter.selected) return false;
    if (regionFilter && regionFilter.selected !== 'All' && row.region !== regionFilter.selected) return false;
    if (productFilter && productFilter.selected !== 'All' && row.product !== productFilter.selected) return false;

    // Apply widget drill-down filters
    for (const wf of widgetFilters) {
      const rowValue = row[wf.field as keyof DataRow];
      if (wf.selectedValues.length > 0 && !wf.selectedValues.includes(String(rowValue))) {
        return false;
      }
    }

    return true;
  });

  const applyFilter = (filterId: string, value: string) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, selected: value } : f
    ));
  };

  const applyWidgetFilter = (filter: WidgetFilter) => {
    setWidgetFilters(prev => {
      const existing = prev.findIndex(f => f.field === filter.field);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = filter;
        return updated;
      }
      return [...prev, filter];
    });
  };

  const clearWidgetFilters = () => {
    setWidgetFilters([]);
  };

  const getFilteredDataForWidget = (wFilters: WidgetFilter[]) => {
    return filteredData.filter(row => {
      for (const wf of wFilters) {
        const rowValue = row[wf.field as keyof DataRow];
        if (wf.selectedValues.length > 0 && !wf.selectedValues.includes(String(rowValue))) {
          return false;
        }
      }
      return true;
    });
  };

  const createStory = (title: string, description: string) => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      title,
      description,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      author: 'Current User',
      isSaved: false,
      tags: [],
      pages: [
        {
          id: `page-${Date.now()}`,
          title: 'Page 1',
          widgets: [],
          layout: []
        }
      ]
    };
    setStories([newStory, ...stories]);
    setActiveStory(newStory);
    setActivePageIndex(0);
  };

  const createStoryFromTemplate = (template: StoryTemplate) => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: `${template.name} - Copy`,
      description: template.description,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      author: 'Current User',
      isSaved: false,
      template: template.id,
      tags: [],
      pages: template.pages.map((page, idx) => ({
        ...page,
        id: `page-${Date.now()}-${idx}`,
        widgets: page.widgets.map((widget, widx) => ({
          ...widget,
          id: `widget-${Date.now()}-${widx}`
        }))
      }))
    };
    setStories([newStory, ...stories]);
    setActiveStory(newStory);
    setActivePageIndex(0);
  };

  const saveStory = (storyId: string) => {
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        const savedStory = {
          ...story,
          isSaved: true,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        if (activeStory?.id === storyId) {
          setActiveStory(savedStory);
        }
        return savedStory;
      }
      return story;
    });
    setStories(updatedStories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
  };

  const addPageToStory = (storyId: string, pageTitle: string) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const updatedStory = {
          ...story,
          isSaved: false,
          pages: [...story.pages, {
            id: `page-${Date.now()}`,
            title: pageTitle,
            widgets: [],
            layout: []
          }]
        };
        if (activeStory?.id === storyId) {
          setActiveStory(updatedStory);
          setActivePageIndex(updatedStory.pages.length - 1);
        }
        return updatedStory;
      }
      return story;
    }));
  };

  const deletePageFromStory = (storyId: string, pageId: string) => {
    setStories(stories.map(story => {
      if (story.id === storyId && story.pages.length > 1) {
        const pageIndex = story.pages.findIndex(p => p.id === pageId);
        const updatedStory = {
          ...story,
          isSaved: false,
          pages: story.pages.filter(p => p.id !== pageId)
        };
        if (activeStory?.id === storyId) {
          setActiveStory(updatedStory);
          if (activePageIndex >= pageIndex && activePageIndex > 0) {
            setActivePageIndex(activePageIndex - 1);
          }
        }
        return updatedStory;
      }
      return story;
    }));
  };

  const addWidgetToPage = (storyId: string, pageId: string, widget: any) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const updatedStory = {
          ...story,
          isSaved: false,
          pages: story.pages.map(page => {
            if (page.id === pageId) {
              const newWidget = { ...widget, id: `widget-${Date.now()}` };
              const newLayout = {
                i: newWidget.id,
                x: (page.widgets.length * 6) % 12,
                y: Math.floor(page.widgets.length / 2) * 4,
                w: 6,
                h: 4,
                minW: 3,
                minH: 2
              };
              return {
                ...page,
                widgets: [...page.widgets, newWidget],
                layout: [...(page.layout || []), newLayout]
              };
            }
            return page;
          })
        };
        if (activeStory?.id === storyId) {
          setActiveStory(updatedStory);
        }
        return updatedStory;
      }
      return story;
    }));
  };

  const updateWidget = (storyId: string, pageId: string, widgetId: string, updatedWidget: any) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const updatedStory = {
          ...story,
          isSaved: false,
          pages: story.pages.map(page => {
            if (page.id === pageId) {
              return {
                ...page,
                widgets: page.widgets.map(widget => 
                  widget.id === widgetId ? { ...widget, ...updatedWidget } : widget
                )
              };
            }
            return page;
          })
        };
        if (activeStory?.id === storyId) {
          setActiveStory(updatedStory);
        }
        return updatedStory;
      }
      return story;
    }));
  };

  const duplicateWidget = (storyId: string, pageId: string, widgetId: string) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const updatedStory = {
          ...story,
          isSaved: false,
          pages: story.pages.map(page => {
            if (page.id === pageId) {
              const originalWidget = page.widgets.find(w => w.id === widgetId);
              if (originalWidget) {
                const newWidget = {
                  ...originalWidget,
                  id: `widget-${Date.now()}`,
                  title: `${originalWidget.title} (Copy)`
                };
                const newLayout = {
                  i: newWidget.id,
                  x: (page.widgets.length * 6) % 12,
                  y: Math.floor(page.widgets.length / 2) * 4,
                  w: 6,
                  h: 4,
                  minW: 3,
                  minH: 2
                };
                return {
                  ...page,
                  widgets: [...page.widgets, newWidget],
                  layout: [...(page.layout || []), newLayout]
                };
              }
            }
            return page;
          })
        };
        if (activeStory?.id === storyId) {
          setActiveStory(updatedStory);
        }
        return updatedStory;
      }
      return story;
    }));
  };

  const deleteWidget = (storyId: string, pageId: string, widgetId: string) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const updatedStory = {
          ...story,
          isSaved: false,
          pages: story.pages.map(page => {
            if (page.id === pageId) {
              return {
                ...page,
                widgets: page.widgets.filter(widget => widget.id !== widgetId),
                layout: (page.layout || []).filter(l => l.i !== widgetId)
              };
            }
            return page;
          })
        };
        if (activeStory?.id === storyId) {
          setActiveStory(updatedStory);
        }
        return updatedStory;
      }
      return story;
    }));
  };

  const deleteStory = (storyId: string) => {
    const updatedStories = stories.filter(s => s.id !== storyId);
    setStories(updatedStories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
    if (activeStory?.id === storyId) {
      setActiveStory(null);
    }
  };

  const searchAll = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search stories
    stories.forEach(story => {
      if (story.title.toLowerCase().includes(lowerQuery) || 
          story.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'story',
          id: story.id,
          title: story.title,
          description: story.description
        });
      }

      // Search pages within stories
      story.pages.forEach(page => {
        if (page.title.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'page',
            id: page.id,
            title: page.title,
            description: `Page in ${story.title}`,
            storyId: story.id
          });
        }
      });
    });

    // Search data models
    dataModels.forEach(model => {
      if (model.name.toLowerCase().includes(lowerQuery) ||
          model.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'model',
          id: model.id,
          title: model.name,
          description: model.description
        });
      }
    });

    return results;
  };

  const getAggregatedData = (dimension: string, measure: string) => {
    const aggregated: { [key: string]: number } = {};
    
    filteredData.forEach(row => {
      const dimValue = row[dimension as keyof DataRow] as string;
      const measValue = row[measure as keyof DataRow] as number;
      
      if (aggregated[dimValue]) {
        aggregated[dimValue] += measValue;
      } else {
        aggregated[dimValue] = measValue;
      }
    });

    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  };

  const getMultiMeasureData = (dimension: string, measures: string[]) => {
    const aggregated: { [key: string]: any } = {};
    
    filteredData.forEach(row => {
      const dimValue = row[dimension as keyof DataRow] as string;
      
      if (!aggregated[dimValue]) {
        aggregated[dimValue] = { name: dimValue };
        measures.forEach(m => {
          aggregated[dimValue][m] = 0;
        });
      }
      
      measures.forEach(m => {
        aggregated[dimValue][m] += row[m as keyof DataRow] as number;
      });
    });

    return Object.values(aggregated);
  };

  return (
    <DataContext.Provider value={{
      data,
      filteredData,
      stories,
      filters,
      dimensions: availableDimensions,
      measures: availableMeasures,
      dataModels,
      templates: storyTemplates,
      activeStory,
      activePageIndex,
      widgetFilters,
      setFilters,
      applyFilter,
      setActiveStory,
      setActivePageIndex,
      createStory,
      createStoryFromTemplate,
      saveStory,
      addPageToStory,
      deletePageFromStory,
      addWidgetToPage,
      updateWidget,
      duplicateWidget,
      deleteWidget,
      deleteStory,
      searchAll,
      applyWidgetFilter,
      clearWidgetFilters,
      getAggregatedData,
      getMultiMeasureData,
      getFilteredDataForWidget
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
