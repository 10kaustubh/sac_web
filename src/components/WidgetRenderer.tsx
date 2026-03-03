import React, { useRef, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Trash2, Edit2, Copy, Download, Filter, X, ArrowUpDown } from 'lucide-react';
import { Widget, SortConfig } from '../types';
import { useData } from '../context/DataContext';
import html2canvas from 'html2canvas';

const COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0', '#ff6b6b', '#4ecdc4'];

interface WidgetRendererProps {
  widget: Widget;
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
}

interface DataItem {
  name: string;
  [key: string]: string | number;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, onDelete, onEdit, onDuplicate }) => {
  const { getMultiMeasureData, applyWidgetFilter, widgetFilters, clearWidgetFilters } = useData();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  const dimension = widget.dimensions[0];
  const measureFields = widget.measures.map(m => m.field);
  
  if (!dimension || widget.measures.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">Widget configuration incomplete</p>
      </div>
    );
  }

  let data: DataItem[] = getMultiMeasureData(dimension.field, measureFields);

  // Apply sorting for tables
  if (sortConfig && widget.type === 'table') {
    data = [...data].sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }

  const handleDrillDown = (value: string) => {
    applyWidgetFilter({
      dimensionId: dimension.id,
      field: dimension.field,
      selectedValues: [value]
    });
  };

  const handleExport = async (format: 'png' | 'jpg') => {
    if (widgetRef.current) {
      try {
        const canvas = await html2canvas(widgetRef.current, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        const link = document.createElement('a');
        link.download = `${widget.title.replace(/\s+/g, '_')}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
    setShowMenu(false);
  };

  const handleSort = (field: string) => {
    setSortConfig(prev => {
      if (prev?.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'desc' };
    });
  };

  const isFiltered = widgetFilters.some(f => f.field === dimension.field);

  const renderChart = () => {
    const chartProps = {
      data,
      onClick: (data: any) => {
        if (data && data.activePayload && data.activePayload[0]) {
          handleDrillDown(data.activePayload[0].payload.name);
        }
      }
    };

    switch (widget.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Legend />
              {widget.measures.map((measure, index) => (
                <Line
                  key={measure.id}
                  type="monotone"
                  dataKey={measure.field}
                  name={measure.name}
                  stroke={measure.color || COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ cursor: 'pointer' }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Legend />
              {widget.measures.map((measure, index) => (
                <Area
                  key={measure.id}
                  type="monotone"
                  dataKey={measure.field}
                  name={measure.name}
                  stroke={measure.color || COLORS[index % COLORS.length]}
                  fill={measure.color || COLORS[index % COLORS.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
      case 'donut':
        const pieData = data.map(item => ({
          name: item.name,
          value: widget.measures.reduce((sum, m) => sum + (Number(item[m.field]) || 0), 0)
        }));
        return (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={widget.chartType === 'donut' ? 60 : 0}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                onClick={(data) => handleDrillDown(data.name)}
                cursor="pointer"
              >
                {pieData.map((item, index) => (
                  <Cell key={item.name + index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'column':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Legend />
              {widget.measures.map((measure, index) => (
                <Bar
                  key={measure.id}
                  dataKey={measure.field}
                  name={measure.name}
                  fill={measure.color || COLORS[index % COLORS.length]}
                  cursor="pointer"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'stacked':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Legend />
              {widget.measures.map((measure, index) => (
                <Bar
                  key={measure.id}
                  dataKey={measure.field}
                  name={measure.name}
                  fill={measure.color || COLORS[index % COLORS.length]}
                  stackId="stack"
                  cursor="pointer"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart {...chartProps} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Legend />
              {widget.measures.map((measure, index) => (
                <Bar
                  key={measure.id}
                  dataKey={measure.field}
                  name={measure.name}
                  fill={measure.color || COLORS[index % COLORS.length]}
                  cursor="pointer"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderKPI = () => {
    const totals = widget.measures.map(measure => {
      const total = data.reduce((sum, item) => sum + (Number(item[measure.field]) || 0), 0);
      return { name: measure.name, value: total, color: measure.color };
    });

    return (
      <div className="grid grid-cols-1 gap-4 py-4">
        {totals.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.name}</p>
            <p className="text-3xl font-bold" style={{ color: item.color || COLORS[index % COLORS.length] }}>
              ${(item.value / 1000000).toFixed(2)}M
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-green-500">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">+8.5%</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <th 
                className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  {dimension.name}
                  <ArrowUpDown size={14} className={sortConfig?.field === 'name' ? 'text-sap-blue' : 'text-gray-400'} />
                </div>
              </th>
              {widget.measures.map((measure) => (
                <th 
                  key={measure.id} 
                  className="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort(measure.field)}
                >
                  <div className="flex items-center justify-end gap-1">
                    {measure.name}
                    <ArrowUpDown size={14} className={sortConfig?.field === measure.field ? 'text-sap-blue' : 'text-gray-400'} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row.name + index} 
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleDrillDown(row.name)}
              >
                <td className="py-2 px-3 dark:text-gray-300">{row.name}</td>
                {widget.measures.map((measure) => (
                  <td key={measure.id} className="text-right py-2 px-3 dark:text-gray-300">
                    ${(Number(row[measure.field]) / 1000).toFixed(0)}K
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 dark:border-gray-600 font-medium bg-gray-50 dark:bg-gray-700">
              <td className="py-2 px-3 dark:text-gray-300">Total</td>
              {widget.measures.map((measure) => {
                const total = data.reduce((sum, item) => sum + (Number(item[measure.field]) || 0), 0);
                return (
                  <td key={measure.id} className="text-right py-2 px-3 dark:text-gray-300">
                    ${(total / 1000).toFixed(0)}K
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div ref={widgetRef} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-sap-dark dark:text-white">{widget.title}</h3>
          {isFiltered && (
            <button
              onClick={clearWidgetFilters}
              className="flex items-center gap-1 text-xs bg-sap-blue/10 text-sap-blue px-2 py-1 rounded-full hover:bg-sap-blue/20"
            >
              <Filter size={12} />
              Filtered
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 relative">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-blue-50 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-sap-blue"
              title="Edit widget"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="p-1.5 hover:bg-green-50 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-green-500"
              title="Duplicate widget"
            >
              <Copy size={16} />
            </button>
          )}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600"
            title="Export"
          >
            <Download size={16} />
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-500"
              title="Delete widget"
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* Export Menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-10">
              <button
                onClick={() => handleExport('png')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
              >
                Export as PNG
              </button>
              <button
                onClick={() => handleExport('jpg')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
              >
                Export as JPG
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {widget.type === 'chart' && renderChart()}
      {widget.type === 'kpi' && renderKPI()}
      {widget.type === 'table' && renderTable()}

      {/* Drill-down hint */}
      {widget.type === 'chart' && (
        <p className="text-xs text-center text-gray-400 mt-2">Click on chart elements to filter</p>
      )}
    </div>
  );
};
