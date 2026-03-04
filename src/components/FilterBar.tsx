import React, { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, RotateCcw, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  options: string[];
  selected: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: string) => void;
  onResetAll?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onResetAll }) => {
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  const activeFiltersCount = filters.filter(f => f.selected !== 'All').length;

  const handleResetAll = () => {
    filters.forEach(f => onFilterChange(f.id, 'All'));
    if (onResetAll) {
      onResetAll();
    }
  };

  const handleFilterSelect = (filterId: string, value: string) => {
    onFilterChange(filterId, value);
    setExpandedFilter(null);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Filter Icon and Label */}
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <SlidersHorizontal size={18} />
        <span className="text-sm font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 bg-sap-blue text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </div>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.filter(f => f.selected !== 'All').map(filter => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-sap-blue/10 text-sap-blue rounded-full text-sm"
            >
              <span className="text-gray-500 dark:text-gray-400">{filter.label}:</span>
              <span className="font-medium">{filter.selected}</span>
              <button
                onClick={() => onFilterChange(filter.id, 'All')}
                className="ml-1 hover:bg-sap-blue/20 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <button
              onClick={() => setExpandedFilter(expandedFilter === filter.id ? null : filter.id)}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                filter.selected !== 'All'
                  ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/20 text-sap-blue'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{filter.label}</span>
              <ChevronDown size={14} className={`transition-transform ${expandedFilter === filter.id ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {expandedFilter === filter.id && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setExpandedFilter(null)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-20 min-w-[180px] max-h-64 overflow-y-auto">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterSelect(filter.id, option)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-between ${
                        filter.selected === option ? 'bg-sap-blue/10 text-sap-blue' : 'dark:text-white'
                      }`}
                    >
                      {option}
                      {filter.selected === option && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            <RotateCcw size={14} />
            Reset All
          </button>
        </>
      )}
    </div>
  );
};
