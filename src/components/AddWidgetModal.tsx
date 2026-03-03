import React, { useState } from 'react';
import { X, BarChart2, PieChart, TrendingUp, Table } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (widget: any) => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { dimensions, measures } = useData();
  const [widgetType, setWidgetType] = useState<'chart' | 'kpi' | 'table'>('chart');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'column'>('bar');
  const [title, setTitle] = useState('');
  const [selectedDimension, setSelectedDimension] = useState(dimensions[0]?.id || '');
  const [selectedMeasure, setSelectedMeasure] = useState(measures[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dimension = dimensions.find(d => d.id === selectedDimension);
    const measure = measures.find(m => m.id === selectedMeasure);
    
    onAdd({
      type: widgetType,
      chartType: widgetType === 'chart' ? chartType : undefined,
      title: title || `${measure?.name} by ${dimension?.name}`,
      dimensions: dimension ? [dimension] : [],
      measures: measure ? [measure] : [],
      filters: []
    });
    
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-sap-dark">Add Widget</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Widget Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWidgetType('chart')}
                className={`flex-1 p-3 border rounded-lg flex flex-col items-center gap-1 ${
                  widgetType === 'chart' ? 'border-sap-blue bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <BarChart2 size={24} className={widgetType === 'chart' ? 'text-sap-blue' : 'text-gray-500'} />
                <span className="text-sm">Chart</span>
              </button>
              <button
                type="button"
                onClick={() => setWidgetType('kpi')}
                className={`flex-1 p-3 border rounded-lg flex flex-col items-center gap-1 ${
                  widgetType === 'kpi' ? 'border-sap-blue bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <TrendingUp size={24} className={widgetType === 'kpi' ? 'text-sap-blue' : 'text-gray-500'} />
                <span className="text-sm">KPI</span>
              </button>
              <button
                type="button"
                onClick={() => setWidgetType('table')}
                className={`flex-1 p-3 border rounded-lg flex flex-col items-center gap-1 ${
                  widgetType === 'table' ? 'border-sap-blue bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <Table size={24} className={widgetType === 'table' ? 'text-sap-blue' : 'text-gray-500'} />
                <span className="text-sm">Table</span>
              </button>
            </div>
          </div>

          {widgetType === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <div className="flex gap-2">
                {(['bar', 'line', 'pie', 'column'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChartType(type)}
                    className={`flex-1 p-2 border rounded-lg capitalize ${
                      chartType === type ? 'border-sap-blue bg-blue-50 text-sap-blue' : 'hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Widget title"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dimension</label>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            >
              {dimensions.map((dim) => (
                <option key={dim.id} value={dim.id}>{dim.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Measure</label>
            <select
              value={selectedMeasure}
              onChange={(e) => setSelectedMeasure(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            >
              {measures.map((meas) => (
                <option key={meas.id} value={meas.id}>{meas.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700"
            >
              Add Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
