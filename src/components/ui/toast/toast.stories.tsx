import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Toaster } from 'sonner';
import { Button } from '../button/button';
import { showToast, Toast } from './toast';

const meta = {
  component: Toast,
  title: 'UI/Toast',
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'a-random-id',
    title: 'Toast title',
    description: 'Copy',
  },
};

export const Error: Story = {
  args: {
    id: 'a-random-id-error',
    title: 'Something went wrong',
    type: 'error',
  },
};

export const Expanded: Story = {
  args: {
    id: 'another-random-id',
    title: 'Toast title',
    description: 'Copy',
    type: 'success',
    variant: 'expanded',
    buttons: [
      {
        label: 'Do something',
        onClick: () => {
          console.log('Doing something.');
        },
      },
    ],
  },
};

export const ExpandedWithMultipleButtons: Story = {
  args: {
    id: 'yet-another-random-id',
    title: 'Toast title',
    description: 'Copy',
    variant: 'expanded',
    type: 'warning',
    buttons: [
      {
        label: 'Agree',
        onClick: () => {
          console.log('I agree.');
        },
      },
      {
        label: 'Give up',
        onClick: () => {
          console.log('I give up.');
        },
      },
    ],
  },
};

export const DemoUsage: StoryObj = {
  render: () => (
    <div className="h-96">
      <Toaster />
      <Button
        label="Show toast"
        onClick={() => {
          showToast({
            title: 'I completed an action.',
            type: 'success',
            variant: 'expanded',
          });
        }}
      />
    </div>
  ),
};
