import React, { useState } from 'react';
import { Database, Table, BarChart2, Search, RefreshCw, ChevronDown, ChevronRight, Eye, Download, Users, Package, Briefcase, UserCheck, Truck, Hash, Type, Calendar, DollarSign, MapPin, Percent } from 'lucide-react';
import { useData } from '../context/DataContext';

export const DataModelView: React.FC = () => {
  const { dataModels, getModelData, getModelDimensions, getModelMeasures } = useData();
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewModel, setPreviewModel] = useState<string | null>(null);

  const getModelIcon = (modelName: string) => {
    if (modelName.includes('Sales')) return BarChart2;
    if (modelName.includes('Customer')) return Users;
    if (modelName.includes('Inventory')) return Package;
    if (modelName.includes('Financial')) return Briefcase;
    if (modelName.includes('HR')) return UserCheck;
    if (modelName.includes('Supply')) return Truck;
    return Database;
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'string': return Type;
      case 'number': return Hash;
      case 'date': return Calendar;
      case 'currency': return DollarSign;
      case 'geo': return MapPin;
      case 'percent': return Percent;
      default: return Type;
    }
  };

  const filteredModels = dataModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (modelId: string) => {
    setExpandedModel(expandedModel === modelId ? null : modelId);
  };

  const handlePreview = (modelId: string) => {
    setPreviewModel(previewModel === modelId ? null : modelId);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-sap-dark dark:text-white">Data Models</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage and explore your data sources</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700">
            <RefreshCw size={18} />
            Refresh All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredModels.map((model) => {
          const IconComponent = getModelIcon(model.name);
          const isExpanded = expandedModel === model.id;
          const dimensions = getModelDimensions(model.id);
          const measures = getModelMeasures(model.id);
          const modelData = getModelData(model.id);
          const showPreview = previewModel === model.id;

          return (
            <div key={model.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {/* Model Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => toggleExpand(model.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <IconComponent size={24} className="text-sap-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sap-dark dark:text-white">{model.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{model.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium text-sap-dark dark:text-white">{model.rowCount?.toLocaleString()} rows</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{model.type === 'live' ? 'Live Connection' : 'Imported'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    model.type === 'live' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {model.type === 'live' ? 'Live' : 'Import'}
                  </span>
                  {isExpanded ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t dark:border-gray-700">
                  {/* Dimensions & Measures */}
                  <div className="p-4 grid grid-cols-2 gap-6">
                    {/* Dimensions */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Table size={16} />
                        Dimensions ({dimensions.length})
                      </h4>
                      <div className="space-y-2">
                        {dimensions.map((dim) => (
                          <div key={dim.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <Type size={14} className="text-blue-500" />
                            <span className="text-sm text-sap-dark dark:text-white">{dim.name}</span>
                            <span className="text-xs text-gray-400 ml-auto">{dim.field}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Measures */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <BarChart2 size={16} />
                        Measures ({measures.length})
                      </h4>
                      <div className="space-y-2">
                        {measures.map((meas) => {
                          const DataTypeIcon = getDataTypeIcon(meas.format || 'number');
                          return (
                            <div key={meas.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <DataTypeIcon size={14} className="text-green-500" />
                              <span className="text-sm text-sap-dark dark:text-white">{meas.name}</span>
                              <span className="text-xs text-gray-400 ml-auto">{meas.aggregation}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(model.id);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Eye size={14} />
                      {showPreview ? 'Hide Preview' : 'Preview Data'}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                      <Download size={14} />
                      Export
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                      <RefreshCw size={14} />
                      Refresh
                    </button>
                  </div>

                  {/* Data Preview */}
                  {showPreview && (
                    <div className="border-t dark:border-gray-700 p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Data Preview (First 10 rows)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                              {dimensions.slice(0, 3).map(dim => (
                                <th key={dim.id} className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                                  {dim.name}
                                </th>
                              ))}
                              {measures.slice(0, 3).map(meas => (
                                <th key={meas.id} className="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300">
                                  {meas.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {modelData.slice(0, 10).map((row: any, idx: number) => (
                              <tr key={idx} className="border-t dark:border-gray-700">
                                {dimensions.slice(0, 3).map(dim => (
                                  <td key={dim.id} className="px-3 py-2 text-gray-600 dark:text-gray-400">
                                    {row[dim.field]}
                                  </td>
                                ))}
                                {measures.slice(0, 3).map(meas => (
                                  <td key={meas.id} className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">
                                    {meas.format === 'currency' 
                                      ? `$${(Number(row[meas.field]) || 0).toLocaleString()}`
                                      : (Number(row[meas.field]) || 0).toLocaleString()
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredModels.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <Database size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No data models found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
};
