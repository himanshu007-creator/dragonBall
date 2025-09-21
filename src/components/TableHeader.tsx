'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { SortState, SelectionState } from '@/types';

export interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  className?: string;
  ariaLabel?: string;
}

export interface TableHeaderProps {
  sortState: SortState;
  onSort: (column: string, direction: 'asc' | 'desc' | null) => void;
  selectionState: SelectionState;
  onSelectAll: () => void;
}

const columns: ColumnDefinition[] = [
  {
    key: 'selection',
    label: '',
    width: 'w-12',
    className: 'text-center',
    ariaLabel: 'Character selection column',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    width: 'flex-1',
    ariaLabel: 'Character name column, sortable',
  },
  {
    key: 'power',
    label: 'Power Level',
    sortable: true,
    width: 'flex-1',
    className: 'text-center',
    ariaLabel: 'Character power level column, sortable',
  },
  {
    key: 'location',
    label: 'Location',
    width: 'flex-1',
    className: 'text-center',
    ariaLabel: 'Character location column',
  },
  {
    key: 'health',
    label: 'Health',
    width: 'flex-1',
    className: 'text-center',
    ariaLabel: 'Character health column',
  },
];

interface SortIconProps {
  direction: 'asc' | 'desc' | null;
  isActive: boolean;
}

const SortIcon: React.FC<SortIconProps> = ({ direction, isActive }) => {
  const iconVariants = {
    inactive: {
      scale: 0.8,
      opacity: 0.4,
      rotate: 0,
      color: '#9CA3AF', // gray-400
    },
    ascending: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      color: '#F97316', // orange-500
    },
    descending: {
      scale: 1,
      opacity: 1,
      rotate: 180,
      color: '#F97316', // orange-500
    },
  };

  const getVariant = () => {
    if (!isActive) return 'inactive';
    return direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <motion.div
      variants={iconVariants}
      animate={getVariant()}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="ml-2 flex-shrink-0"
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    </motion.div>
  );
};

interface SortableHeaderCellProps {
  column: ColumnDefinition;
  sortState: SortState;
  onSort: (column: string) => void;
}

const SortableHeaderCell: React.FC<SortableHeaderCellProps> = ({
  column,
  sortState,
  onSort,
}) => {
  const isActive = sortState.column === column.key;
  const sortDirection = isActive ? sortState.direction : null;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSort(column.key);
      }
    },
    [column.key, onSort]
  );

  const getSortAriaLabel = () => {
    if (!isActive) {
      return `Sort by ${column.label} ascending`;
    }
    if (sortDirection === 'asc') {
      return `Sort by ${column.label} descending`;
    }
    if (sortDirection === 'desc') {
      return `Remove ${column.label} sorting`;
    }
    return `Sort by ${column.label}`;
  };

  return (
    <motion.div
      className={`
        px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex-shrink-0
        ${column.width || 'flex-1'}
        ${column.className || ''}
        ${column.sortable ? 'cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset' : ''}
        ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
      `}
      onClick={() => column.sortable && onSort(column.key)}
      onKeyDown={column.sortable ? handleKeyDown : undefined}
      tabIndex={column.sortable ? 0 : -1}
      role={column.sortable ? 'button' : undefined}
      aria-label={column.sortable ? getSortAriaLabel() : column.ariaLabel}
      aria-sort={
        column.sortable && isActive
          ? sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
              ? 'descending'
              : 'none'
          : undefined
      }
      whileHover={column.sortable ? { scale: 1.02 } : undefined}
      whileTap={column.sortable ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <span className="truncate">{column.label}</span>
        {column.sortable && (
          <SortIcon direction={sortDirection} isActive={isActive} />
        )}
      </div>
    </motion.div>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = React.memo(
  ({ sortState, onSort, selectionState, onSelectAll }) => {
    const handleSort = useCallback(
      (column: string) => {
        if (!columns.find((col) => col.key === column)?.sortable) return;

        let newDirection: 'asc' | 'desc' | null = 'asc';

        if (sortState.column === column) {
          if (sortState.direction === 'asc') {
            newDirection = 'desc';
          } else if (sortState.direction === 'desc') {
            newDirection = null;
          }
        }

        onSort(column, newDirection);
      },
      [sortState, onSort]
    );

    const handleSelectAllKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectAll();
        }
      },
      [onSelectAll]
    );

    const getSelectAllAriaLabel = () => {
      if (selectionState.isAllSelected) {
        return 'Deselect all characters';
      }
      if (selectionState.isIndeterminate) {
        return 'Select all characters (some currently selected)';
      }
      return 'Select all characters';
    };

    return (
      <motion.div
        className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex-shrink-0 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        role="rowgroup"
      >
        {/* Desktop Header */}
        <div className="hidden md:flex items-center min-w-full" role="row">
          {columns.map((column) => (
            <React.Fragment key={column.key}>
              {column.key === 'selection' ? (
                <div
                  className={`px-4 py-3 text-center flex-shrink-0 ${column.width}`}
                  role="columnheader"
                  aria-label={column.ariaLabel}
                >
                  <motion.input
                    type="checkbox"
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    checked={selectionState.isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectionState.isIndeterminate;
                      }
                    }}
                    onChange={onSelectAll}
                    onKeyDown={handleSelectAllKeyDown}
                    aria-label={getSelectAllAriaLabel()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ) : (
                <SortableHeaderCell
                  column={column}
                  sortState={sortState}
                  onSort={handleSort}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden px-4 py-4 space-y-3" role="row">
          {/* Top Row: Select All and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.input
                type="checkbox"
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer w-5 h-5"
                checked={selectionState.isAllSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = selectionState.isIndeterminate;
                  }
                }}
                onChange={onSelectAll}
                onKeyDown={handleSelectAllKeyDown}
                aria-label={getSelectAllAriaLabel()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              />
              <span className="text-sm font-semibold text-gray-700">
                Dragon Ball Characters
              </span>
            </div>

            {/* Selection Count */}
            {(selectionState.isAllSelected ||
              selectionState.isIndeterminate) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
              >
                {selectionState.selectedIds.size} selected
              </motion.div>
            )}
          </div>

          {/* Bottom Row: Sort Controls */}
          <div className="flex items-center justify-center space-x-4 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Sort by:</span>
            <motion.button
              onClick={() => handleSort('name')}
              className={`
              flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-wider 
              focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200
              ${
                sortState.column === 'name'
                  ? 'bg-orange-100 text-orange-600 border border-orange-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }
            `}
              aria-label={`Sort by name ${sortState.column === 'name' && sortState.direction === 'asc' ? 'descending' : 'ascending'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Name</span>
              <SortIcon
                direction={
                  sortState.column === 'name' ? sortState.direction : null
                }
                isActive={sortState.column === 'name'}
              />
            </motion.button>

            <motion.button
              onClick={() => handleSort('power')}
              className={`
              flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-wider 
              focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200
              ${
                sortState.column === 'power'
                  ? 'bg-orange-100 text-orange-600 border border-orange-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }
            `}
              aria-label={`Sort by power level ${sortState.column === 'power' && sortState.direction === 'asc' ? 'descending' : 'ascending'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Power</span>
              <SortIcon
                direction={
                  sortState.column === 'power' ? sortState.direction : null
                }
                isActive={sortState.column === 'power'}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
);

TableHeader.displayName = 'TableHeader';
