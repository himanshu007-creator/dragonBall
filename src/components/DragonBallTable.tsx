'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCharacters } from '@/hooks/useCharacters';
import { FilterState, SortState, SelectionState } from '@/types';
import { TableHeader } from './TableHeader';
import { VirtualizedTableBody } from './VirtualizedTableBody';
import { TableSkeleton } from './TableSkeleton';
import { FilterPanel } from './FilterPanel';

export interface DragonBallTableProps {
  className?: string;
  initialPageSize?: number;
  enableVirtualization?: boolean;
}

// Removed unused initialFilters - now using getInitialFilters function

const initialSort: SortState = {
  column: null,
  direction: null,
};

const initialSelection: SelectionState = {
  selectedIds: new Set(),
  isAllSelected: false,
  isIndeterminate: false,
};

export const DragonBallTable: React.FC<DragonBallTableProps> = React.memo(
  ({ className = '', initialPageSize = 10, enableVirtualization = true }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize filters from URL parameters
    const getInitialFilters = useCallback((): FilterState => {
      const location = searchParams.get('location');
      const health = searchParams.get('health');
      const name = searchParams.get('name');
      const power = searchParams.get('power');

      return {
        location: location ? location.split(',').filter(Boolean) : [],
        health: health ? health.split(',').filter(Boolean) : [],
        name: name || '',
        power: power ? parseInt(power) : 10000,
      };
    }, [searchParams]);

    const [filters, setFilters] = useState<FilterState>(getInitialFilters);
    const [sortState, setSortState] = useState<SortState>(initialSort);
    const [selectionState, setSelectionState] =
      useState<SelectionState>(initialSelection);

    // Update URL when filters change
    const updateURL = useCallback(
      (newFilters: FilterState, newSortState?: SortState) => {
        const params = new URLSearchParams();

        if (newFilters.location.length > 0) {
          params.set('location', newFilters.location.join(','));
        }
        if (newFilters.health.length > 0) {
          params.set('health', newFilters.health.join(','));
        }
        if (newFilters.name) {
          params.set('name', newFilters.name);
        }
        if (newFilters.power < 10000) {
          params.set('power', newFilters.power.toString());
        }

        // Add sorting parameters
        const currentSort = newSortState || sortState;
        if (currentSort.column && currentSort.direction) {
          params.set('sortBy', currentSort.column);
          params.set('sortOrder', currentSort.direction);
        }

        const queryString = params.toString();
        const newURL = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(newURL);
      },
      [pathname, router, sortState]
    );

    // Handle filter changes
    const handleFiltersChange = useCallback(
      (newFilters: FilterState) => {
        setFilters(newFilters);
        updateURL(newFilters);
      },
      [updateURL]
    );

    // Update filters when URL changes
    useEffect(() => {
      const newFilters = getInitialFilters();
      setFilters(newFilters);
    }, [getInitialFilters]);

    // Convert filters to API params
    const apiParams = useMemo(
      () => ({
        location: filters.location.length > 0 ? filters.location.join(',') : undefined,
        health: filters.health.length > 0 ? filters.health.join(',') : undefined,
        name: filters.name || undefined,
        power: filters.power < 10000 ? filters.power : undefined,
      }),
      [filters]
    );

    const {
      data,
      isLoading,
      isError,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useCharacters({
      filters: apiParams,
      limit: initialPageSize,
    });

    // Flatten all pages into a single array
    const allCharacters = useMemo(() => {
      const characters = data?.pages.flatMap((page) => page.items) ?? [];
      console.log('📋 Characters flattened:', {
        totalCharacters: characters.length,
        pagesCount: data?.pages.length,
        hasNextPage,
        isFetchingNextPage
      });
      return characters;
    }, [data, hasNextPage, isFetchingNextPage]);

    // Handle sorting
    const handleSort = useCallback(
      (column: string, direction: 'asc' | 'desc' | null) => {
        const newSortState = { column, direction };
        setSortState(newSortState);
        updateURL(filters, newSortState);
      },
      [filters, updateURL]
    );

    // Handle row selection
    const handleRowSelect = useCallback(
      (id: string) => {
        setSelectionState((prev) => {
          const newSelectedIds = new Set(prev.selectedIds);

          if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
          } else {
            newSelectedIds.add(id);
          }

          const totalVisible = allCharacters.length;
          const selectedCount = newSelectedIds.size;

          return {
            selectedIds: newSelectedIds,
            isAllSelected: selectedCount > 0 && selectedCount === totalVisible,
            isIndeterminate: selectedCount > 0 && selectedCount < totalVisible,
          };
        });
      },
      [allCharacters.length]
    );

    // Handle select all
    const handleSelectAll = useCallback(() => {
      setSelectionState((prev) => {
        if (prev.isAllSelected) {
          // Deselect all
          return {
            selectedIds: new Set(),
            isAllSelected: false,
            isIndeterminate: false,
          };
        } else {
          // Select all visible characters
          const allIds = new Set(allCharacters.map((char) => char.id));
          return {
            selectedIds: allIds,
            isAllSelected: true,
            isIndeterminate: false,
          };
        }
      });
    }, [allCharacters]);

    if (isError) {
      return (
        <div className="flex items-center justify-center p-8 text-red-600">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Error loading characters
            </h3>
            <p className="text-sm">
              {error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`anime-character-table h-screen flex flex-col ${className}`}>
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          className="flex-shrink-0"
        />

        <div className="bg-white shadow-sm border-x border-b border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
          <TableHeader
            sortState={sortState}
            onSort={handleSort}
            selectionState={selectionState}
            onSelectAll={handleSelectAll}
          />

          {isLoading && allCharacters.length === 0 ? (
            <TableSkeleton />
          ) : (
            <VirtualizedTableBody
              data={allCharacters}
              selectionState={selectionState}
              onRowSelect={handleRowSelect}
              isLoading={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              enableVirtualization={enableVirtualization}
            />
          )}
        </div>
      </div>
    );
  }
);

DragonBallTable.displayName = 'DragonBallTable';
