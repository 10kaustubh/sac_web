import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChartData } from '../types';

const COLORS = ['#0a6ed1', '#df6e0c', '#36a41d', '#a100c2', '#00b4f0'];

interface ChartProps {
  data: ChartData[];
  title: string;
}

export const RevenueChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-sap-dark mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#0a6ed1" strokeWidth={2} />
        <Line type="monotone" dataKey="costs" stroke="#df6e0c" strokeWidth={2} />
        <Line type="monotone" dataKey="profit" stroke="#36a41d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const RegionPieChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-sap-dark mb-4">{title}</h3>
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
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const ProductBarChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-sap-dark mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={80} />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#0a6ed1" name="Actual Sales" />
        <Bar dataKey="target" fill="#df6e0c" name="Target" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
