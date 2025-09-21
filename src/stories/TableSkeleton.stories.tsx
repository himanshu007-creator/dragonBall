import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TableSkeleton } from '../components/TableSkeleton';

const meta: Meta<typeof TableSkeleton> = {
  title: 'Components/TableSkeleton',
  component: TableSkeleton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A full table skeleton component displayed while the initial data is loading.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableSkeleton>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Table skeleton optimized for mobile devices.',
      },
    },
  },
};