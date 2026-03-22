import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Plus } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "ui/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Button",
    iconLeft: Plus,
    iconRight: Plus,
    isLoading: false,
  },
};

export const Neutral: Story = {
  args: {
    label: "Button",
    variant: "neutral",
    iconLeft: Plus,
    iconRight: Plus,
    isLoading: false,
  },
};

export const Ghost: Story = {
  args: {
    label: "Button",
    variant: "ghost",
    iconLeft: Plus,
    iconRight: Plus,
    isLoading: false,
  },
};

export const Link: Story = {
  args: {
    label: "Button",
    variant: "link",
    iconLeft: Plus,
    iconRight: Plus,
    isLoading: false,
  },
};

export const Danger: Story = {
  args: {
    label: "Button",
    variant: "danger",
    iconLeft: Plus,
    iconRight: Plus,
    isLoading: false,
  },
};

export const DangerGhost: Story = {
  args: {
    label: "Button",
    variant: "dangerGhost",
    iconLeft: Plus,
    iconRight: Plus,
    isLoading: false,
  },
};
