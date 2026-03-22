import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HelperText } from './helper-text';

const meta = {
  component: HelperText,
  title: 'UI/HelperText',
} satisfies Meta<typeof HelperText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Helper text',
    // icon: 'Info',
    type: 'neutral',
  },
};
