import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar } from './avatar';

const meta = {
  component: Avatar,
  title: 'UI/Avatar',
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Renders the "circular" avatar.
 */
export const Circular: Story = {
  args: {
    type: 'circular',
    size: '80',
    src: 'test.png',
  },
};

/**
 * Renders the "square" avatar.
 */
export const Square: Story = {
  args: {
    type: 'square',
    size: '80',
    src: 'test.png',
  },
};
