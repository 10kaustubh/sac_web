import React from 'react';
import { Filter as FilterIcon, RotateCcw } from 'lucide-react';
import { Filter } from '../types';

interface FilterBarProps {
  filters: Filter[];
  onFilterChange: (filterId: string, value: string) => void;
  onResetAll: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onResetAll }) => {
  const hasActiveFilters = filters.some(f => f.selected !== 'All');
  
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <FilterIcon size={18} />
        <span className="font-medium">Filters</span>
      </div>
      
      {filters.map(filter => (
        <div key={filter.id} className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">{filter.label}:</label>
          <select
            value={filter.selected}
            onChange={(e) => onFilterChange(filter.id, e.target.value)}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
          >
            {filter.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
      
      {hasActiveFilters && (
        <button onClick={onResetAll} className="flex items-center gap-1 text-sm text-sap-blue hover:underline">
          <RotateCcw size={14} />
          Reset All
        </button>
      )}
    </div>
  );
};
