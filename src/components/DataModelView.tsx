import React, { useState } from 'react';
import { Database, Table, RefreshCw, Upload, Link, Search, ChevronDown, ChevronRight, Hash, Type, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { DataModel, DataColumn } from '../types';

export const DataModelView: React.FC = () => {
  const { dataModels, data } = useData();
  const [expandedModel, setExpandedModel] = useState<string | null>(dataModels[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<DataModel | null>(dataModels[0] || null);
  const [showDataPreview, setShowDataPreview] = useState(false);

  const filteredModels = dataModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'number': return <Hash size={14} className="text-blue-500" />;
      case 'string': return <Type size={14} className="text-green-500" />;
      case 'date': return <Calendar size={14} className="text-orange-500" />;
      default: return <Type size={14} className="text-gray-500" />;
    }
  };

  const toggleModel = (modelId: string) => {
    setExpandedModel(expandedModel === modelId ? null : modelId);
    const model = dataModels.find(m => m.id === modelId);
    if (model) setSelectedModel(model);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-sap-dark dark:text-white">Data Models</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your data sources and connections</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
            <Upload size={18} />
            Import Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700">
            <Link size={18} />
            New Connection
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel - Model List */}
        <div className="w-80 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {filteredModels.map((model) => (
              <div key={model.id} className="mb-2">
                <button
                  onClick={() => toggleModel(model.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedModel?.id === model.id
                      ? 'bg-sap-blue/10 border border-sap-blue'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    model.type === 'live' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Database size={20} className={model.type === 'live' ? 'text-green-600' : 'text-blue-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sap-dark dark:text-white truncate">{model.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        model.type === 'live' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {model.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{model.rowCount.toLocaleString()} rows</p>
                  </div>
                  {expandedModel === model.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {expandedModel === model.id && (
                  <div className="ml-4 mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                    {model.columns.map((column) => (
                      <div
                        key={column.id}
                        className="flex items-center gap-2 py-1.5 px-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        {getTypeIcon(column.dataType)}
                        <span>{column.name}</span>
                        <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                          column.type === 'dimension' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {column.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Model Details */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow">
          {selectedModel ? (
            <>
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-sap-dark dark:text-white">{selectedModel.name}</h3>
                    <p className="text-sm text-gray-500">{selectedModel.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                      <RefreshCw size={14} />
                      Refresh
                    </button>
                    <button
                      onClick={() => setShowDataPreview(!showDataPreview)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-sap-blue text-white rounded-lg hover:bg-blue-700"
                    >
                      <Table size={14} />
                      {showDataPreview ? 'Hide Data' : 'Preview Data'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-6 mt-4 text-sm">
                  <div>
                    <span className="text-gray-500">Source:</span>
                    <span className="ml-2 font-medium dark:text-white">{selectedModel.source}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Refresh:</span>
                    <span className="ml-2 font-medium dark:text-white">{selectedModel.lastRefresh}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rows:</span>
                    <span className="ml-2 font-medium dark:text-white">{selectedModel.rowCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {showDataPreview ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          {selectedModel.columns.slice(0, 6).map((col) => (
                            <th key={col.id} className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                              <div className="flex items-center gap-1">
                                {getTypeIcon(col.dataType)}
                                {col.name}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="py-2 px-3 dark:text-gray-300">{row.region}</td>
                            <td className="py-2 px-3 dark:text-gray-300">{row.product}</td>
                            <td className="py-2 px-3 dark:text-gray-300">{row.year}</td>
                            <td className="py-2 px-3 dark:text-gray-300">{row.month}</td>
                            <td className="py-2 px-3 dark:text-gray-300">${row.revenue.toLocaleString()}</td>
                            <td className="py-2 px-3 dark:text-gray-300">${row.costs.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Showing 10 of {selectedModel.rowCount.toLocaleString()} rows
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-sap-dark dark:text-white mb-3">Dimensions</h4>
                      <div className="space-y-2">
                        {selectedModel.columns.filter(c => c.type === 'dimension').map((col) => (
                          <div key={col.id} className="flex items-center gap-2 text-sm">
                            {getTypeIcon(col.dataType)}
                            <span className="dark:text-gray-300">{col.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-sap-dark dark:text-white mb-3">Measures</h4>
                      <div className="space-y-2">
                        {selectedModel.columns.filter(c => c.type === 'measure').map((col) => (
                          <div key={col.id} className="flex items-center gap-2 text-sm">
                            {getTypeIcon(col.dataType)}
                            <span className="dark:text-gray-300">{col.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a data model to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
