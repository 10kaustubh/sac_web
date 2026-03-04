import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Story, Filter, Dimension, Measure, Widget, DataModel, SearchResult, StoryTemplate, WidgetFilter, Bookmark, SmartInsight, NLPQuery, Page } from '../types';
import { rawData, defaultStories, filters as initialFilters, availableDimensions, availableMeasures, dataModels, storyTemplates, smartInsights, modelConfigs } from '../data/mockData';

interface DataContextType {
  data: any[];
  filteredData: any[];
  stories: Story[];
  filters: Filter[];
  dimensions: Dimension[];
  measures: Measure[];
  dataModels: DataModel[];
  templates: StoryTemplate[];
  smartInsights: SmartInsight[];
  activeStory: Story | null;
  activePageIndex: number;
  widgetFilters: WidgetFilter[];
  linkedAnalysisEnabled: boolean;
  selectedModel: DataModel | null;
  selectedModelDimensions: Dimension[];
  selectedModelMeasures: Measure[];
  setFilters: (filters: Filter[]) => void;
  applyFilter: (filterId: string, value: string) => void;
  resetFilters: () => void;
  setActiveStory: (story: Story | null) => void;
  setActivePageIndex: (index: number) => void;
  createStory: (title: string, description: string) => void;
  createStoryFromTemplate: (template: StoryTemplate) => void;
  saveStory: (storyId: string, newTitle?: string) => void;
  saveStoryAs: (storyId: string, newTitle: string, newDescription: string) => void;
  addPageToStory: (storyId: string, pageTitle: string) => void;
  addPageWithWidget: (storyId: string, pageTitle: string, widget: Widget) => void;
  deletePageFromStory: (storyId: string, pageId: string) => void;
  addWidgetToPage: (storyId: string, pageId: string, widget: Widget) => void;
  updateWidget: (storyId: string, pageId: string, widgetId: string, widget: Widget) => void;
  duplicateWidget: (storyId: string, pageId: string, widgetId: string) => void;
  copyWidgetToPage: (storyId: string, fromPageId: string, widgetId: string, toPageId: string) => void;
  deleteWidget: (storyId: string, pageId: string, widgetId: string) => void;
  deleteStory: (storyId: string) => void;
  searchAll: (query: string) => SearchResult[];
  applyWidgetFilter: (filter: WidgetFilter) => void;
  clearWidgetFilters: () => void;
  toggleLinkedAnalysis: () => void;
  addBookmark: (storyId: string, name: string) => void;
  applyBookmark: (storyId: string, bookmarkId: string) => void;
  deleteBookmark: (storyId: string, bookmarkId: string) => void;
  processNLPQuery: (query: string) => NLPQuery;
  getAggregatedData: (dimension: string, measure: string) => { name: string; value: number }[];
  getMultiMeasureData: (dimension: string, measures: string[]) => any[];
  getVarianceData: (dimension: string, actualMeasure: string, planMeasure: string) => any[];
  getFilteredDataForWidget: (widgetFilters: WidgetFilter[]) => any[];
  getDrillDownData: (dimension: string, measure: string, parentValue: string) => any[];
  selectModel: (modelId: string) => void;
  getModelDimensions: (modelId: string) => Dimension[];
  getModelMeasures: (modelId: string) => Measure[];
  getModelFilters: (modelId: string) => Filter[];
  getModelData: (modelId: string) => any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'sac_clone_stories';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  
  const [selectedModelId, setSelectedModelId] = useState<string>('model1');
  const [filters, setFilters] = useState<Filter[]>(initialFilters);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [widgetFilters, setWidgetFilters] = useState<WidgetFilter[]>([]);
  const [linkedAnalysisEnabled, setLinkedAnalysisEnabled] = useState(true);

  const currentModelConfig = modelConfigs[selectedModelId] || modelConfigs['model1'];
  const selectedModel = dataModels.find(m => m.id === selectedModelId) || dataModels[0];
  const selectedModelDimensions = currentModelConfig.dimensions;
  const selectedModelMeasures = currentModelConfig.measures;
  const data = currentModelConfig.data;

  useEffect(() => {
    const modelFilters = currentModelConfig.filters.map(f => ({ ...f, selected: 'All' }));
    setFilters(modelFilters);
    setWidgetFilters([]);
  }, [selectedModelId]);

  useEffect(() => {
    const savedStories = stories.filter(s => s.isSaved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStories));
  }, [stories]);

  const filteredData = data.filter((row: any) => {
    // Apply global filters
    for (const filter of filters) {
      if (filter.selected !== 'All') {
        const field = filter.label.toLowerCase().replace(/\s+/g, '');
        const matchingField = Object.keys(row).find(
          key => key.toLowerCase() === field || 
                 key.toLowerCase() === filter.label.toLowerCase() ||
                 key.toLowerCase().includes(filter.label.toLowerCase().split(' ')[0].toLowerCase())
        );
        if (matchingField && String(row[matchingField]) !== filter.selected) {
          return false;
        }
      }
    }

    // Apply widget filters only if linked analysis is enabled
    if (linkedAnalysisEnabled) {
      for (const wf of widgetFilters) {
        const rowValue = row[wf.field];
        if (wf.selectedValues.length > 0 && !wf.selectedValues.includes(String(rowValue))) {
          return false;
        }
      }
    }

    return true;
  });

  const applyFilter = (filterId: string, value: string) => {
    setFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, selected: value } : f
    ));
  };

  const resetFilters = () => {
    setFilters(prev => prev.map(f => ({ ...f, selected: 'All' })));
    setWidgetFilters([]);
  };

  const applyWidgetFilter = (filter: WidgetFilter) => {
    if (!linkedAnalysisEnabled) return;
    
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

  const toggleLinkedAnalysis = () => {
    setLinkedAnalysisEnabled(prev => !prev);
    if (linkedAnalysisEnabled) {
      clearWidgetFilters();
    }
  };

  const selectModel = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  const getModelDimensions = (modelId: string): Dimension[] => {
    return modelConfigs[modelId]?.dimensions || availableDimensions;
  };

  const getModelMeasures = (modelId: string): Measure[] => {
    return modelConfigs[modelId]?.measures || availableMeasures;
  };

  const getModelFilters = (modelId: string): Filter[] => {
    return modelConfigs[modelId]?.filters || initialFilters;
  };

  const getModelData = (modelId: string): any[] => {
    return modelConfigs[modelId]?.data || rawData;
  };

  const getFilteredDataForWidget = (wFilters: WidgetFilter[]) => {
    return filteredData.filter((row: any) => {
      for (const wf of wFilters) {
        const rowValue = row[wf.field];
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
      isFavorite: false,
      tags: [],
      version: 1,
      bookmarks: [],
      pages: [
        {
          id: `page-${Date.now()}`,
          title: 'Page 1',
          widgets: [],
          layout: [],
          linkedAnalysis: true
        }
      ]
    };
    setStories([newStory, ...stories]);
    setActiveStory(newStory);
    setActivePageIndex(0);
  };

  const createStoryFromTemplate = (template: StoryTemplate) => {
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

    const newStory: Story = {
      id: `story-${Date.now()}`,
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
    
    setStories([newStory, ...stories]);
    setActiveStory(newStory);
    setActivePageIndex(0);
  };

  const saveStory = (storyId: string, newTitle?: string) => {
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        const savedStory = {
          ...story,
          title: newTitle || story.title,
          isSaved: true,
          updatedAt: new Date().toISOString()
        };
        return savedStory;
      }
      return story;
    });
    setStories(updatedStories);
    
    // Also update activeStory
    if (activeStory && activeStory.id === storyId) {
      setActiveStory({
        ...activeStory,
        title: newTitle || activeStory.title,
        isSaved: true,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const saveStoryAs = (storyId: string, newTitle: string, newDescription: string) => {
    const originalStory = stories.find(s => s.id === storyId) || activeStory;
    if (!originalStory) return;

    const newStory: Story = {
      ...originalStory,
      id: `story-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isSaved: true,
      version: 1
    };

    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    setActiveStory(newStory);
  };

  const addBookmark = (storyId: string, name: string) => {
    const bookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      name,
      filters: [...filters],
      widgetFilters: [...widgetFilters],
      pageIndex: activePageIndex,
      createdAt: new Date().toISOString()
    };

    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        return {
          ...story,
          isSaved: false,
          bookmarks: [...(story.bookmarks || []), bookmark]
        };
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const applyBookmark = (storyId: string, bookmarkId: string) => {
    const story = activeStory?.id === storyId ? activeStory : stories.find(s => s.id === storyId);
    const bookmark = story?.bookmarks?.find(b => b.id === bookmarkId);
    
    if (bookmark) {
      setFilters(bookmark.filters);
      setWidgetFilters(bookmark.widgetFilters);
      setActivePageIndex(bookmark.pageIndex);
    }
  };

  const deleteBookmark = (storyId: string, bookmarkId: string) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        return {
          ...story,
          isSaved: false,
          bookmarks: (story.bookmarks || []).filter(b => b.id !== bookmarkId)
        };
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const processNLPQuery = (query: string): NLPQuery => {
    const lowerQuery = query.toLowerCase();
    let suggestedChart: any = 'column';
    let suggestedDimensions: string[] = [];
    let suggestedMeasures: string[] = [];
    let confidence = 0.7;

    if (lowerQuery.includes('trend') || lowerQuery.includes('over time')) {
      suggestedChart = 'line';
      confidence = 0.85;
    } else if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
      suggestedChart = 'column';
      confidence = 0.82;
    } else if (lowerQuery.includes('distribution') || lowerQuery.includes('breakdown') || lowerQuery.includes('mix')) {
      suggestedChart = 'pie';
      confidence = 0.8;
    } else if (lowerQuery.includes('variance') || lowerQuery.includes('waterfall')) {
      suggestedChart = 'waterfall';
      confidence = 0.88;
    }

    for (const dim of selectedModelDimensions) {
      if (lowerQuery.includes(dim.name.toLowerCase()) || lowerQuery.includes(dim.field.toLowerCase())) {
        suggestedDimensions.push(dim.field);
      }
    }

    for (const meas of selectedModelMeasures) {
      if (lowerQuery.includes(meas.name.toLowerCase()) || lowerQuery.includes(meas.field.toLowerCase())) {
        suggestedMeasures.push(meas.field);
      }
    }

    if (suggestedDimensions.length === 0 && selectedModelDimensions.length > 0) {
      suggestedDimensions.push(selectedModelDimensions[0].field);
    }

    if (suggestedMeasures.length === 0 && selectedModelMeasures.length > 0) {
      suggestedMeasures.push(selectedModelMeasures[0].field);
    }

    return {
      query,
      suggestedChart,
      suggestedDimensions,
      suggestedMeasures,
      confidence
    };
  };

  const addPageToStory = (storyId: string, pageTitle: string) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        const newPage: Page = {
          id: `page-${Date.now()}`,
          title: pageTitle,
          widgets: [],
          layout: [],
          linkedAnalysis: true
        };
        return {
          ...story,
          isSaved: false,
          pages: [...story.pages, newPage]
        };
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      const updatedStory = updateStory(activeStory);
      setActiveStory(updatedStory);
      setActivePageIndex(updatedStory.pages.length - 1);
    }
  };

  const addPageWithWidget = (storyId: string, pageTitle: string, widget: Widget) => {
    const newPageId = `page-${Date.now()}`;
    const newWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
      dimensions: widget.dimensions.map(d => ({ ...d })),
      measures: widget.measures.map(m => ({ ...m })),
      filters: widget.filters ? widget.filters.map(f => ({ ...f })) : [],
    };
    
    const newPage: Page = {
      id: newPageId,
      title: pageTitle,
      widgets: [newWidget],
      layout: [],
      linkedAnalysis: true
    };

    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        return {
          ...story,
          isSaved: false,
          pages: [...story.pages, newPage]
        };
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      const updatedStory = updateStory(activeStory);
      setActiveStory(updatedStory);
      setActivePageIndex(updatedStory.pages.length - 1);
    }
  };

  const deletePageFromStory = (storyId: string, pageId: string) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId && story.pages.length > 1) {
        const pageIndex = story.pages.findIndex(p => p.id === pageId);
        const newPages = story.pages.filter(p => p.id !== pageId);
        
        if (activeStory?.id === storyId) {
          if (activePageIndex >= pageIndex && activePageIndex > 0) {
            setActivePageIndex(activePageIndex - 1);
          }
        }
        
        return {
          ...story,
          isSaved: false,
          pages: newPages
        };
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const addWidgetToPage = (storyId: string, pageId: string, widget: Widget) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        return {
          ...story,
          isSaved: false,
          pages: story.pages.map(page => {
            if (page.id === pageId) {
              const newWidget = { ...widget, id: widget.id || `widget-${Date.now()}`, linkedAnalysis: true };
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
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const updateWidget = (storyId: string, pageId: string, widgetId: string, updatedWidget: Widget) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        return {
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
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const duplicateWidget = (storyId: string, pageId: string, widgetId: string) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        return {
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
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const copyWidgetToPage = (storyId: string, fromPageId: string, widgetId: string, toPageId: string) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        const fromPage = story.pages.find(p => p.id === fromPageId);
        const originalWidget = fromPage?.widgets.find(w => w.id === widgetId);
        
        if (originalWidget) {
          return {
            ...story,
            isSaved: false,
            pages: story.pages.map(page => {
              if (page.id === toPageId) {
                const newWidget = {
                  ...originalWidget,
                  id: `widget-${Date.now()}`,
                  title: `${originalWidget.title}`
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
              return page;
            })
          };
        }
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const deleteWidget = (storyId: string, pageId: string, widgetId: string) => {
    const updateStory = (story: Story) => {
      if (story.id === storyId) {
        return {
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
      }
      return story;
    };

    setStories(stories.map(updateStory));
    if (activeStory?.id === storyId) {
      setActiveStory(updateStory(activeStory));
    }
  };

  const deleteStory = (storyId: string) => {
    const updatedStories = stories.filter(s => s.id !== storyId);
    setStories(updatedStories);
    if (activeStory?.id === storyId) {
      setActiveStory(null);
    }
  };

  const searchAll = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

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

        page.widgets.forEach(widget => {
          if (widget.title.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: 'widget',
              id: widget.id,
              title: widget.title,
              description: `Widget in ${story.title} > ${page.title}`,
              storyId: story.id
            });
          }
        });
      });
    });

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
    
    filteredData.forEach((row: any) => {
      const dimValue = row[dimension] as string;
      const measValue = Number(row[measure]) || 0;
      
      if (dimValue) {
        if (aggregated[dimValue]) {
          aggregated[dimValue] += measValue;
        } else {
          aggregated[dimValue] = measValue;
        }
      }
    });

    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  };

  const getMultiMeasureData = (dimension: string, measures: string[]) => {
    const aggregated: { [key: string]: any } = {};
    
    filteredData.forEach((row: any) => {
      const dimValue = row[dimension] as string;
      
      if (dimValue) {
        if (!aggregated[dimValue]) {
          aggregated[dimValue] = { name: dimValue };
          measures.forEach(m => {
            aggregated[dimValue][m] = 0;
          });
        }
        
        measures.forEach(m => {
          aggregated[dimValue][m] += Number(row[m]) || 0;
        });
      }
    });

    return Object.values(aggregated);
  };

  const getVarianceData = (dimension: string, actualMeasure: string, planMeasure: string) => {
    const aggregated: { [key: string]: any } = {};
    
    filteredData.forEach((row: any) => {
      const dimValue = row[dimension] as string;
      
      if (dimValue) {
        if (!aggregated[dimValue]) {
          aggregated[dimValue] = { 
            name: dimValue, 
            actual: 0, 
            plan: 0, 
            variance: 0, 
            variancePercent: 0 
          };
        }
        
        aggregated[dimValue].actual += Number(row[actualMeasure]) || 0;
        aggregated[dimValue].plan += Number(row[planMeasure]) || 0;
      }
    });

    return Object.values(aggregated).map((item: any) => ({
      ...item,
      variance: item.actual - item.plan,
      variancePercent: item.plan > 0 ? ((item.actual - item.plan) / item.plan) * 100 : 0
    }));
  };

  const getDrillDownData = (dimension: string, measure: string, parentValue: string) => {
    const dimIndex = selectedModelDimensions.findIndex(d => d.field === dimension);
    const nextDim = selectedModelDimensions[dimIndex + 1];
    const childDimension = nextDim?.field || dimension;
    
    const filtered = filteredData.filter((row: any) => 
      row[dimension] === parentValue
    );

    const aggregated: { [key: string]: number } = {};
    
    filtered.forEach((row: any) => {
      const dimValue = row[childDimension] as string;
      const measValue = Number(row[measure]) || 0;
      
      if (dimValue) {
        if (aggregated[dimValue]) {
          aggregated[dimValue] += measValue;
        } else {
          aggregated[dimValue] = measValue;
        }
      }
    });

    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  };

  return (
    <DataContext.Provider value={{
      data,
      filteredData,
      stories,
      filters,
      dimensions: selectedModelDimensions,
      measures: selectedModelMeasures,
      dataModels,
      templates: storyTemplates,
      smartInsights,
      activeStory,
      activePageIndex,
      widgetFilters,
      linkedAnalysisEnabled,
      selectedModel,
      selectedModelDimensions,
      selectedModelMeasures,
      setFilters,
      applyFilter,
      resetFilters,
      setActiveStory,
      setActivePageIndex,
      createStory,
      createStoryFromTemplate,
      saveStory,
      saveStoryAs,
      addPageToStory,
      addPageWithWidget,
      deletePageFromStory,
      addWidgetToPage,
      updateWidget,
      duplicateWidget,
      copyWidgetToPage,
      deleteWidget,
      deleteStory,
      searchAll,
      applyWidgetFilter,
      clearWidgetFilters,
      toggleLinkedAnalysis,
      addBookmark,
      applyBookmark,
      deleteBookmark,
      processNLPQuery,
      getAggregatedData,
      getMultiMeasureData,
      getVarianceData,
      getFilteredDataForWidget,
      getDrillDownData,
      selectModel,
      getModelDimensions,
      getModelMeasures,
      getModelFilters,
      getModelData
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
