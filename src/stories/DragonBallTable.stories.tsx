import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterState, SortState, SelectionState, Character } from '../types';
import { TableHeader } from '../components/TableHeader';
import { VirtualizedTableBody } from '../components/VirtualizedTableBody';
import { FilterPanel } from '../components/FilterPanel';

// Mock data for Storybook
const mockCharacters: Character[] = [
  { id: '1', name: 'Goku', power: 9500000, location: 'Earth', health: 'Healthy' },
  { id: '2', name: 'Vegeta', power: 8900000, location: 'Earth', health: 'Healthy' },
  { id: '3', name: 'Gohan', power: 7200000, location: 'Earth', health: 'Healthy' },
  { id: '4', name: 'Piccolo', power: 4500000, location: 'Earth', health: 'Injured' },
  { id: '5', name: 'Frieza', power: 12000000, location: 'Namek', health: 'Critical' },
  { id: '6', name: 'Cell', power: 8500000, location: 'Earth', health: 'Healthy' },
  { id: '7', name: 'Majin Buu', power: 11000000, location: 'Earth', health: 'Healthy' },
  { id: '8', name: 'Trunks', power: 6800000, location: 'Earth', health: 'Healthy' },
  { id: '9', name: 'Goten', power: 5200000, location: 'Earth', health: 'Healthy' },
  { id: '10', name: 'Android 18', power: 7500000, location: 'Earth', health: 'Healthy' },
];

// Storybook-compatible DragonBallTable component
const StorybookDragonBallTable: React.FC<{
  className?: string;
  initialPageSize?: number;
  enableVirtualization?: boolean;
}> = ({ className = '', initialPageSize = 10, enableVirtualization = true }) => {
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    health: [],
    name: '',
    power: 10000,
  });
  
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedIds: new Set(),
    isAllSelected: false,
    isIndeterminate: false,
  });

  // Filter characters based on current filters
  const filteredCharacters = useMemo(() => {
    return mockCharacters.filter(character => {
      if (filters.location.length > 0 && !filters.location.includes(character.location)) {
        return false;
      }
      if (filters.health.length > 0 && !filters.health.includes(character.health)) {
        return false;
      }
      if (filters.name && !character.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (character.power > filters.power) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Sort characters
  const sortedCharacters = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return filteredCharacters;
    }

    return [...filteredCharacters].sort((a, b) => {
      const aValue = a[sortState.column as keyof Character];
      const bValue = b[sortState.column as keyof Character];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredCharacters, sortState]);

  const handleSort = useCallback((column: string, direction: 'asc' | 'desc' | null) => {
    setSortState({ column, direction });
  }, []);

  const handleRowSelect = useCallback((id: string) => {
    setSelectionState(prev => {
      const newSelectedIds = new Set(prev.selectedIds);
      
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      
      const totalVisible = sortedCharacters.length;
      const selectedCount = newSelectedIds.size;
      
      return {
        selectedIds: newSelectedIds,
        isAllSelected: selectedCount > 0 && selectedCount === totalVisible,
        isIndeterminate: selectedCount > 0 && selectedCount < totalVisible,
      };
    });
  }, [sortedCharacters.length]);

  const handleSelectAll = useCallback(() => {
    setSelectionState(prev => {
      if (prev.isAllSelected) {
        return {
          selectedIds: new Set(),
          isAllSelected: false,
          isIndeterminate: false,
        };
      } else {
        const allIds = new Set(sortedCharacters.map(char => char.id));
        return {
          selectedIds: allIds,
          isAllSelected: true,
          isIndeterminate: false,
        };
      }
    });
  }, [sortedCharacters]);

  return (
    <div className={`anime-character-table h-screen flex flex-col ${className}`}>
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        className="flex-shrink-0"
      />

      <div className="bg-white shadow-sm border-x border-b border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
        <TableHeader
          sortState={sortState}
          onSort={handleSort}
          selectionState={selectionState}
          onSelectAll={handleSelectAll}
        />

        <VirtualizedTableBody
          data={sortedCharacters}
          selectionState={selectionState}
          onRowSelect={handleRowSelect}
          isLoading={false}
          hasNextPage={false}
          fetchNextPage={() => {}}
          enableVirtualization={enableVirtualization}
        />
      </div>
    </div>
  );
};

// Create a mock QueryClient for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

const meta: Meta<typeof StorybookDragonBallTable> = {
  title: 'Components/DragonBallTable',
  component: StorybookDragonBallTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The complete Dragon Ball character table with filtering, sorting, and infinite scroll.',
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    initialPageSize: {
      description: 'Initial number of items per page',
      control: { type: 'number', min: 5, max: 50, step: 5 },
    },
    enableVirtualization: {
      description: 'Enable virtualization for large datasets',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StorybookDragonBallTable>;

export const Default: Story = {
  args: {
    initialPageSize: 10,
    enableVirtualization: true,
  },
};

export const SmallPageSize: Story = {
  args: {
    initialPageSize: 5,
    enableVirtualization: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with smaller page size and virtualization disabled.',
      },
    },
  },
};

export const LargePageSize: Story = {
  args: {
    initialPageSize: 25,
    enableVirtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with larger page size and virtualization enabled for performance.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    initialPageSize: 10,
    enableVirtualization: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Table optimized for mobile devices with responsive layout.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    initialPageSize: 15,
    enableVirtualization: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Table optimized for tablet devices.',
      },
    },
  },
};