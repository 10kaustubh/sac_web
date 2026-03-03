import React from 'react';
import { 
  TrendingUp, TrendingDown, FileText, Database, PlusCircle, 
  Clock, Star, ArrowRight, BarChart2, PieChart, Table, Layout,
  Zap, Users, Target, Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Story } from '../types';

interface HomePageProps {
  onNavigate: (view: string) => void;
  onOpenStory: (story: Story) => void;
  onCreateStory: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenStory, onCreateStory }) => {
  const { stories, dataModels, filteredData, templates } = useData();

  // Calculate summary stats
  const totalRevenue = filteredData.reduce((sum, row) => sum + row.revenue, 0);
  const totalProfit = filteredData.reduce((sum, row) => sum + row.profit, 0);
  const totalCosts = filteredData.reduce((sum, row) => sum + row.costs, 0);
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;

  const recentStories = stories.slice(0, 3);

  const quickStats = [
    { 
      title: 'Total Revenue', 
      value: `$${(totalRevenue / 1000000).toFixed(2)}M`, 
      change: '+12.5%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    { 
      title: 'Total Profit', 
      value: `$${(totalProfit / 1000000).toFixed(2)}M`, 
      change: '+8.3%', 
      trend: 'up',
      icon: Target,
      color: 'bg-green-500'
    },
    { 
      title: 'Operating Costs', 
      value: `$${(totalCosts / 1000000).toFixed(2)}M`, 
      change: '-3.2%', 
      trend: 'down',
      icon: Activity,
      color: 'bg-orange-500'
    },
    { 
      title: 'Avg Margin', 
      value: `${avgMargin.toFixed(1)}%`, 
      change: '+2.1%', 
      trend: 'up',
      icon: Zap,
      color: 'bg-purple-500'
    },
  ];

  const quickActions = [
    { 
      title: 'Create Story', 
      description: 'Build a new analytical story', 
      icon: PlusCircle, 
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
      action: onCreateStory 
    },
    { 
      title: 'View Models', 
      description: 'Explore your data models', 
      icon: Database, 
      color: 'text-green-500 bg-green-50 dark:bg-green-900/30',
      action: () => onNavigate('models') 
    },
    { 
      title: 'Browse Templates', 
      description: 'Start from a template', 
      icon: Layout, 
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30',
      action: () => onNavigate('templates') 
    },
    { 
      title: 'Analytics', 
      description: 'Smart insights & predictions', 
      icon: BarChart2, 
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/30',
      action: () => onNavigate('analytics') 
    },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sap-dark dark:text-white">Welcome back!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's an overview of your analytics workspace</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-sap-dark dark:text-white">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-sap-dark dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sap-dark dark:text-white">{action.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Stories */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-sap-dark dark:text-white">Recent Stories</h2>
              <button 
                onClick={() => onNavigate('stories')}
                className="text-sap-blue text-sm hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
            
            {recentStories.length > 0 ? (
              <div className="space-y-3">
                {recentStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => onOpenStory(story)}
                    className="flex items-center gap-4 p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 bg-sap-blue/10 rounded-lg flex items-center justify-center">
                      <FileText className="text-sap-blue" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sap-dark dark:text-white truncate">{story.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{story.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {story.updatedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {story.author}
                        </span>
                        <span className="text-sap-blue">{story.pages.length} pages</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText size={48} className="mx-auto mb-3 opacity-30" />
                <p>No stories yet</p>
                <button 
                  onClick={onCreateStory}
                  className="text-sap-blue hover:underline mt-2"
                >
                  Create your first story
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Models & Templates Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Data Models */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-sap-dark dark:text-white">Data Models</h2>
            <button 
              onClick={() => onNavigate('models')}
              className="text-sap-blue text-sm hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {dataModels.slice(0, 4).map((model) => (
              <div 
                key={model.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onNavigate('models')}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  model.type === 'live' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Database size={18} className={model.type === 'live' ? 'text-green-600' : 'text-blue-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sap-dark dark:text-white text-sm truncate">{model.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{model.rowCount.toLocaleString()} rows • {model.type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  model.type === 'live' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {model.source}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-sap-dark dark:text-white">Popular Templates</h2>
            <button 
              onClick={() => onNavigate('templates')}
              className="text-sap-blue text-sm hover:underline flex items-center gap-1"
            >
              Browse all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {templates.slice(0, 4).map((template) => (
              <div 
                key={template.id}
                className="p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onNavigate('templates')}
              >
                <div className="text-3xl mb-2">{template.thumbnail}</div>
                <h3 className="font-medium text-sap-dark dark:text-white text-sm">{template.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 bg-gradient-to-r from-sap-blue to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Analytics Overview</h2>
            <p className="text-blue-100 mt-1">Your workspace at a glance</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{stories.length}</p>
              <p className="text-blue-100 text-sm">Stories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{dataModels.length}</p>
              <p className="text-blue-100 text-sm">Data Models</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{filteredData.length}</p>
              <p className="text-blue-100 text-sm">Data Rows</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{templates.length}</p>
              <p className="text-blue-100 text-sm">Templates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
