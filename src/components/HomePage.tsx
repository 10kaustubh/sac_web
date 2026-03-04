import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  FileText, 
  Database, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart2, 
  Users, 
  Package, 
  Briefcase,
  Clock,
  ArrowRight,
  Layers,
  Layout,
  LineChart,
  Target,
  Wallet,
  UserCheck,
  Truck,
  FileSpreadsheet,
  Presentation,
  Calculator,
  ClipboardList
} from 'lucide-react';
import { Story, DataModel, StoryTemplate } from '../types';

interface HomePageProps {
  onNavigate: (view: string) => void;
  onOpenStory: (story: Story) => void;
  onCreateStory: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenStory, onCreateStory }) => {
  const { stories, dataModels, templates } = useData();

  const quickStats = [
    { label: 'Total Revenue', value: '$4.2M', change: '+12.5%', positive: true, icon: DollarSign, color: 'blue' },
    { label: 'Gross Profit', value: '$1.4M', change: '+8.3%', positive: true, icon: TrendingUp, color: 'green' },
    { label: 'Operating Costs', value: '$2.8M', change: '-3.2%', positive: true, icon: Wallet, color: 'orange' },
    { label: 'Profit Margin', value: '33.4%', change: '+2.1%', positive: true, icon: PieChart, color: 'purple' },
  ];

  const getModelIcon = (modelName: string) => {
    if (modelName.includes('Sales')) return BarChart2;
    if (modelName.includes('Customer')) return Users;
    if (modelName.includes('Inventory')) return Package;
    if (modelName.includes('Financial')) return Briefcase;
    if (modelName.includes('HR')) return UserCheck;
    if (modelName.includes('Supply')) return Truck;
    return Database;
  };

  const getTemplateIcon = (templateName: string) => {
    if (templateName.includes('Executive')) return Presentation;
    if (templateName.includes('Sales')) return LineChart;
    if (templateName.includes('Variance')) return Calculator;
    if (templateName.includes('Blank')) return FileSpreadsheet;
    return ClipboardList;
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sap-dark dark:text-white mb-2">Welcome to SAC Clone</h1>
        <p className="text-gray-600 dark:text-gray-400">Your analytics and planning platform</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                  stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  <IconComponent size={20} className={`${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-sap-dark dark:text-white">{stat.value}</p>
              <p className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} vs last period
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={onCreateStory}
          className="flex items-center gap-3 p-4 bg-sap-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={24} />
          <div className="text-left">
            <p className="font-semibold">Create Story</p>
            <p className="text-sm text-blue-100">Start from scratch or template</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('models')}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Database size={20} className="text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sap-dark dark:text-white">Data Models</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('analytics')}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sap-dark dark:text-white">Analytics</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Smart insights</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('planning')}
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Target size={20} className="text-orange-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sap-dark dark:text-white">Planning</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Budget & forecast</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stories */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sap-dark dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-gray-400" />
              Recent Stories
            </h2>
            <button 
              onClick={() => onNavigate('stories')}
              className="text-sm text-sap-blue hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {stories.slice(0, 5).map((story) => (
              <div
                key={story.id}
                onClick={() => onOpenStory(story)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-sap-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sap-dark dark:text-white truncate">{story.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{story.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{story.updatedAt}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{story.pages?.length || 1} pages</p>
                </div>
              </div>
            ))}
            {stories.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <FileText size={32} className="mx-auto mb-2 opacity-50" />
                <p>No stories yet. Create your first story!</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Models */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sap-dark dark:text-white flex items-center gap-2">
              <Database size={20} className="text-gray-400" />
              Data Models
            </h2>
            <button 
              onClick={() => onNavigate('models')}
              className="text-sm text-sap-blue hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {dataModels.slice(0, 4).map((model) => {
              const IconComponent = getModelIcon(model.name);
              return (
                <div
                  key={model.id}
                  onClick={() => onNavigate('models')}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <IconComponent size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sap-dark dark:text-white text-sm truncate">{model.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{model.rowCount?.toLocaleString()} rows</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-sap-dark dark:text-white flex items-center gap-2">
            <Layers size={20} className="text-gray-400" />
            Popular Templates
          </h2>
          <button 
            onClick={() => onNavigate('templates')}
            className="text-sm text-sap-blue hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.slice(0, 4).map((template) => {
            const IconComponent = getTemplateIcon(template.name);
            return (
              <div
                key={template.id}
                onClick={onCreateStory}
                className="p-4 border dark:border-gray-700 rounded-lg hover:border-sap-blue dark:hover:border-sap-blue cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                  <IconComponent size={24} className="text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="font-medium text-sap-dark dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                    {template.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {stories.length} Stories
            </span>
            <span className="flex items-center gap-1">
              <Database size={14} />
              {dataModels.length} Models
            </span>
            <span className="flex items-center gap-1">
              <Layout size={14} />
              {templates.length} Templates
            </span>
          </div>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
