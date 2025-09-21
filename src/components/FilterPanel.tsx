'use client';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterState } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchFilterOptions } from '@/utils/api';

export interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

interface DropdownProps {
  label: string;
  icon: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon,
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionToggle = (option: string) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onSelectionChange(newSelection);
  };

  const displayText =
    selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
        ? selectedValues[0]
        : `${selectedValues.length} selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-3 py-2 lg:py-2 text-sm border rounded-lg
          transition-all duration-200 min-w-[120px] lg:min-w-[140px] h-10 lg:h-10
          ${
            selectedValues.length > 0
              ? 'border-orange-300 bg-orange-50 text-orange-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`${label} filter`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <span className="text-xs lg:text-xs">{icon}</span>
          <span className="truncate text-xs lg:text-xs font-medium text-black">
            {displayText}
          </span>
        </div>
        <motion.svg
          className="w-4 h-4 flex-shrink-0"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 lg:max-h-48 overflow-y-auto"
          >
            {options.map((option) => (
              <motion.label
                key={option}
                className="flex items-center px-3 py-2 lg:py-2 hover:bg-gray-50 cursor-pointer text-sm"
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-1 mr-2"
                />
                <span className="truncate text-black text-sm lg:text-sm">
                  {option}
                </span>
              </motion.label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface PowerRangeProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

const PowerRange: React.FC<PowerRangeProps> = ({ value, onChange, max }) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue.toString());
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    const numValue = parseInt(localValue) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), max);
    setLocalValue(clampedValue.toString());
    onChange(clampedValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="flex items-center space-x-2 min-w-[180px] lg:min-w-[200px]">
      <span className="text-xs lg:text-xs">⚡</span>
      <div className="flex-1">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 lg:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${(value / max) * 100}%, #e5e7eb ${(value / max) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <input
        type="number"
        value={localValue}
        onChange={handleInputChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        min="0"
        max={max}
        className={`
          w-16 lg:w-16 px-2 py-1 text-xs border rounded text-center text-black
          ${isInputFocused ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'}
          focus:outline-none transition-all duration-200
        `}
      />
    </div>
  );
};

export const FilterPanel: React.FC<FilterPanelProps> = React.memo(
  ({ filters, onFiltersChange, className = '' }) => {
    const [localName, setLocalName] = useState(filters.name);
    const [filterOptions, setFilterOptions] = useState<{
      locations: string[];
      healthStates: string[];
      maxPower: number;
    }>({ locations: [], healthStates: [], maxPower: 10000 });

    const debouncedName = useDebounce(localName, 300);

    // Load filter options on mount
    useEffect(() => {
      const loadOptions = async () => {
        try {
          const options = await fetchFilterOptions();
          setFilterOptions(options);
        } catch (error) {
          console.error('Failed to load filter options:', error);
          // Use fallback values
          setFilterOptions({
            locations: ['Iwa', 'Kumo', 'Kiri', 'Suna', 'Konoha'],
            healthStates: ['Healthy', 'Injured', 'Critical'],
            maxPower: 10000,
          });
        }
      };
      loadOptions();
    }, []);

    // Update filters when debounced name changes
    useEffect(() => {
      if (debouncedName !== filters.name) {
        onFiltersChange({
          ...filters,
          name: debouncedName,
        });
      }
    }, [debouncedName, filters, onFiltersChange]);

    // Update local name when filters change externally
    useEffect(() => {
      setLocalName(filters.name);
    }, [filters.name]);

    const handleNameChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalName(e.target.value);
      },
      []
    );

    const handleLocationChange = useCallback(
      (locations: string[]) => {
        onFiltersChange({
          ...filters,
          location: locations,
        });
      },
      [filters, onFiltersChange]
    );

    const handleHealthChange = useCallback(
      (healthStates: string[]) => {
        onFiltersChange({
          ...filters,
          health: healthStates,
        });
      },
      [filters, onFiltersChange]
    );

    const handlePowerChange = useCallback(
      (power: number) => {
        onFiltersChange({
          ...filters,
          power,
        });
      },
      [filters, onFiltersChange]
    );

    const clearFilters = useCallback(() => {
      setLocalName('');
      onFiltersChange({
        location: [],
        health: [],
        name: '',
        power: filterOptions.maxPower,
      });
    }, [onFiltersChange, filterOptions.maxPower]);

    const hasActiveFilters =
      filters.location.length > 0 ||
      filters.health.length > 0 ||
      filters.name.length > 0 ||
      filters.power < filterOptions.maxPower;

    return (
      <motion.div
        className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Name Search */}
          <div className="flex items-center space-x-2 min-w-[200px] flex-1">
            <span className="text-xs">🔍</span>
            <motion.input
              type="text"
              value={localName}
              onChange={handleNameChange}
              placeholder="Search characters..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 h-10 text-black"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Location Dropdown */}
          <Dropdown
            label="Location"
            icon="🏙️"
            options={filterOptions.locations}
            selectedValues={filters.location}
            onSelectionChange={handleLocationChange}
            placeholder="All Locations"
          />

          {/* Health Dropdown */}
          <Dropdown
            label="Health"
            icon="❤️"
            options={filterOptions.healthStates}
            selectedValues={filters.health}
            onSelectionChange={handleHealthChange}
            placeholder="All Health"
          />

          {/* Power Range */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              Power ≤
            </span>
            <PowerRange
              value={filters.power}
              onChange={handlePowerChange}
              max={filterOptions.maxPower}
            />
          </div>

          {/* Clear Filters */}
          <motion.button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`
            px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 h-10 whitespace-nowrap
            ${
              hasActiveFilters
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
            whileHover={hasActiveFilters ? { scale: 1.05 } : {}}
            whileTap={hasActiveFilters ? { scale: 0.95 } : {}}
          >
            Clear All
          </motion.button>

          {/* Active filters count */}
          {hasActiveFilters && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
            >
              {filters.location.length +
                filters.health.length +
                (filters.name ? 1 : 0) +
                (filters.power < filterOptions.maxPower ? 1 : 0)}{' '}
              active
            </motion.div>
          )}
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden space-y-4">
          {/* Search Bar - Full Width */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">🔍</span>
            <motion.input
              type="text"
              value={localName}
              onChange={handleNameChange}
              placeholder="Search Dragon Ball characters..."
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-black"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Filter Row 1: Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Location"
              icon="🏙️"
              options={filterOptions.locations}
              selectedValues={filters.location}
              onSelectionChange={handleLocationChange}
              placeholder="All Locations"
            />
            <Dropdown
              label="Health"
              icon="❤️"
              options={filterOptions.healthStates}
              selectedValues={filters.health}
              onSelectionChange={handleHealthChange}
              placeholder="All Health"
            />
          </div>

          {/* Filter Row 2: Power Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Power Level
              </span>
              <span className="text-xs text-gray-500">
                ≤ {filters.power.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm">⚡</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={filterOptions.maxPower}
                  value={filters.power}
                  onChange={(e) => handlePowerChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${(filters.power / filterOptions.maxPower) * 100}%, #e5e7eb ${(filters.power / filterOptions.maxPower) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            {/* Active filters count */}
            {hasActiveFilters && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-2 bg-orange-100 text-orange-700 text-sm rounded-full font-medium"
              >
                {filters.location.length +
                  filters.health.length +
                  (filters.name ? 1 : 0) +
                  (filters.power < filterOptions.maxPower ? 1 : 0)}{' '}
                active filter
                {filters.location.length +
                  filters.health.length +
                  (filters.name ? 1 : 0) +
                  (filters.power < filterOptions.maxPower ? 1 : 0) !==
                1
                  ? 's'
                  : ''}
              </motion.div>
            )}

            {/* Clear Filters */}
            <motion.button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ml-auto
              ${
                hasActiveFilters
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
              whileHover={hasActiveFilters ? { scale: 1.05 } : {}}
              whileTap={hasActiveFilters ? { scale: 0.95 } : {}}
            >
              Clear All
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
);

FilterPanel.displayName = 'FilterPanel';
