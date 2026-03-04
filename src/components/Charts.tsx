import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChartData } from '../types';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0'];

interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  title?: string;
}

export const Chart: React.FC<ChartProps> = ({ data, type, title }) => {
  const { theme } = useTheme();
  const textColor = theme.mode === 'dark' ? '#e5e7eb' : '#374151';
  const gridColor = theme.mode === 'dark' ? '#374151' : '#e5e7eb';

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.mode === 'dark' ? '#1f2937' : '#fff',
                borderColor: theme.mode === 'dark' ? '#374151' : '#e5e7eb',
                color: textColor
              }}
            />
            <Legend />
            <Bar dataKey="value" fill={COLORS[0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.mode === 'dark' ? '#1f2937' : '#fff',
                borderColor: theme.mode === 'dark' ? '#374151' : '#e5e7eb',
                color: textColor
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.mode === 'dark' ? '#1f2937' : '#fff',
                borderColor: theme.mode === 'dark' ? '#374151' : '#e5e7eb',
                color: textColor
              }}
            />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {title && <h3 className="text-lg font-semibold text-sap-dark dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        {renderChart() || <div />}
      </ResponsiveContainer>
    </div>
  );
};
