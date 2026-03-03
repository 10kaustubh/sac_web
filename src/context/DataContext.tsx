import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Story, Filter, DataRow, Dimension, Measure, Widget } from '../types';
import { rawData, defaultStories, filters as initialFilters, availableDimensions, availableMeasures } from '../data/mockData';

interface DataContextType {
  data: DataRow[];
  filteredData: DataRow[];
  stories: Story[];
  filters: Filter[];
  dimensions: Dimension[];
  measures: Measure[];
  activeStory: Story | null;
  activePageIndex: number;
  setFilters: (filters: Filter[]) => void;
  applyFilter: (filterId: string, value: string) => void;
  setActiveStory: (story: Story | null) => void;
  setActivePageIndex: (index: number) => void;
  createStory: (title: string, description: string) => void;
  saveStory: (storyId: string) => void;
  addPageToStory: (storyId: string, pageTitle: string) => void;
  addWidgetToPage: (storyId: string, pageId: string, widget: any) => void;
  updateWidget: (storyId: string, pageId: string, widgetId: string, widget: any) => void;
  deleteWidget: (storyId: string, pageId: string, widgetId: string) => void;
  deleteStory: (storyId: string) => void;
  getAggregatedData: (dimension: string, measure: string) => { name: string; value: number }[];
  getMultiMeasureData: (dimension: string, measures: string[]) => any[];
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

  const filteredData = data.filter(row => {
    const yearFilter = filters.find(f => f.label === 'Year');
    const regionFilter = filters.find(f => f.label === 'Region');
    const productFilter = filters.find(f => f.label === 'Product');

    if (yearFilter && yearFilter.selected !== 'All' && row.year !== yearFilter.selected) return false;
    if (regionFilter && regionFilter.selected !== 'All' && row.region !== regionFilter.selected) return false;
    if (productFilter && productFilter.selected !== 'All' && row.product !== productFilter.selected) return false;

    return true;
  });

  const applyFilter = (filterId: string, value: string) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, selected: value } : f
    ));
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
      pages: [
        {
          id: `page-${Date.now()}`,
          title: 'Page 1',
          widgets: []
        }
      ]
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
            widgets: []
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

  const addWidgetToPage = (storyId: string, pageId: string, widget: any) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const updatedStory = {
          ...story,
          isSaved: false,
          pages: story.pages.map(page => {
            if (page.id === pageId) {
              return {
                ...page,
                widgets: [...page.widgets, { ...widget, id: `widget-${Date.now()}` }]
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
                widgets: page.widgets.filter(widget => widget.id !== widgetId)
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
      activeStory,
      activePageIndex,
      setFilters,
      applyFilter,
      setActiveStory,
      setActivePageIndex,
      createStory,
      saveStory,
      addPageToStory,
      addWidgetToPage,
      updateWidget,
      deleteWidget,
      deleteStory,
      getAggregatedData,
      getMultiMeasureData
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
