import React, { useRef, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, ScatterChart, Scatter, Treemap
} from 'recharts';
import { TrendingUp, TrendingDown, Trash2, Edit2, Copy, Download, Filter, X, ArrowUpDown, Link, Unlink } from 'lucide-react';
import { Widget, SortConfig } from '../types';
import { useData } from '../context/DataContext';
import html2canvas from 'html2canvas';

const COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0', '#ff6b6b', '#4ecdc4', '#f39c12', '#9b59b6', '#1abc9c'];

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
  const { getMultiMeasureData, getVarianceData, applyWidgetFilter, widgetFilters, clearWidgetFilters, linkedAnalysisEnabled, getDrillDownData } = useData();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [drillDownValue, setDrillDownValue] = useState<string | null>(null);
  
  const dimension = widget.dimensions[0];
  const measureFields = widget.measures.map(m => m.field);
  
  if (!dimension || widget.measures.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">Widget configuration incomplete</p>
      </div>
    );
  }

  let data: DataItem[] = drillDownValue 
    ? getDrillDownData(dimension.field, measureFields[0], drillDownValue)
    : getMultiMeasureData(dimension.field, measureFields);

  // Get variance data if needed
  const varianceData = widget.variance?.enabled 
    ? getVarianceData(dimension.field, measureFields[0], widget.variance.compareMeasure || 'plan_revenue')
    : null;

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
    if (linkedAnalysisEnabled) {
      applyWidgetFilter({
        dimensionId: dimension.id,
        field: dimension.field,
        selectedValues: [value]
      });
    }
  };

  const handleChartClick = (chartData: any) => {
    if (chartData && chartData.activePayload && chartData.activePayload[0]) {
      handleDrillDown(chartData.activePayload[0].payload.name);
    }
  };

  const handleDrillThrough = (value: string) => {
    setDrillDownValue(drillDownValue === value ? null : value);
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

  // Waterfall chart data transformation
  const getWaterfallData = () => {
    let cumulative = 0;
    return data.map((item) => {
      const value = Number(item[measureFields[0]]) || 0;
      const start = cumulative;
      cumulative += value;
      return {
        name: item.name,
        value: value,
        start: start,
        end: cumulative,
        fill: value >= 0 ? '#36a41d' : '#e74c3c'
      };
    });
  };

  // Pareto chart data transformation
  const getParetoData = () => {
    const sorted = [...data].sort((a, b) => 
      (Number(b[measureFields[0]]) || 0) - (Number(a[measureFields[0]]) || 0)
    );
    const total = sorted.reduce((sum, item) => sum + (Number(item[measureFields[0]]) || 0), 0);
    let cumulative = 0;
    return sorted.map(item => {
      const value = Number(item[measureFields[0]]) || 0;
      cumulative += value;
      return {
        name: item.name,
        value: value,
        cumulative: (cumulative / total) * 100
      };
    });
  };

  // Gauge chart calculation
  const getGaugeValue = () => {
    const total = data.reduce((sum, item) => sum + (Number(item[measureFields[0]]) || 0), 0);
    const target = data.reduce((sum, item) => sum + (Number(item['plan_revenue']) || total * 0.9), 0);
    return { actual: total, target, percentage: (total / target) * 100 };
  };

  const renderChart = () => {
    switch (widget.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} onClick={handleChartClick}>
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
            <AreaChart data={data} onClick={handleChartClick}>
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
            <BarChart data={data} onClick={handleChartClick}>
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
            <BarChart data={data} onClick={handleChartClick}>
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

      case 'waterfall':
        const waterfallData = getWaterfallData();
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Bar dataKey="start" stackId="waterfall" fill="transparent" />
              <Bar dataKey="value" stackId="waterfall" fill="#0a6ed1">
                {waterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pareto':
        const paretoData = getParetoData();
        return (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="value" name="Value" fill="#0a6ed1" />
              <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative %" stroke="#e74c3c" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'gauge':
        const gaugeData = getGaugeValue();
        const gaugeColor = gaugeData.percentage >= 100 ? '#36a41d' : gaugeData.percentage >= 80 ? '#f39c12' : '#e74c3c';
        return (
          <div className="flex flex-col items-center justify-center h-[280px]">
            <div className="relative w-48 h-24 overflow-hidden">
              <div className="absolute w-48 h-48 rounded-full border-[16px] border-gray-200 dark:border-gray-700" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
              <div 
                className="absolute w-48 h-48 rounded-full border-[16px] transition-all duration-500"
                style={{ 
                  borderColor: gaugeColor,
                  clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                  transform: `rotate(${Math.min(gaugeData.percentage, 100) * 1.8 - 180}deg)`,
                  transformOrigin: 'center center'
                }} 
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-3xl font-bold" style={{ color: gaugeColor }}>
                {gaugeData.percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${(gaugeData.actual / 1000000).toFixed(2)}M / ${(gaugeData.target / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
        );

      case 'heatmap':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2 px-3 text-left font-medium text-gray-700 dark:text-gray-300">{dimension.name}</th>
                  {widget.measures.map(m => (
                    <th key={m.id} className="py-2 px-3 text-center font-medium text-gray-700 dark:text-gray-300">{m.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => {
                  const maxValue = Math.max(...data.flatMap(r => widget.measures.map(m => Number(r[m.field]) || 0)));
                  return (
                    <tr key={idx} className="border-b dark:border-gray-700">
                      <td className="py-2 px-3 dark:text-gray-300">{row.name}</td>
                      {widget.measures.map(m => {
                        const value = Number(row[m.field]) || 0;
                        const intensity = value / maxValue;
                        return (
                          <td 
                            key={m.id} 
                            className="py-2 px-3 text-center text-white font-medium"
                            style={{ backgroundColor: `rgba(10, 110, 209, ${0.2 + intensity * 0.8})` }}
                          >
                            ${(value / 1000).toFixed(0)}K
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case 'scatter':
        if (widget.measures.length < 2) {
          return <p className="text-gray-500 p-4">Scatter chart requires at least 2 measures</p>;
        }
        const scatterData = data.map(item => ({
          name: item.name,
          x: Number(item[widget.measures[0].field]) || 0,
          y: Number(item[widget.measures[1].field]) || 0,
          z: widget.measures[2] ? Number(item[widget.measures[2].field]) || 100 : 100
        }));
        return (
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name={widget.measures[0].name} type="number" />
              <YAxis dataKey="y" name={widget.measures[1].name} type="number" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Legend />
              <Scatter name="Data Points" data={scatterData} fill="#0a6ed1">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        const treemapData = data.map(item => ({
          name: item.name,
          size: Number(item[measureFields[0]]) || 0
        }));
        return (
          <ResponsiveContainer width="100%" height={280}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#0a6ed1"
            >
              {treemapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
            </Treemap>
          </ResponsiveContainer>
        );
      
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} layout="vertical" onClick={handleChartClick}>
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
      return { name: measure.name, value: total, color: measure.color, field: measure.field };
    });

    // Calculate variance if enabled
    const variance = varianceData ? {
      absolute: varianceData.reduce((sum: number, item: any) => sum + item.variance, 0),
      percent: varianceData.reduce((sum: number, item: any) => sum + item.actual, 0) / 
               varianceData.reduce((sum: number, item: any) => sum + item.plan, 0) * 100 - 100
    } : null;

    return (
      <div className="grid grid-cols-1 gap-4 py-4">
        {totals.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.name}</p>
            <p className="text-3xl font-bold" style={{ color: item.color || COLORS[index % COLORS.length] }}>
              ${(item.value / 1000000).toFixed(2)}M
            </p>
            {variance && index === 0 && (
              <div className={`flex items-center justify-center gap-1 mt-2 ${variance.percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {variance.percent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span className="text-xs font-medium">
                  {variance.percent >= 0 ? '+' : ''}{variance.percent.toFixed(1)}% vs Plan
                </span>
              </div>
            )}
            {!variance && (
              <div className="flex items-center justify-center gap-1 mt-2 text-green-500">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">+8.5%</span>
              </div>
            )}
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
              {varianceData && (
                <>
                  <th className="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Variance</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Var %</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(varianceData || data).map((row: any, index: number) => (
              <tr 
                key={row.name + index} 
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleDrillDown(row.name)}
                onDoubleClick={() => handleDrillThrough(row.name)}
              >
                <td className="py-2 px-3 dark:text-gray-300">{row.name}</td>
                {widget.measures.map((measure) => (
                  <td key={measure.id} className="text-right py-2 px-3 dark:text-gray-300">
                    ${(Number(varianceData ? row.actual : row[measure.field]) / 1000).toFixed(0)}K
                  </td>
                ))}
                {varianceData && (
                  <>
                    <td className={`text-right py-2 px-3 font-medium ${row.variance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {row.variance >= 0 ? '+' : ''}${(row.variance / 1000).toFixed(0)}K
                    </td>
                    <td className={`text-right py-2 px-3 font-medium ${row.variancePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {row.variancePercent >= 0 ? '+' : ''}{row.variancePercent.toFixed(1)}%
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 dark:border-gray-600 font-medium bg-gray-50 dark:bg-gray-700">
              <td className="py-2 px-3 dark:text-gray-300">Total</td>
              {widget.measures.map((measure) => {
                const total = (varianceData || data).reduce((sum: number, item: any) => 
                  sum + (Number(varianceData ? item.actual : item[measure.field]) || 0), 0);
                return (
                  <td key={measure.id} className="text-right py-2 px-3 dark:text-gray-300">
                    ${(total / 1000).toFixed(0)}K
                  </td>
                );
              })}
              {varianceData && (
                <>
                  <td className={`text-right py-2 px-3 font-medium ${
                    varianceData.reduce((s: number, i: any) => s + i.variance, 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {varianceData.reduce((s: number, i: any) => s + i.variance, 0) >= 0 ? '+' : ''}
                    ${(varianceData.reduce((s: number, i: any) => s + i.variance, 0) / 1000).toFixed(0)}K
                  </td>
                  <td className="text-right py-2 px-3 dark:text-gray-300">-</td>
                </>
              )}
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
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold text-sap-dark dark:text-white">{widget.title}</h3>
          {drillDownValue && (
            <button
              onClick={() => setDrillDownValue(null)}
              className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full hover:bg-purple-200"
            >
              Drill: {drillDownValue}
              <X size={12} />
            </button>
          )}
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
          {linkedAnalysisEnabled && (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <Link size={12} />
              Linked
            </span>
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

      {/* Interaction hints */}
      {widget.type === 'chart' && (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-2">
          <span>Click to filter</span>
          <span>•</span>
          <span>Double-click to drill</span>
        </div>
      )}
    </div>
  );
};
