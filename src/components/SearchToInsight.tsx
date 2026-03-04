import React, { useState } from 'react';
import { Search, Sparkles, X, BarChart2, LineChart, PieChart, TrendingUp, Map, Wand2, Database } from 'lucide-react';
import { useData } from '../context/DataContext';
import { NLPQuery, Widget, ChartType } from '../types';

interface SearchToInsightProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWidget: (widget: Partial<Widget>) => void;
}

export const SearchToInsight: React.FC<SearchToInsightProps> = ({ isOpen, onClose, onCreateWidget }) => {
  const { processNLPQuery, dataModels, selectedModel, selectModel, selectedModelDimensions, selectedModelMeasures } = useData();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<NLPQuery | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(selectedModel?.id || dataModels[0]?.id || '');

  const exampleQueries = [
    "Show revenue by region",
    "Compare profit vs costs by month",
    "Revenue trend over time",
    "Product mix distribution",
    "Show variance analysis by region",
    "Top regions by revenue",
    "Revenue and profit by product"
  ];

  const getChartIcon = (chartType: ChartType) => {
    switch (chartType) {
      case 'line': return <LineChart size={20} />;
      case 'pie': case 'donut': return <PieChart size={20} />;
      case 'bar': case 'column': return <BarChart2 size={20} />;
      case 'geomap': return <Map size={20} />;
      default: return <BarChart2 size={20} />;
    }
  };

  const handleModelChange = (modelId: string) => {
    setCurrentModelId(modelId);
    selectModel(modelId);
    setResult(null);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const nlpResult = processNLPQuery(query);
      setResult(nlpResult);
      setIsProcessing(false);
    }, 800);
  };

  const handleCreateChart = () => {
    if (!result) return;

    const selectedDimensions = result.suggestedDimensions?.map(field => 
      selectedModelDimensions.find(d => d.field === field)
    ).filter(Boolean) || [];

    const selectedMeasures = result.suggestedMeasures?.map(field => 
      selectedModelMeasures.find(m => m.field === field)
    ).filter(Boolean) || [];

    // If no matches found, use first available dimension/measure
    if (selectedDimensions.length === 0 && selectedModelDimensions.length > 0) {
      selectedDimensions.push(selectedModelDimensions[0]);
    }
    if (selectedMeasures.length === 0 && selectedModelMeasures.length > 0) {
      selectedMeasures.push(selectedModelMeasures[0]);
    }

    const widget: Partial<Widget> = {
      type: 'chart',
      chartType: result.suggestedChart,
      title: query,
      dimensions: selectedDimensions as any,
      measures: selectedMeasures as any,
      filters: [],
      linkedAnalysis: true
    };

    onCreateWidget(widget);
    setQuery('');
    setResult(null);
    onClose();
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setIsProcessing(true);
    setTimeout(() => {
      const nlpResult = processNLPQuery(example);
      setResult(nlpResult);
      setIsProcessing(false);
    }, 500);
  };

  if (!isOpen) return null;

  const currentModel = dataModels.find(m => m.id === currentModelId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-sap-blue to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <Sparkles size={24} />
              <div>
                <h2 className="text-lg font-semibold">Search to Insight</h2>
                <p className="text-sm text-blue-100">Ask a question in natural language</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-white/20 rounded text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Model Selection */}
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-sap-blue" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Model:</label>
            <select
              value={currentModelId}
              onChange={(e) => handleModelChange(e.target.value)}
              className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
            >
              {dataModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          {currentModel && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Available fields:</span>
              {selectedModelDimensions.slice(0, 3).map(d => (
                <span key={d.id} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  {d.name}
                </span>
              ))}
              {selectedModelMeasures.slice(0, 3).map(m => (
                <span key={m.id} className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                  {m.name}
                </span>
              ))}
              {(selectedModelDimensions.length + selectedModelMeasures.length > 6) && (
                <span className="text-xs text-gray-400">+{selectedModelDimensions.length + selectedModelMeasures.length - 6} more</span>
              )}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., Show gross margin by region"
                className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-sap-blue"
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isProcessing}
              className="px-6 py-3 bg-sap-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && !isProcessing && (
          <div className="px-4 pb-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center text-green-600 dark:text-green-300">
                    {getChartIcon(result.suggestedChart || 'column')}
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-200">Suggested Visualization</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      <span className="font-medium capitalize">{result.suggestedChart}</span> chart showing{' '}
                      <span className="font-medium">{result.suggestedMeasures?.join(', ')}</span> by{' '}
                      <span className="font-medium">{result.suggestedDimensions?.join(', ')}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <TrendingUp size={12} />
                        Confidence: {(result.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCreateChart}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Create Chart
                </button>
              </div>

              {/* Preview chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 border dark:border-gray-600">
                  Model: {currentModel?.name}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
                  Chart: {result.suggestedChart}
                </span>
                {result.suggestedDimensions?.map(dim => (
                  <span key={dim} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                    Dimension: {dim}
                  </span>
                ))}
                {result.suggestedMeasures?.map(meas => (
                  <span key={meas} className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded">
                    Measure: {meas}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Example Queries */}
        {!result && (
          <div className="px-4 pb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Sparkles size={12} />
              Powered by SAC Smart Insights
            </div>
            <div>
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to generate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
