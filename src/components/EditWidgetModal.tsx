import React, { useState, useEffect } from 'react';
import { X, BarChart2, LineChart, PieChart, TrendingUp, Table2, Gauge, GitBranch, Grid3X3, ScatterChart, Database, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Widget, Dimension, Measure, ChartType, VarianceConfig } from '../types';

interface EditWidgetModalProps {
  isOpen: boolean;
  widget: Widget | null;
  onClose: () => void;
  onSave: (widget: Widget) => void;
}

const MEASURE_COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0', '#ff6b6b', '#4ecdc4'];

type WidgetType = 'chart' | 'kpi' | 'table';

const CHART_TYPES: { type: ChartType; label: string; icon: React.ReactNode }[] = [
  { type: 'bar', label: 'Bar', icon: <BarChart2 size={18} /> },
  { type: 'column', label: 'Column', icon: <BarChart2 size={18} className="rotate-90" /> },
  { type: 'line', label: 'Line', icon: <LineChart size={18} /> },
  { type: 'area', label: 'Area', icon: <TrendingUp size={18} /> },
  { type: 'pie', label: 'Pie', icon: <PieChart size={18} /> },
  { type: 'donut', label: 'Donut', icon: <PieChart size={18} /> },
  { type: 'stacked', label: 'Stacked', icon: <BarChart2 size={18} /> },
  { type: 'waterfall', label: 'Waterfall', icon: <GitBranch size={18} /> },
  { type: 'pareto', label: 'Pareto', icon: <TrendingUp size={18} /> },
  { type: 'gauge', label: 'Gauge', icon: <Gauge size={18} /> },
  { type: 'heatmap', label: 'Heatmap', icon: <Grid3X3 size={18} /> },
  { type: 'scatter', label: 'Scatter', icon: <ScatterChart size={18} /> },
  { type: 'treemap', label: 'Treemap', icon: <Grid3X3 size={18} /> },
];

export const EditWidgetModal: React.FC<EditWidgetModalProps> = ({ isOpen, widget, onClose, onSave }) => {
  const { dataModels, selectModel, selectedModel, getModelDimensions, getModelMeasures } = useData();
  
  const [widgetType, setWidgetType] = useState<WidgetType>('chart');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [title, setTitle] = useState('');
  const [selectedModelId, setSelectedModelId] = useState<string>(selectedModel?.id || dataModels[0]?.id || '');
  const [availableDimensions, setAvailableDimensions] = useState<Dimension[]>([]);
  const [availableMeasures, setAvailableMeasures] = useState<Measure[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([]);
  const [selectedMeasures, setSelectedMeasures] = useState<Measure[]>([]);
  const [varianceEnabled, setVarianceEnabled] = useState(false);
  const [varianceConfig, setVarianceConfig] = useState<VarianceConfig>({
    enabled: false,
    compareType: 'plan',
    showAbsolute: true,
    showPercentage: true
  });
  const [linkedAnalysis, setLinkedAnalysis] = useState(true);
  const [drillDownEnabled, setDrillDownEnabled] = useState(false);
  const [drillDownDimension, setDrillDownDimension] = useState<string>('');

  useEffect(() => {
    if (selectedModelId) {
      const dims = getModelDimensions(selectedModelId);
      const meas = getModelMeasures(selectedModelId);
      setAvailableDimensions(dims);
      setAvailableMeasures(meas);
      selectModel(selectedModelId);
    }
  }, [selectedModelId]);

  useEffect(() => {
    if (widget) {
      const wType = widget.type === 'text' ? 'chart' : widget.type as WidgetType;
      setWidgetType(wType);
      setChartType((widget.chartType || 'bar') as ChartType);
      setTitle(widget.title);
      setSelectedDimensions(widget.dimensions);
      setSelectedMeasures(widget.measures);
      setLinkedAnalysis(widget.linkedAnalysis !== false);
      if (widget.variance) {
        setVarianceEnabled(widget.variance.enabled);
        setVarianceConfig(widget.variance);
      }
      if (widget.drillDown) {
        setDrillDownEnabled(widget.drillDown.enabled);
        setDrillDownDimension(widget.drillDown.currentDimension);
      }
    } else {
      resetForm();
    }
  }, [widget]);

  useEffect(() => {
    if (isOpen && !widget && selectedModelId) {
      const dims = getModelDimensions(selectedModelId);
      const meas = getModelMeasures(selectedModelId);
      setAvailableDimensions(dims);
      setAvailableMeasures(meas);
    }
  }, [isOpen, widget, selectedModelId]);

  const resetForm = () => {
    setWidgetType('chart');
    setChartType('bar');
    setTitle('');
    setSelectedDimensions([]);
    setSelectedMeasures([]);
    setVarianceEnabled(false);
    setVarianceConfig({
      enabled: false,
      compareType: 'plan',
      showAbsolute: true,
      showPercentage: true
    });
    setLinkedAnalysis(true);
    setDrillDownEnabled(false);
    setDrillDownDimension('');
  };

  if (!isOpen) return null;

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    setSelectedDimensions([]);
    setSelectedMeasures([]);
  };

  const handleAddDimension = (dimId: string) => {
    const dim = availableDimensions.find(d => d.id === dimId);
    if (dim && !selectedDimensions.find(d => d.id === dimId)) {
      setSelectedDimensions([...selectedDimensions, dim]);
    }
  };

  const handleRemoveDimension = (dimId: string) => {
    setSelectedDimensions(selectedDimensions.filter(d => d.id !== dimId));
  };

  const handleAddMeasure = (measId: string) => {
    const meas = availableMeasures.find(m => m.id === measId);
    if (meas && !selectedMeasures.find(m => m.id === measId)) {
      const colorIndex = selectedMeasures.length % MEASURE_COLORS.length;
      setSelectedMeasures([...selectedMeasures, { ...meas, color: MEASURE_COLORS[colorIndex] }]);
    }
  };

  const handleRemoveMeasure = (measId: string) => {
    setSelectedMeasures(selectedMeasures.filter(m => m.id !== measId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDimensions.length === 0 || selectedMeasures.length === 0) {
      alert('Please select at least one dimension and one measure');
      return;
    }

    const updatedWidget: Widget = {
      id: widget?.id || `widget-${Date.now()}`,
      type: widgetType,
      chartType: widgetType === 'chart' ? chartType : undefined,
      title: title || `${selectedMeasures.map(m => m.name).join(', ')} by ${selectedDimensions.map(d => d.name).join(', ')}`,
      dimensions: selectedDimensions,
      measures: selectedMeasures,
      filters: widget?.filters || [],
      linkedAnalysis,
      variance: varianceEnabled ? {
        ...varianceConfig,
        enabled: true,
        compareMeasure: varianceConfig.compareType === 'plan' ? 'plan_revenue' : 'previous_year_revenue'
      } : undefined,
      drillDown: drillDownEnabled ? {
        enabled: true,
        currentDimension: drillDownDimension || selectedDimensions[0]?.field || '',
        hierarchy: selectedDimensions.map(d => d.field),
        currentLevel: 0
      } : undefined
    };

    onSave(updatedWidget);
    resetForm();
    onClose();
  };

  const unusedDimensions = availableDimensions.filter(d => !selectedDimensions.find(sd => sd.id === d.id));
  const unusedMeasures = availableMeasures.filter(m => !selectedMeasures.find(sm => sm.id === m.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-semibold text-sap-dark dark:text-white">
            {widget ? 'Edit Widget' : 'Add Widget'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} className="dark:text-white" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Data Model Selection */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Database size={18} className="text-sap-blue" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Model</label>
            </div>
            <select
              value={selectedModelId}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            >
              {dataModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} ({(model.rowCount || 0).toLocaleString()} rows)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {dataModels.find(m => m.id === selectedModelId)?.description}
            </p>
          </div>

          {/* Widget Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Widget Type</label>
            <div className="flex gap-2">
              {(['chart', 'kpi', 'table'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWidgetType(type)}
                  className={`flex-1 p-3 border dark:border-gray-600 rounded-lg capitalize flex items-center justify-center gap-2 ${
                    widgetType === type 
                      ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/30 text-sap-blue' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                  }`}
                >
                  {type === 'chart' && <BarChart2 size={18} />}
                  {type === 'kpi' && <TrendingUp size={18} />}
                  {type === 'table' && <Table2 size={18} />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type */}
          {widgetType === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chart Type</label>
              <div className="grid grid-cols-4 gap-2">
                {CHART_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChartType(type)}
                    className={`p-3 border dark:border-gray-600 rounded-lg flex flex-col items-center gap-1 ${
                      chartType === type 
                        ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/30 text-sap-blue' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                    }`}
                  >
                    {icon}
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Widget title (auto-generated if empty)"
              className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            />
          </div>

          {/* Dimensions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dimensions ({selectedDimensions.length} selected)
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Add multiple for drill-down hierarchy
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {selectedDimensions.length === 0 ? (
                <span className="text-sm text-gray-400">No dimensions selected</span>
              ) : (
                selectedDimensions.map((dim, index) => (
                  <span
                    key={dim.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-sap-blue rounded-full text-sm"
                  >
                    <span className="w-5 h-5 bg-sap-blue text-white rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    {dim.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveDimension(dim.id)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))
              )}
            </div>

            {unusedDimensions.length > 0 && (
              <select
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddDimension(e.target.value);
                    e.target.value = '';
                  }
                }}
                value=""
              >
                <option value="">Add dimension...</option>
                {unusedDimensions.map((dim) => (
                  <option key={dim.id} value={dim.id}>{dim.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Measures */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Measures ({selectedMeasures.length} selected)
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {selectedMeasures.length === 0 ? (
                <span className="text-sm text-gray-400">No measures selected</span>
              ) : (
                selectedMeasures.map((meas) => (
                  <span
                    key={meas.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-white"
                    style={{ backgroundColor: meas.color || '#0a6ed1' }}
                  >
                    {meas.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveMeasure(meas.id)}
                      className="hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))
              )}
            </div>

            {unusedMeasures.length > 0 && (
              <select
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddMeasure(e.target.value);
                    e.target.value = '';
                  }
                }}
                value=""
              >
                <option value="">Add measure...</option>
                {unusedMeasures.map((meas) => (
                  <option key={meas.id} value={meas.id}>{meas.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Drill-Down Configuration */}
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-purple-500" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drill-Down</label>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={drillDownEnabled}
                  onChange={(e) => setDrillDownEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-500"></div>
              </label>
            </div>
            
            {drillDownEnabled && selectedDimensions.length > 0 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Starting Dimension</label>
                  <select
                    value={drillDownDimension}
                    onChange={(e) => setDrillDownDimension(e.target.value)}
                    className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select starting dimension...</option>
                    {selectedDimensions.map(dim => (
                      <option key={dim.id} value={dim.field}>{dim.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Drill-Down Hierarchy:</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDimensions.map((dim, idx) => (
                      <React.Fragment key={dim.id}>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                          {dim.name}
                        </span>
                        {idx < selectedDimensions.length - 1 && <span>→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {drillDownEnabled && selectedDimensions.length === 0 && (
              <p className="text-xs text-orange-500">Add dimensions to configure drill-down hierarchy</p>
            )}
          </div>

          {/* Variance Analysis */}
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Variance Analysis</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={varianceEnabled}
                  onChange={(e) => setVarianceEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sap-blue rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-sap-blue"></div>
              </label>
            </div>
            
            {varianceEnabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Compare To</label>
                  <select
                    value={varianceConfig.compareType}
                    onChange={(e) => setVarianceConfig({ ...varianceConfig, compareType: e.target.value as any })}
                    className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="plan">Plan</option>
                    <option value="previousYear">Previous Year</option>
                    <option value="previousPeriod">Previous Period</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={varianceConfig.showAbsolute}
                      onChange={(e) => setVarianceConfig({ ...varianceConfig, showAbsolute: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    Show Absolute
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={varianceConfig.showPercentage}
                      onChange={(e) => setVarianceConfig({ ...varianceConfig, showPercentage: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    Show Percentage
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Linked Analysis */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Linked Analysis</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Connect this widget with other widgets for filtering</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={linkedAnalysis}
                onChange={(e) => setLinkedAnalysis(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sap-blue rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-sap-blue"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700"
            >
              {widget ? 'Save Changes' : 'Add Widget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
