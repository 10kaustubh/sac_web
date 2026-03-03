import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChartData } from '../types';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0'];

interface ChartProps {
  data: ChartData[];
  title: string;
}

export const RevenueChart: React.FC<ChartProps> = ({ data, title }) => {
  const { theme } = useTheme();
  const textColor = theme.mode === 'dark' ? '#9CA3AF' : '#374151';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-sap-dark dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.mode === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis dataKey="name" tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip 
            formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`}
            contentStyle={{ 
              backgroundColor: theme.mode === 'dark' ? '#1F2937' : '#FFFFFF',
              border: `1px solid ${theme.mode === 'dark' ? '#374151' : '#E5E7EB'}`,
              borderRadius: '8px'
            }}
            labelStyle={{ color: textColor }}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0a6ed1" strokeWidth={2} />
          <Line type="monotone" dataKey="costs" name="Costs" stroke="#df6e0c" strokeWidth={2} />
          <Line type="monotone" dataKey="profit" name="Profit" stroke="#36a41d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RegionPieChart: React.FC<ChartProps> = ({ data, title }) => {
  const { theme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-sap-dark dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme.mode === 'dark' ? '#1F2937' : '#FFFFFF',
              border: `1px solid ${theme.mode === 'dark' ? '#374151' : '#E5E7EB'}`,
              borderRadius: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProductBarChart: React.FC<ChartProps> = ({ data, title }) => {
  const { theme } = useTheme();
  const textColor = theme.mode === 'dark' ? '#9CA3AF' : '#374151';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-sap-dark dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={theme.mode === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis type="number" tick={{ fill: textColor }} />
          <YAxis dataKey="name" type="category" width={80} tick={{ fill: textColor }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme.mode === 'dark' ? '#1F2937' : '#FFFFFF',
              border: `1px solid ${theme.mode === 'dark' ? '#374151' : '#E5E7EB'}`,
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="sales" name="Actual Sales" fill="#0a6ed1" />
          <Bar dataKey="target" name="Target" fill="#df6e0c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
