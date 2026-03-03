import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DataProvider } from './context/DataContext';
import './index.css';

function App() {
  const [activeView, setActiveView] = useState('home');

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <Dashboard />;
      case 'stories':
        return <Dashboard />;
      case 'models':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-sap-dark mb-4">Models</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Data models and connections will appear here.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-sap-dark mb-4">Analytics</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Advanced analytics tools will appear here.</p>
            </div>
          </div>
        );
      case 'planning':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-sap-dark mb-4">Planning</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Planning and forecasting tools will appear here.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-sap-dark mb-4">Settings</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Application settings will appear here.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;
