import React from 'react';
import { Filter } from '../types';

interface FilterBarProps {
  filters: Filter[];
  onFilterChange: (filterId: string, value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4 flex-wrap">
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">{filter.label}</label>
          <select
            value={filter.selected}
            onChange={(e) => onFilterChange(filter.id, e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
