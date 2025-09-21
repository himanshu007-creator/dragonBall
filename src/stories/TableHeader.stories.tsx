import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TableHeader } from '../components/TableHeader';
import { SortState, SelectionState } from '../types';

const meta: Meta<typeof TableHeader> = {
  title: 'Components/TableHeader',
  component: TableHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A table header component with sorting capabilities and select-all functionality.',
      },
    },
  },
  argTypes: {
    sortState: {
      description: 'Current sort state',
      control: 'object',
    },
    onSort: {
      description: 'Callback when sort changes',
      action: 'sorted',
    },
    selectionState: {
      description: 'Current selection state',
      control: 'object',
    },
    onSelectAll: {
      description: 'Callback when select all is clicked',
      action: 'selectAll',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableHeader>;

const defaultSortState: SortState = {
  column: null,
  direction: null,
};

const nameSortAsc: SortState = {
  column: 'name',
  direction: 'asc',
};

const powerSortDesc: SortState = {
  column: 'power',
  direction: 'desc',
};

const noSelection: SelectionState = {
  selectedIds: new Set(),
  isAllSelected: false,
  isIndeterminate: false,
};

const allSelected: SelectionState = {
  selectedIds: new Set(['1', '2', '3']),
  isAllSelected: true,
  isIndeterminate: false,
};

const partialSelection: SelectionState = {
  selectedIds: new Set(['1', '2']),
  isAllSelected: false,
  isIndeterminate: true,
};

export const Default: Story = {
  args: {
    sortState: defaultSortState,
    selectionState: noSelection,
  },
};

export const SortedByNameAscending: Story = {
  args: {
    sortState: nameSortAsc,
    selectionState: noSelection,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table header with name column sorted in ascending order.',
      },
    },
  },
};

export const SortedByPowerDescending: Story = {
  args: {
    sortState: powerSortDesc,
    selectionState: noSelection,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table header with power column sorted in descending order.',
      },
    },
  },
};

export const AllItemsSelected: Story = {
  args: {
    sortState: defaultSortState,
    selectionState: allSelected,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table header with all items selected (checkbox checked).',
      },
    },
  },
};

export const PartialSelection: Story = {
  args: {
    sortState: defaultSortState,
    selectionState: partialSelection,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table header with some items selected (checkbox indeterminate).',
      },
    },
  },
};

export const SortedWithSelection: Story = {
  args: {
    sortState: nameSortAsc,
    selectionState: partialSelection,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table header with both sorting and partial selection active.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    sortState: nameSortAsc,
    selectionState: partialSelection,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Table header with mobile-optimized two-row layout featuring improved sort controls.',
      },
    },
  },
};

export const MobileWithSelection: Story = {
  args: {
    sortState: powerSortDesc,
    selectionState: allSelected,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile table header showing selection count and active sort state.',
      },
    },
  },
};