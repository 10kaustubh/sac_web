import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPI } from '../types';

interface KPICardProps {
  kpi: KPI;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  const trendColor = kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">{kpi.title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-sap-dark dark:text-white">
          {formatValue(kpi.value, kpi.unit)}
        </span>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon size={16} />
          <span className="text-sm font-medium">{Math.abs(kpi.change)}%</span>
        </div>
      </div>
    </div>
  );
};
