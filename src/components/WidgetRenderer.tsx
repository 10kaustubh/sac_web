import React, { useRef, useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, ScatterChart, Scatter, Treemap
} from 'recharts';
import { TrendingUp, TrendingDown, Trash2, Edit2, Copy, Download, Filter, X, ArrowUpDown, Link, Layers, ChevronRight, ChevronUp, ZoomIn, FileText, FilePlus, Files } from 'lucide-react';
import { Widget, SortConfig } from '../types';
import { useData } from '../context/DataContext';
import html2canvas from 'html2canvas';

const COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0', '#ff6b6b', '#4ecdc4', '#f39c12', '#9b59b6', '#1abc9c'];

interface WidgetRendererProps {
  widget: Widget;
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onCopyToPage?: (pageId: string) => void;
  onCopyToNewPage?: () => void;
  availablePages?: { id: string; title: string }[];
  currentPageId?: string;
}

interface DataItem {
  name: string;
  [key: string]: string | number;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ 
  widget, 
  onDelete, 
  onEdit, 
  onDuplicate,
  onCopyToPage,
  onCopyToNewPage,
  availablePages = [],
  currentPageId
}) => {
  const { getMultiMeasureData, getVarianceData, applyWidgetFilter, widgetFilters, clearWidgetFilters, linkedAnalysisEnabled, getDrillDownData } = useData();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [drillDownLevel, setDrillDownLevel] = useState(0);
  const [drillDownPath, setDrillDownPath] = useState<{ dimension: string; value: string }[]>([]);
  const [localFilterValue, setLocalFilterValue] = useState<string | null>(null);
  const [selectedChartItem, setSelectedChartItem] = useState<string | null>(null);
  
  const allDimensions = widget.dimensions;
  const measureFields = useMemo(() => widget.measures.map(m => m.field), [widget.measures]);
  
  const currentDimension = useMemo(() => {
    return allDimensions[Math.min(drillDownLevel, allDimensions.length - 1)] || null;
  }, [allDimensions, drillDownLevel]);

  const canDrill = allDimensions.length > 1 && drillDownLevel < allDimensions.length - 1;

  const rawData: DataItem[] = useMemo(() => {
    if (!currentDimension) return [];
    if (drillDownPath.length > 0 && drillDownLevel > 0) {
      const lastDrill = drillDownPath[drillDownPath.length - 1];
      return getDrillDownData(lastDrill.dimension, measureFields[0], lastDrill.value);
    }
    return getMultiMeasureData(currentDimension.field, measureFields);
  }, [drillDownPath, drillDownLevel, currentDimension, measureFields, getDrillDownData, getMultiMeasureData]);

  const sortedRawData = useMemo(() => {
    if (sortConfig) {
      return [...rawData].sort((a, b) => {
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
    return rawData;
  }, [rawData, sortConfig]);

  const displayData: DataItem[] = useMemo(() => {
    if (!linkedAnalysisEnabled && localFilterValue !== null) {
      return sortedRawData.filter(item => String(item.name) === String(localFilterValue));
    }
    return sortedRawData;
  }, [sortedRawData, linkedAnalysisEnabled, localFilterValue]);

  const varianceData = useMemo(() => {
    if (!currentDimension || !widget.variance?.enabled) return null;
    let data = getVarianceData(currentDimension.field, measureFields[0], widget.variance.compareMeasure || 'plan_revenue');
    if (!linkedAnalysisEnabled && localFilterValue !== null) {
      data = data.filter((item: any) => String(item.name) === String(localFilterValue));
    }
    return data;
  }, [currentDimension, widget.variance, measureFields, getVarianceData, linkedAnalysisEnabled, localFilterValue]);

  if (!currentDimension || widget.measures.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">Widget configuration incomplete</p>
      </div>
    );
  }

  const handleFilter = (value: string) => {
    if (linkedAnalysisEnabled) {
      applyWidgetFilter({
        dimensionId: currentDimension.id,
        field: currentDimension.field,
        selectedValues: [value]
      });
    } else {
      setLocalFilterValue(prev => prev === value ? null : value);
    }
    setSelectedChartItem(null);
  };

  const clearLocalFilter = () => {
    setLocalFilterValue(null);
  };

  const handleDrillDown = (value: string) => {
    if (canDrill) {
      setDrillDownPath(prev => [...prev, { dimension: currentDimension.field, value }]);
      setDrillDownLevel(prev => prev + 1);
      setLocalFilterValue(null);
      setSelectedChartItem(null);
    }
  };

  const handleDrillUp = () => {
    if (drillDownLevel > 0) {
      setDrillDownPath(prev => prev.slice(0, -1));
      setDrillDownLevel(prev => prev - 1);
      setLocalFilterValue(null);
      setSelectedChartItem(null);
    }
  };

  const handleResetDrill = () => {
    setDrillDownPath([]);
    setDrillDownLevel(0);
    setLocalFilterValue(null);
    setSelectedChartItem(null);
  };

  const handleExport = async (format: 'png' | 'jpg') => {
    if (widgetRef.current) {
      try {
        const canvas = await html2canvas(widgetRef.current, { backgroundColor: '#ffffff', scale: 2 });
        const link = document.createElement('a');
        link.download = `${widget.title.replace(/\s+/g, '_')}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
    setShowExportMenu(false);
  };

  const handleSort = (field: string) => {
    setSortConfig(prev => {
      if (prev?.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'desc' };
    });
  };

  const handleCopyToSamePage = () => {
    if (onDuplicate) onDuplicate();
    setShowCopyMenu(false);
  };

  const handleCopyToPage = (pageId: string) => {
    if (onCopyToPage) onCopyToPage(pageId);
    setShowCopyMenu(false);
  };

  const handleCopyToNewPage = () => {
    if (onCopyToNewPage) onCopyToNewPage();
    setShowCopyMenu(false);
  };

  // Chart click handler
  const onChartElementClick = (name: string) => {
    setSelectedChartItem(prev => prev === name ? null : name);
  };

  const isLinkedFiltered = widgetFilters.some(f => f.field === currentDimension.field);
  const otherPages = availablePages.filter(p => p.id !== currentPageId);

  const getWaterfallData = () => {
    let cumulative = 0;
    return displayData.map((item) => {
      const value = Number(item[measureFields[0]]) || 0;
      const start = cumulative;
      cumulative += value;
      return { name: item.name, value, start, end: cumulative, fill: value >= 0 ? '#36a41d' : '#e74c3c' };
    });
  };

  const getParetoData = () => {
    const sorted = [...displayData].sort((a, b) => (Number(b[measureFields[0]]) || 0) - (Number(a[measureFields[0]]) || 0));
    const total = sorted.reduce((sum, item) => sum + (Number(item[measureFields[0]]) || 0), 0);
    let cumulative = 0;
    return sorted.map(item => {
      const value = Number(item[measureFields[0]]) || 0;
      cumulative += value;
      return { name: item.name, value, cumulative: (cumulative / total) * 100 };
    });
  };

  const getGaugeValue = () => {
    const total = displayData.reduce((sum, item) => sum + (Number(item[measureFields[0]]) || 0), 0);
    const target = displayData.reduce((sum, item) => sum + (Number(item['plan_revenue']) || total * 0.9), 0);
    return { actual: total, target, percentage: (total / target) * 100 };
  };

  // Chart action bar - shows filter/drill buttons for selected item
  const ChartActionBar = () => {
    if (!selectedChartItem) return null;
    
    return (
      <div className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Selected: <strong>{selectedChartItem}</strong>
        </span>
        <button
          onClick={() => handleFilter(selectedChartItem)}
          className="flex items-center gap-1 px-3 py-1 bg-sap-blue text-white text-xs rounded hover:bg-blue-700"
        >
          <Filter size={12} />
          Filter
        </button>
        {canDrill && (
          <button
            onClick={() => handleDrillDown(selectedChartItem)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
          >
            <ZoomIn size={12} />
            Drill Down
          </button>
        )}
        <button
          onClick={() => setSelectedChartItem(null)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
        >
          <X size={14} />
        </button>
      </div>
    );
  };

  // Data item selector dropdown for charts
  const ChartDataSelector = () => {
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Select item:</span>
        <select
          value={selectedChartItem || ''}
          onChange={(e) => setSelectedChartItem(e.target.value || null)}
          className="text-xs border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sap-blue"
        >
          <option value="">-- Select --</option>
          {sortedRawData.map((item, idx) => (
            <option key={idx} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderChart = () => {
    switch (widget.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={displayData}>
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
                  dot={{ cursor: 'pointer', r: 5 }}
                  activeDot={{ 
                    r: 8, 
                    cursor: 'pointer',
                    onClick: (e: any) => {
                      if (e && e.payload && e.payload.name) {
                        onChartElementClick(e.payload.name);
                      }
                    }
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={displayData}>
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
                  cursor="pointer"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
      case 'donut':
        const pieData = displayData.map(item => ({
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
                cursor="pointer"
                onClick={(data) => {
                  if (data && data.name) {
                    onChartElementClick(data.name);
                  }
                }}
              >
                {pieData.map((item, index) => (
                  <Cell 
                    key={item.name + index} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke={selectedChartItem === item.name || localFilterValue === item.name ? '#000' : 'none'}
                    strokeWidth={selectedChartItem === item.name || localFilterValue === item.name ? 3 : 0}
                  />
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
            <BarChart data={displayData}>
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
                  onClick={(data) => {
                    if (data && data.name) {
                      onChartElementClick(data.name);
                    }
                  }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'stacked':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={displayData}>
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
                  onClick={(data) => {
                    if (data && data.name) {
                      onChartElementClick(data.name);
                    }
                  }}
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
              <Bar 
                dataKey="value" 
                stackId="waterfall" 
                cursor="pointer"
                onClick={(data) => {
                  if (data && data.name) {
                    onChartElementClick(data.name);
                  }
                }}
              >
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
              <Bar 
                yAxisId="left" 
                dataKey="value" 
                name="Value" 
                fill="#0a6ed1" 
                cursor="pointer"
                onClick={(data) => {
                  if (data && data.name) {
                    onChartElementClick(data.name);
                  }
                }}
              />
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
              <p className="text-3xl font-bold" style={{ color: gaugeColor }}>{gaugeData.percentage.toFixed(1)}%</p>
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
                  <th className="py-2 px-3 text-left font-medium text-gray-700 dark:text-gray-300">{currentDimension.name}</th>
                  {widget.measures.map(m => (
                    <th key={m.id} className="py-2 px-3 text-center font-medium text-gray-700 dark:text-gray-300">{m.name}</th>
                  ))}
                  <th className="py-2 px-3 w-20 text-center font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, idx) => {
                  const maxValue = Math.max(...rawData.flatMap(r => widget.measures.map(m => Number(r[m.field]) || 0)));
                  const isFiltered = localFilterValue === row.name;
                  return (
                    <tr key={idx} className={`border-b dark:border-gray-700 ${isFiltered ? 'ring-2 ring-sap-blue' : ''}`}>
                      <td className="py-2 px-3 dark:text-gray-300">{row.name}</td>
                      {widget.measures.map(m => {
                        const value = Number(row[m.field]) || 0;
                        const intensity = maxValue > 0 ? value / maxValue : 0;
                        return (
                          <td key={m.id} className="py-2 px-3 text-center text-white font-medium"
                              style={{ backgroundColor: `rgba(10, 110, 209, ${0.2 + intensity * 0.8})` }}>
                            ${(value / 1000).toFixed(0)}K
                          </td>
                        );
                      })}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleFilter(row.name)} 
                            className={`p-1 rounded ${isFiltered ? 'bg-sap-blue text-white' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sap-blue'}`} 
                            title="Filter">
                            <Filter size={14} />
                          </button>
                          {canDrill && (
                            <button onClick={() => handleDrillDown(row.name)} className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded text-purple-500" title="Drill down">
                              <ZoomIn size={14} />
                            </button>
                          )}
                        </div>
                      </td>
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
        const scatterData = displayData.map(item => ({
          name: item.name,
          x: Number(item[widget.measures[0].field]) || 0,
          y: Number(item[widget.measures[1].field]) || 0,
        }));
        return (
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name={widget.measures[0].name} type="number" />
              <YAxis dataKey="y" name={widget.measures[1].name} type="number" />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name="Data Points" 
                data={scatterData} 
                fill="#0a6ed1" 
                cursor="pointer"
                onClick={(data) => {
                  if (data && data.name) {
                    onChartElementClick(data.name);
                  }
                }}
              >
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={selectedChartItem === entry.name ? '#000' : 'none'}
                    strokeWidth={selectedChartItem === entry.name ? 2 : 0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        const treemapData = displayData.map(item => ({
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
              onClick={(data: any) => {
                if (data && data.name) {
                  onChartElementClick(data.name);
                }
              }}
            >
              {treemapData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke={selectedChartItem === entry.name ? '#000' : '#fff'}
                  strokeWidth={selectedChartItem === entry.name ? 3 : 1}
                />
              ))}
              <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
            </Treemap>
          </ResponsiveContainer>
        );
      
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={displayData} layout="vertical">
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
                  onClick={(data) => {
                    if (data && data.name) {
                      onChartElementClick(data.name);
                    }
                  }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderKPI = () => {
    const totals = widget.measures.map(measure => {
      const total = displayData.reduce((sum, item) => sum + (Number(item[measure.field]) || 0), 0);
      return { name: measure.name, value: total, color: measure.color };
    });

    const variance = varianceData ? {
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
            {variance && index === 0 ? (
              <div className={`flex items-center justify-center gap-1 mt-2 ${variance.percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {variance.percent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span className="text-xs font-medium">{variance.percent >= 0 ? '+' : ''}{variance.percent.toFixed(1)}% vs Plan</span>
              </div>
            ) : (
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
    const tableData = varianceData ? varianceData : displayData;
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  {currentDimension.name}
                  <ArrowUpDown size={14} className={sortConfig?.field === 'name' ? 'text-sap-blue' : 'text-gray-400'} />
                </div>
              </th>
              {widget.measures.map((measure) => (
                <th key={measure.id} 
                    className="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort(measure.field)}>
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
              <th className="text-center py-2 px-3 w-20 font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row: any, index: number) => {
              const isFiltered = localFilterValue === row.name;
              return (
                <tr key={row.name + index} 
                    className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${isFiltered ? 'bg-sap-blue/20 ring-1 ring-sap-blue' : ''}`}>
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
                  <td className="text-center py-2 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => handleFilter(row.name)} 
                        className={`p-1 rounded ${isFiltered ? 'bg-sap-blue text-white' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sap-blue'}`}
                        title={isFiltered ? "Clear filter" : "Filter"}
                      >
                        <Filter size={14} />
                      </button>
                      {canDrill && (
                        <button 
                          onClick={() => handleDrillDown(row.name)} 
                          className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded text-purple-500" 
                          title="Drill down"
                        >
                          <ZoomIn size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 dark:border-gray-600 font-medium bg-gray-50 dark:bg-gray-700">
              <td className="py-2 px-3 dark:text-gray-300">Total</td>
              {widget.measures.map((measure) => {
                const total = tableData.reduce((sum: number, item: any) => sum + (Number(varianceData ? item.actual : item[measure.field]) || 0), 0);
                return <td key={measure.id} className="text-right py-2 px-3 dark:text-gray-300">${(total / 1000).toFixed(0)}K</td>;
              })}
              {varianceData && (
                <>
                  <td className={`text-right py-2 px-3 font-medium ${tableData.reduce((s: number, i: any) => s + i.variance, 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {tableData.reduce((s: number, i: any) => s + i.variance, 0) >= 0 ? '+' : ''}
                    ${(tableData.reduce((s: number, i: any) => s + i.variance, 0) / 1000).toFixed(0)}K
                  </td>
                  <td className="text-right py-2 px-3 dark:text-gray-300">-</td>
                </>
              )}
              <td></td>
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
          
          <div className="flex items-center gap-1">
            {allDimensions.map((dim, idx) => (
              <span key={dim.id} className={`text-xs px-2 py-0.5 rounded ${
                idx === drillDownLevel ? 'bg-sap-blue text-white' 
                  : idx < drillDownLevel ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {dim.name}
              </span>
            ))}
          </div>

          {drillDownPath.length > 0 && (
            <button onClick={handleResetDrill}
              className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full hover:bg-purple-200">
              <Layers size={12} />
              {drillDownPath.map((p, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight size={10} />}
                  {p.value}
                </React.Fragment>
              ))}
              <X size={12} />
            </button>
          )}

          {!linkedAnalysisEnabled && localFilterValue && (
            <button onClick={clearLocalFilter}
              className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full hover:bg-orange-200">
              <Filter size={12} />
              {localFilterValue}
              <X size={12} />
            </button>
          )}

          {isLinkedFiltered && linkedAnalysisEnabled && (
            <button onClick={clearWidgetFilters}
              className="flex items-center gap-1 text-xs bg-sap-blue/10 text-sap-blue px-2 py-1 rounded-full hover:bg-sap-blue/20">
              <Filter size={12} />
              Linked Filter
              <X size={12} />
            </button>
          )}
          
          {linkedAnalysisEnabled ? (
            <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
              <Link size={10} />
              Linked
            </span>
          ) : (
            <span className="text-xs text-orange-600 flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
              Local
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {drillDownLevel > 0 && (
            <button onClick={handleDrillUp} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-purple-500" title="Drill up">
              <ChevronUp size={16} />
            </button>
          )}
          
          {onEdit && (
            <button onClick={onEdit} className="p-1.5 hover:bg-blue-50 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-sap-blue" title="Edit widget">
              <Edit2 size={16} />
            </button>
          )}

          {canDrill && (
            <span className="p-1.5 rounded text-purple-500" title="Drill available">
              <ZoomIn size={16} />
            </span>
          )}
          
          <div className="relative">
            <button onClick={() => setShowCopyMenu(!showCopyMenu)}
              className="p-1.5 hover:bg-green-50 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-green-500" title="Copy widget">
              <Copy size={16} />
            </button>
            {showCopyMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCopyMenu(false)} />
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[200px]">
                  <button onClick={handleCopyToSamePage}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 dark:text-white">
                    <Files size={14} /> Duplicate on this page
                  </button>
                  {otherPages.length > 0 && (
                    <>
                      <div className="border-t dark:border-gray-600 my-1" />
                      <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 uppercase">Copy to existing page</div>
                      {otherPages.map(page => (
                        <button key={page.id} onClick={() => handleCopyToPage(page.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 dark:text-white">
                          <FileText size={14} /> {page.title}
                        </button>
                      ))}
                    </>
                  )}
                  <div className="border-t dark:border-gray-600 my-1" />
                  <button onClick={handleCopyToNewPage}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 text-sap-blue">
                    <FilePlus size={14} /> Copy to new page
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600" title="Export">
              <Download size={16} />
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[140px]">
                  <button onClick={() => handleExport('png')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white">
                    Export as PNG
                  </button>
                  <button onClick={() => handleExport('jpg')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white">
                    Export as JPG
                  </button>
                </div>
              </>
            )}
          </div>

          {onDelete && (
            <button onClick={onDelete} className="p-1.5 hover:bg-red-50 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-500" title="Delete widget">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chart Data Selector */}
      {widget.type === 'chart' && <ChartDataSelector />}

      {/* Content */}
      {widget.type === 'chart' && renderChart()}
      {widget.type === 'kpi' && renderKPI()}
      {widget.type === 'table' && renderTable()}

      {/* Chart Action Bar */}
      {widget.type === 'chart' && <ChartActionBar />}

      {/* Hints */}
      <div className="flex items-center justify-center text-xs text-gray-400 mt-2">
        {widget.type === 'chart' && <span>Select from dropdown or click chart element, then use action buttons</span>}
        {widget.type === 'table' && <span>Use action buttons to filter{canDrill ? '/drill' : ''}</span>}
      </div>
    </div>
  );
};
