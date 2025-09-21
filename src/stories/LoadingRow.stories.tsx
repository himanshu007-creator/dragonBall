import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoadingRow } from '../components/LoadingRow';

const meta: Meta<typeof LoadingRow> = {
  title: 'Components/LoadingRow',
  component: LoadingRow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A loading skeleton row component displayed while fetching more data.',
      },
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
type Story = StoryObj<typeof LoadingRow>;

export const Default: Story = {};

export const MultipleRows: Story = {
  decorators: [
    (Story) => (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Story />
        <Story />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Multiple loading rows to show the effect when loading several items.',
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Loading row optimized for mobile devices.',
      },
    },
  },
};