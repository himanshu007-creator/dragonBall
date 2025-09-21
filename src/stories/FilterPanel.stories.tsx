import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FilterPanel } from '../components/FilterPanel';
import { FilterState } from '../types';

const meta: Meta<typeof FilterPanel> = {
  title: 'Components/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive filter panel for Dragon Ball characters with search, dropdowns, and power range slider.',
      },
    },
  },
  argTypes: {
    filters: {
      description: 'Current filter state',
      control: 'object',
    },
    onFiltersChange: {
      description: 'Callback when filters change',
      action: 'filtersChanged',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterPanel>;

const defaultFilters: FilterState = {
  location: [],
  health: [],
  name: '',
  power: 10000,
};

const activeFilters: FilterState = {
  location: ['Earth', 'Namek'],
  health: ['Healthy'],
  name: 'Goku',
  power: 5000,
};

export const Default: Story = {
  args: {
    filters: defaultFilters,
  },
};

export const WithActiveFilters: Story = {
  args: {
    filters: activeFilters,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with some active filters applied.',
      },
    },
  },
};

export const WithLongName: Story = {
  args: {
    filters: {
      ...defaultFilters,
      name: 'This is a very long character name that should be handled properly',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with a long search term to test text truncation.',
      },
    },
  },
};

export const AllFiltersActive: Story = {
  args: {
    filters: {
      location: ['Earth', 'Namek', 'Vegeta'],
      health: ['Healthy', 'Injured'],
      name: 'Vegeta',
      power: 3000,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with all possible filters active.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    filters: activeFilters,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Filter panel with mobile-optimized stacked layout and larger touch targets.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    filters: activeFilters,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Filter panel optimized for tablet devices with responsive grid layout.',
      },
    },
  },
};
