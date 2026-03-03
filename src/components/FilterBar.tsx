import React, { useState } from 'react';
import { Filter, SlidersHorizontal, X, ChevronDown, RotateCcw, Calendar, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  options: string[];
  selected: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const activeFiltersCount = filters.filter(f => f.selected !== 'All').length;

  const handleResetAll = () => {
    filters.forEach(f => onFilterChange(f.id, 'All'));
  };

  const handleFilterSelect = (filterId: string, value: string) => {
    onFilterChange(filterId, value);
    setExpandedFilter(null);
  };

  // Cascading filter logic - when region changes, we could filter products
  const getCascadedOptions = (filter: FilterOption) => {
    // For demo purposes, return all options
    // In real SAC, this would filter based on parent selections
    return filter.options;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <SlidersHorizontal size={18} />
          <span className="text-sm font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-sap-blue text-white text-xs rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RotateCcw size={14} />
              Reset All
            </button>
          )}
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="text-sm text-sap-blue hover:underline"
          >
            {showAllFilters ? 'Show Less' : 'More Filters'}
          </button>
        </div>
      </div>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b dark:border-gray-700">
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

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {filters.slice(0, showAllFilters ? filters.length : 3).map((filter) => (
          <div key={filter.id} className="relative">
            <button
              onClick={() => setExpandedFilter(expandedFilter === filter.id ? null : filter.id)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                filter.selected !== 'All'
                  ? 'border-sap-blue bg-blue-50 dark:bg-blue-900/20 text-sap-blue'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-gray-500 dark:text-gray-400">{filter.label}:</span>
              <span className="font-medium">{filter.selected}</span>
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
                  {getCascadedOptions(filter).map((option) => (
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

        {/* Date Range Picker (Visual Demo) */}
        {showAllFilters && (
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-gray-300"
          >
            <Calendar size={14} />
            <span>Date Range</span>
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400 py-1">Quick filters:</span>
        <button
          onClick={() => onFilterChange('1', '2024')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.find(f => f.id === '1')?.selected === '2024'
              ? 'bg-sap-blue text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          This Year
        </button>
        <button
          onClick={() => onFilterChange('1', '2023')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.find(f => f.id === '1')?.selected === '2023'
              ? 'bg-sap-blue text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Last Year
        </button>
        <button
          onClick={() => {
            onFilterChange('2', 'North America');
          }}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.find(f => f.id === '2')?.selected === 'North America'
              ? 'bg-sap-blue text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          North America
        </button>
        <button
          onClick={() => {
            onFilterChange('2', 'Europe');
          }}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.find(f => f.id === '2')?.selected === 'Europe'
              ? 'bg-sap-blue text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Europe
        </button>
        <button
          onClick={() => {
            onFilterChange('3', 'Product A');
          }}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.find(f => f.id === '3')?.selected === 'Product A'
              ? 'bg-sap-blue text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Product A
        </button>
      </div>
    </div>
  );
};
