import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Trash2, Edit2 } from 'lucide-react';
import { Widget } from '../types';
import { useData } from '../context/DataContext';

const COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0', '#ff6b6b', '#4ecdc4'];

interface WidgetRendererProps {
  widget: Widget;
  onDelete?: () => void;
  onEdit?: () => void;
}

interface DataItem {
  name: string;
  [key: string]: string | number;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, onDelete, onEdit }) => {
  const { getMultiMeasureData } = useData();
  
  const dimension = widget.dimensions[0];
  const measureFields = widget.measures.map(m => m.field);
  
  if (!dimension || widget.measures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Widget configuration incomplete</p>
      </div>
    );
  }

  const data: DataItem[] = getMultiMeasureData(dimension.field, measureFields);

  const renderChart = () => {
    switch (widget.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
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
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
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
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
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
            <BarChart data={data}>
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
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'stacked':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
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
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} layout="vertical">
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
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">{item.name}</p>
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
            <tr className="border-b bg-gray-50">
              <th className="text-left py-2 px-3 font-medium text-gray-700">{dimension.name}</th>
              {widget.measures.map((measure) => (
                <th key={measure.id} className="text-right py-2 px-3 font-medium text-gray-700">
                  {measure.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.name + index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{row.name}</td>
                {widget.measures.map((measure) => (
                  <td key={measure.id} className="text-right py-2 px-3">
                    ${(Number(row[measure.field]) / 1000).toFixed(0)}K
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 font-medium bg-gray-50">
              <td className="py-2 px-3">Total</td>
              {widget.measures.map((measure) => {
                const total = data.reduce((sum, item) => sum + (Number(item[measure.field]) || 0), 0);
                return (
                  <td key={measure.id} className="text-right py-2 px-3">
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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sap-dark">{widget.title}</h3>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-sap-blue"
              title="Edit widget"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
              title="Delete widget"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      {widget.type === 'chart' && renderChart()}
      {widget.type === 'kpi' && renderKPI()}
      {widget.type === 'table' && renderTable()}
    </div>
  );
};
