import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Widget, Dimension, Measure } from '../types';

interface EditWidgetModalProps {
  isOpen: boolean;
  widget: Widget | null;
  onClose: () => void;
  onSave: (widget: Widget) => void;
}

const MEASURE_COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0', '#ff6b6b', '#4ecdc4'];

type WidgetType = 'chart' | 'kpi' | 'table';
type ChartType = 'line' | 'bar' | 'pie' | 'column' | 'stacked' | 'area' | 'donut';

export const EditWidgetModal: React.FC<EditWidgetModalProps> = ({ isOpen, widget, onClose, onSave }) => {
  const { dimensions, measures } = useData();
  
  const [widgetType, setWidgetType] = useState<WidgetType>('chart');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [title, setTitle] = useState('');
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([]);
  const [selectedMeasures, setSelectedMeasures] = useState<Measure[]>([]);

  useEffect(() => {
    if (widget) {
      const wType = widget.type === 'text' ? 'chart' : widget.type;
      setWidgetType(wType as WidgetType);
      setChartType((widget.chartType || 'bar') as ChartType);
      setTitle(widget.title);
      setSelectedDimensions(widget.dimensions);
      setSelectedMeasures(widget.measures);
    } else {
      resetForm();
    }
  }, [widget]);

  const resetForm = () => {
    setWidgetType('chart');
    setChartType('bar');
    setTitle('');
    setSelectedDimensions([]);
    setSelectedMeasures([]);
  };

  if (!isOpen) return null;

  const handleAddDimension = (dimId: string) => {
    const dim = dimensions.find(d => d.id === dimId);
    if (dim && !selectedDimensions.find(d => d.id === dimId)) {
      setSelectedDimensions([...selectedDimensions, dim]);
    }
  };

  const handleRemoveDimension = (dimId: string) => {
    setSelectedDimensions(selectedDimensions.filter(d => d.id !== dimId));
  };

  const handleAddMeasure = (measId: string) => {
    const meas = measures.find(m => m.id === measId);
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
      filters: widget?.filters || []
    };

    onSave(updatedWidget);
    resetForm();
    onClose();
  };

  const availableDimensions = dimensions.filter(d => !selectedDimensions.find(sd => sd.id === d.id));
  const availableMeasures = measures.filter(m => !selectedMeasures.find(sm => sm.id === m.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-sap-dark dark:text-white">
            {widget ? 'Edit Widget' : 'Add Widget'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} className="dark:text-white" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Widget Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Widget Type</label>
            <div className="flex gap-2">
              {(['chart', 'kpi', 'table'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWidgetType(type)}
                  className={`flex-1 p-3 border dark:border-gray-600 rounded-lg capitalize ${
                    widgetType === type 
                      ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/30 text-sap-blue' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type */}
          {widgetType === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chart Type</label>
              <div className="flex gap-2 flex-wrap">
                {(['bar', 'line', 'column', 'pie', 'donut', 'area', 'stacked'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChartType(type)}
                    className={`px-4 py-2 border dark:border-gray-600 rounded-lg capitalize ${
                      chartType === type 
                        ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/30 text-sap-blue' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                    }`}
                  >
                    {type}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dimensions ({selectedDimensions.length} selected)
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedDimensions.map((dim) => (
                <span
                  key={dim.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-sap-blue rounded-full text-sm"
                >
                  {dim.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveDimension(dim.id)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            {availableDimensions.length > 0 && (
              <div className="flex gap-2">
                <select
                  className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddDimension(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">Add dimension...</option>
                  {availableDimensions.map((dim) => (
                    <option key={dim.id} value={dim.id}>{dim.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Measures */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Measures ({selectedMeasures.length} selected)
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedMeasures.map((meas) => (
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
              ))}
            </div>

            {availableMeasures.length > 0 && (
              <div className="flex gap-2">
                <select
                  className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddMeasure(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">Add measure...</option>
                  {availableMeasures.map((meas) => (
                    <option key={meas.id} value={meas.id}>{meas.name}</option>
                  ))}
                </select>
              </div>
            )}
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
