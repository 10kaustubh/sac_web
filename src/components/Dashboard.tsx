import React, { useState } from 'react';
import { KPICard } from './KPICard';
import { FilterBar } from './FilterBar';
import { Chart } from './Charts';
import { StoryList } from './StoryList';
import { TemplateSelector } from './TemplateSelector';
import { StoryEditor } from './StoryEditor';
import { useData } from '../context/DataContext';
import { Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    stories, 
    filters, 
    applyFilter, 
    resetFilters,
    activeStory, 
    setActiveStory,
    setActivePageIndex,
    getAggregatedData
  } = useData();
  
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  // If there's an active story, show the editor
  if (activeStory) {
    return <StoryEditor />;
  }

  const handleOpenStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setActiveStory(story);
      setActivePageIndex(0);
    }
  };

  const handleCreateStory = () => {
    setIsTemplateOpen(true);
  };

  // Get chart data
  const revenueByMonth = getAggregatedData('month', 'revenue');
  const revenueByRegion = getAggregatedData('region', 'revenue');
  const revenueByProduct = getAggregatedData('product', 'revenue');

  // Calculate KPIs
  const totalRevenue = revenueByMonth.reduce((sum, item) => sum + item.value, 0);
  const totalProfit = getAggregatedData('month', 'profit').reduce((sum, item) => sum + item.value, 0);
  const totalCosts = getAggregatedData('month', 'costs').reduce((sum, item) => sum + item.value, 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const kpis = [
    { id: '1', title: 'Total Revenue', value: totalRevenue, unit: '$', trend: 'up' as const, change: 12.5 },
    { id: '2', title: 'Total Profit', value: totalProfit, unit: '$', trend: 'up' as const, change: 8.3 },
    { id: '3', title: 'Total Costs', value: totalCosts, unit: '$', trend: 'down' as const, change: -3.2 },
    { id: '4', title: 'Profit Margin', value: profitMargin, unit: '%', trend: 'up' as const, change: 2.1 },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-sap-dark dark:text-white">Stories</h1>
          <p className="text-gray-500 dark:text-gray-400">Create and manage your analytics stories</p>
        </div>
        <button
          onClick={handleCreateStory}
          className="flex items-center gap-2 bg-sap-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Story
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <FilterBar filters={filters} onFilterChange={applyFilter} onResetAll={resetFilters} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(kpi => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart 
          data={revenueByMonth} 
          type="line" 
          title="Revenue Trend by Month" 
        />
        <Chart 
          data={revenueByRegion} 
          type="pie" 
          title="Revenue by Region" 
        />
      </div>

      <div className="mb-6">
        <Chart 
          data={revenueByProduct} 
          type="bar" 
          title="Revenue by Product" 
        />
      </div>

      {/* Story List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-sap-dark dark:text-white">Your Stories</h2>
        </div>
        <StoryList stories={stories} onOpenStory={handleOpenStory} />
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector isOpen={isTemplateOpen} onClose={() => setIsTemplateOpen(false)} />
    </div>
  );
};
