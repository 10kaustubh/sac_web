import React, { useState } from 'react';
import { KPICard } from './KPICard';
import { FilterBar } from './FilterBar';
import { RevenueChart, RegionPieChart, ProductBarChart } from './Charts';
import { StoryList } from './StoryList';
import { CreateStoryModal } from './CreateStoryModal';
import { StoryEditor } from './StoryEditor';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { 
    filters, 
    applyFilter, 
    activeStory, 
    setActiveStory,
    stories,
    createStory,
    deleteStory,
    getMultiMeasureData,
    filteredData
  } = useData();

  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);

  if (activeStory) {
    return <StoryEditor />;
  }

  const totalRevenue = filteredData.reduce((sum, row) => sum + row.revenue, 0);
  const totalCosts = filteredData.reduce((sum, row) => sum + row.costs, 0);
  const totalProfit = filteredData.reduce((sum, row) => sum + row.profit, 0);
  const totalQuantity = filteredData.reduce((sum, row) => sum + row.quantity, 0);

  const kpis = [
    { id: '1', title: 'Total Revenue', value: totalRevenue, unit: '$', trend: 'up' as const, change: 12.5 },
    { id: '2', title: 'Gross Margin', value: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0, unit: '%', trend: 'up' as const, change: 2.1 },
    { id: '3', title: 'Operating Costs', value: totalCosts, unit: '$', trend: 'down' as const, change: -5.3 },
    { id: '4', title: 'Total Quantity', value: totalQuantity, unit: '', trend: 'up' as const, change: 8.7 },
  ];

  const monthlyData = getMultiMeasureData('month', ['revenue', 'costs', 'profit']).map(item => ({
    name: item.name,
    revenue: item.revenue,
    costs: item.costs,
    profit: item.profit,
    value: item.revenue
  }));

  const regionData = getMultiMeasureData('region', ['revenue']).map(item => {
    const total = filteredData.reduce((sum, r) => sum + r.revenue, 0);
    return {
      name: item.name,
      value: total > 0 ? Math.round((item.revenue / total) * 100) : 0
    };
  });

  const productData = getMultiMeasureData('product', ['revenue']).map(item => ({
    name: item.name,
    sales: item.revenue,
    target: item.revenue * 1.1,
    value: item.revenue
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sap-dark">Dashboard Overview</h2>
        <button 
          onClick={() => setIsCreateStoryOpen(true)}
          className="bg-sap-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Story
        </button>
      </div>

      <FilterBar filters={filters} onFilterChange={applyFilter} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={monthlyData} title="Revenue Trend" />
        <RegionPieChart data={regionData} title="Revenue by Region" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductBarChart data={productData} title="Product Performance" />
        <StoryList 
          stories={stories} 
          onStoryClick={setActiveStory}
          onDelete={deleteStory}
        />
      </div>

      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onCreate={createStory}
      />
    </div>
  );
};
