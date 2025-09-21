import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TableRow } from '../components/TableRow';
import { Character } from '../types';

const meta: Meta<typeof TableRow> = {
  title: 'Components/TableRow',
  component: TableRow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A table row component for displaying Dragon Ball character information with selection capability.',
      },
    },
  },
  argTypes: {
    character: {
      description: 'Character data to display',
      control: 'object',
    },
    isSelected: {
      description: 'Whether the row is selected',
      control: 'boolean',
    },
    onSelect: {
      description: 'Callback when row is selected',
      action: 'selected',
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
type Story = StoryObj<typeof TableRow>;

const sampleCharacter: Character = {
  id: '1',
  name: 'Goku',
  power: 8500000,
  location: 'Earth',
  health: 'Healthy',
};

const powerfulCharacter: Character = {
  id: '2',
  name: 'Goku Ultra Instinct',
  power: 95000000,
  location: 'Earth',
  health: 'Healthy',
};

const injuredCharacter: Character = {
  id: '3',
  name: 'Vegeta',
  power: 7200000,
  location: 'Earth',
  health: 'Injured',
};

const criticalCharacter: Character = {
  id: '4',
  name: 'Piccolo',
  power: 4500000,
  location: 'Earth',
  health: 'Critical',
};

const longNameCharacter: Character = {
  id: '5',
  name: 'Super Saiyan God Super Saiyan Goku Ultra Instinct',
  power: 15000000,
  location: 'Tournament of Power Arena',
  health: 'Healthy',
};

export const Default: Story = {
  args: {
    character: sampleCharacter,
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    character: sampleCharacter,
    isSelected: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table row in selected state with highlighted background.',
      },
    },
  },
};

export const PowerfulCharacter: Story = {
  args: {
    character: powerfulCharacter,
    isSelected: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table row displaying a character with very high power level (formatted in millions).',
      },
    },
  },
};

export const InjuredCharacter: Story = {
  args: {
    character: injuredCharacter,
    isSelected: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table row showing a character with injured health status.',
      },
    },
  },
};

export const CriticalCharacter: Story = {
  args: {
    character: criticalCharacter,
    isSelected: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table row showing a character in critical health condition.',
      },
    },
  },
};

export const LongName: Story = {
  args: {
    character: longNameCharacter,
    isSelected: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table row with a very long character name to test text truncation.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    character: sampleCharacter,
    isSelected: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Table row with mobile-optimized layout featuring larger touch targets and improved spacing.',
      },
    },
  },
};

export const MobileSelected: Story = {
  args: {
    character: powerfulCharacter,
    isSelected: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Selected table row on mobile with enhanced visual feedback.',
      },
    },
  },
};