import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';

const meta = {
  component: InputOTP,
  title: 'UI/InputOTP',
} satisfies Meta<typeof InputOTP>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxLength: 6,
    children: null,
  },
  render: ({ maxLength }) => (
    <div className="max-w-80">
      <InputOTP maxLength={maxLength}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
};
