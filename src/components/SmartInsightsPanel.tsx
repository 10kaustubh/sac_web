import React, { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, BarChart2, X, ChevronRight, Lightbulb, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SmartInsight } from '../types';

interface SmartInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyInsight?: (insight: SmartInsight) => void;
}

export const SmartInsightsPanel: React.FC<SmartInsightsPanelProps> = ({ isOpen, onClose, onApplyInsight }) => {
  const { smartInsights, filteredData, applyFilter } = useData();
  const [selectedInsight, setSelectedInsight] = useState<SmartInsight | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp size={18} className="text-blue-500" />;
      case 'anomaly': return <AlertTriangle size={18} className="text-orange-500" />;
      case 'correlation': return <BarChart2 size={18} className="text-purple-500" />;
      case 'forecast': return <Lightbulb size={18} className="text-green-500" />;
      default: return <Sparkles size={18} className="text-sap-blue" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'anomaly': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'correlation': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'forecast': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleApplyInsight = (insight: SmartInsight) => {
    if (insight.relatedDimension) {
      // Apply filter based on insight
      const filterId = insight.relatedDimension === 'region' ? '2' : 
                       insight.relatedDimension === 'product' ? '3' : '1';
      
      if (insight.title.includes('North America')) {
        applyFilter(filterId, 'North America');
      } else if (insight.title.includes('Asia Pacific')) {
        applyFilter(filterId, 'Asia Pacific');
      } else if (insight.title.includes('Product A')) {
        applyFilter('3', 'Product A');
      }
    }
    
    if (onApplyInsight) {
      onApplyInsight(insight);
    }
    setSelectedInsight(insight);
  };

  // Generate dynamic insights based on data
  const generateDynamicInsights = (): SmartInsight[] => {
    const totalRevenue = filteredData.reduce((sum, row) => sum + row.revenue, 0);
    const totalProfit = filteredData.reduce((sum, row) => sum + row.profit, 0);
    const totalPlanRevenue = filteredData.reduce((sum, row) => sum + (row.plan_revenue || 0), 0);
    
    const marginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const variancePercent = totalPlanRevenue > 0 ? ((totalRevenue - totalPlanRevenue) / totalPlanRevenue) * 100 : 0;

    const dynamicInsights: SmartInsight[] = [
      {
        id: 'dynamic1',
        type: variancePercent >= 0 ? 'trend' : 'anomaly',
        title: variancePercent >= 0 ? 'Revenue Above Plan' : 'Revenue Below Plan',
        description: `Current revenue is ${Math.abs(variancePercent).toFixed(1)}% ${variancePercent >= 0 ? 'above' : 'below'} plan. Total: $${(totalRevenue / 1000000).toFixed(2)}M vs Plan: $${(totalPlanRevenue / 1000000).toFixed(2)}M`,
        confidence: 0.95,
        relatedMeasure: 'revenue',
        timestamp: new Date().toISOString()
      },
      {
        id: 'dynamic2',
        type: 'correlation',
        title: 'Profit Margin Analysis',
        description: `Current profit margin is ${marginPercent.toFixed(1)}%. ${marginPercent > 30 ? 'This is healthy for the business.' : 'Consider cost optimization strategies.'}`,
        confidence: 0.88,
        relatedMeasure: 'profit',
        timestamp: new Date().toISOString()
      }
    ];

    return [...dynamicInsights, ...smartInsights];
  };

  const allInsights = generateDynamicInsights();

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={24} />
            <div>
              <h2 className="font-semibold">Smart Insights</h2>
              <p className="text-xs text-purple-100">AI-powered analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 hover:bg-white/20 rounded ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh insights"
            >
              <RefreshCw size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-sap-blue">{allInsights.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Insights</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">
              {allInsights.filter(i => i.type === 'anomaly').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Anomalies</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {allInsights.filter(i => i.type === 'trend').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Trends</p>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isRefreshing ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 border-4 border-sap-blue border-t-transparent rounded-full animate-spin mb-4" />
            <p>Analyzing data...</p>
          </div>
        ) : (
          allInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getInsightColor(insight.type)} ${
                selectedInsight?.id === insight.id ? 'ring-2 ring-sap-blue' : ''
              }`}
              onClick={() => handleApplyInsight(insight)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{insight.title}</h4>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 capitalize">
                      {insight.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Insight Details */}
      {selectedInsight && (
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">Selected Insight</h4>
            <button
              onClick={() => setSelectedInsight(null)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{selectedInsight.description}</p>
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-sap-blue text-white text-xs rounded-lg hover:bg-blue-700">
              Create Widget
            </button>
            <button className="flex-1 px-3 py-2 border dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              Explore Data
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Insights auto-refresh every 5 minutes
        </p>
      </div>
    </div>
  );
};
