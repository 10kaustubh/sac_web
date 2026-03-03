import React from 'react';
import { Filter } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  filters: Filter[];
  onFilterChange: (filterId: string, value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4 flex-wrap items-center">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <SlidersHorizontal size={18} />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">{filter.label}</label>
          <select
            value={filter.selected}
            onChange={(e) => onFilterChange(filter.id, e.target.value)}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      {filters.some(f => f.selected !== 'All') && (
        <button
          onClick={() => filters.forEach(f => onFilterChange(f.id, 'All'))}
          className="ml-auto text-sm text-sap-blue hover:underline"
        >
          Reset All
        </button>
      )}
    </div>
  );
};
