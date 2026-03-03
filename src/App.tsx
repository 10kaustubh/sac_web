import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Dashboard } from './components/Dashboard';
import { DataModelView } from './components/DataModelView';
import { TemplateSelector } from './components/TemplateSelector';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './index.css';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState('home');
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const { theme } = useTheme();
  const { setActiveStory } = useData();

  const handleOpenStory = (story: any) => {
    setActiveStory(story);
    setActiveView('stories');
  };

  const handleCreateStory = () => {
    setIsTemplateOpen(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomePage 
            onNavigate={setActiveView}
            onOpenStory={handleOpenStory}
            onCreateStory={handleCreateStory}
          />
        );
      case 'stories':
        return <Dashboard />;
      case 'models':
        return <DataModelView />;
      case 'analytics':
        return (
          <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
            <h2 className="text-2xl font-bold text-sap-dark dark:text-white mb-4">Analytics</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-500 dark:text-gray-400 mb-6">Advanced analytics tools and smart insights will appear here.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="font-semibold text-sap-blue text-lg">Smart Discovery</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">AI-powered insights that automatically find patterns and anomalies in your data.</p>
                  <button className="mt-4 text-sap-blue text-sm font-medium hover:underline">Explore →</button>
                </div>
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="font-semibold text-green-600 text-lg">Smart Predict</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Machine learning models for forecasting and predictive analytics.</p>
                  <button className="mt-4 text-green-600 text-sm font-medium hover:underline">Explore →</button>
                </div>
                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="font-semibold text-purple-600 text-lg">Smart Insights</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Automated analysis with natural language explanations.</p>
                  <button className="mt-4 text-purple-600 text-sm font-medium hover:underline">Explore →</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
              <h3 className="font-semibold text-sap-dark dark:text-white mb-4">Recent Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span>📊</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sap-dark dark:text-white">Revenue Spike Detected</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">North America revenue increased by 15% in March compared to February.</p>
                    <span className="text-xs text-gray-400 mt-2 block">Generated 2 hours ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span>📈</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sap-dark dark:text-white">Product A Outperforming</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Product A consistently shows 20% higher profit margins than other products.</p>
                    <span className="text-xs text-gray-400 mt-2 block">Generated 5 hours ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <span>⚠️</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sap-dark dark:text-white">Cost Trend Warning</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Operating costs in Asia Pacific region showing upward trend over last 3 months.</p>
                    <span className="text-xs text-gray-400 mt-2 block">Generated 1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'planning':
        return (
          <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
            <h2 className="text-2xl font-bold text-sap-dark dark:text-white mb-4">Planning</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-500 dark:text-gray-400 mb-6">Planning and forecasting tools for budgeting and financial projections.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-semibold text-sap-dark dark:text-white text-lg">Budget Planning</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Create and manage budgets with collaborative planning features.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">FY 2024</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">3 versions</span>
                  </div>
                </div>
                <div className="p-6 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-sap-dark dark:text-white text-lg">Forecasting</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Predict future trends using statistical and ML-based models.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">Active</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">5 models</span>
                  </div>
                </div>
                <div className="p-6 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="font-semibold text-sap-dark dark:text-white text-lg">Scenario Planning</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Create what-if scenarios to evaluate different business outcomes.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">8 scenarios</span>
                  </div>
                </div>
                <div className="p-6 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-sap-dark dark:text-white text-lg">Variance Analysis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Compare actual vs planned with detailed variance breakdowns.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">Updated today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-sap-dark dark:text-white">Templates</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Start with pre-built templates to accelerate your analytics</p>
              </div>
              <button
                onClick={() => setIsTemplateOpen(true)}
                className="bg-sap-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Use Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '📊', name: 'Executive Dashboard', desc: 'High-level KPIs and trends for leadership', category: 'Finance', pages: 2 },
                { icon: '📈', name: 'Sales Analysis', desc: 'Detailed sales performance by region', category: 'Sales', pages: 3 },
                { icon: '💰', name: 'Cost Analysis', desc: 'Operating costs and margin analysis', category: 'Finance', pages: 2 },
                { icon: '👥', name: 'HR Analytics', desc: 'Workforce metrics and employee insights', category: 'HR', pages: 4 },
                { icon: '📦', name: 'Inventory Dashboard', desc: 'Stock levels and supply chain metrics', category: 'Operations', pages: 2 },
                { icon: '🎯', name: 'Marketing Performance', desc: 'Campaign ROI and channel analysis', category: 'Marketing', pages: 3 },
                { icon: '🏭', name: 'Manufacturing KPIs', desc: 'Production efficiency and quality metrics', category: 'Operations', pages: 2 },
                { icon: '📄', name: 'Blank Canvas', desc: 'Start from scratch with empty story', category: 'General', pages: 1 },
              ].map((template, index) => (
                <div 
                  key={index}
                  onClick={() => setIsTemplateOpen(true)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="font-semibold text-sap-dark dark:text-white">{template.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.desc}</p>
                  <div className="flex gap-2 mt-4">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{template.category}</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">{template.pages} pages</span>
                  </div>
                </div>
              ))}
            </div>
            <TemplateSelector isOpen={isTemplateOpen} onClose={() => setIsTemplateOpen(false)} />
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
            <h2 className="text-2xl font-bold text-sap-dark dark:text-white mb-6">Settings</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-sap-dark dark:text-white">Appearance</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sap-dark dark:text-white">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current: {theme.mode === 'light' ? 'Light' : 'Dark'} mode</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Use toggle in header to switch</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sap-dark dark:text-white">Language</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Interface language</p>
                  </div>
                  <select className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2">
                    <option>English (US)</option>
                    <option>German</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sap-dark dark:text-white">Date Format</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">How dates are displayed</p>
                  </div>
                  <select className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-sap-dark dark:text-white">Data & Storage</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sap-dark dark:text-white">Local Storage Used</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stories and settings saved locally</p>
                  </div>
                  <span className="text-sm font-medium text-sap-dark dark:text-white">
                    {(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sap-dark dark:text-white">Clear All Data</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remove all saved stories and settings</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure? This will delete all saved data and cannot be undone.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-sap-dark dark:text-white">About</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Application</span>
                  <span className="text-sap-dark dark:text-white">SAC Clone</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Version</span>
                  <span className="text-sap-dark dark:text-white">2.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Built with</span>
                  <span className="text-sap-dark dark:text-white">React, TypeScript, Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <HomePage 
            onNavigate={setActiveView}
            onOpenStory={handleOpenStory}
            onCreateStory={handleCreateStory}
          />
        );
    }
  };

  return (
    <div className={`flex h-screen ${theme.mode === 'dark' ? 'dark' : ''}`}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <TemplateSelector isOpen={isTemplateOpen} onClose={() => setIsTemplateOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
