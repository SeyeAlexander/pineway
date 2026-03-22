import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Placeholder',
    size: 'base',
  },
};

/**
 * An example of an input with invalid form validation. The state does not clear in this story.
 */
export const ErrorInput: Story = {
  args: {
    placeholder: 'Placeholder',
    'data-error': 'true',
  },
};
