"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import type { ComponentProps, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ImagePlus } from "lucide-react";
import Image from "next/image";

type AvatarSize =
  | "24"
  | "32"
  | "36"
  | "40"
  | "48"
  | "56"
  | "64"
  | "72"
  | "80"
  | "88"
  | "96"
  | "112";

interface AvatarProps
  extends Omit<
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    "children"
  > {
  src: string;
  type: "circular" | "square";
  size: AvatarSize;
  showHoverOverlay?: boolean;
}

const avatarVariants = cva(
  "inline-block relative overflow-hidden shadow-border-subtle",
  {
    variants: {
      type: {
        circular: "rounded-full",
        square: "rounded-2xl",
      },
      size: {
        "24": "size-6",
        "32": "size-8",
        "36": "size-9",
        "40": "size-10",
        "48": "size-12",
        "56": "size-14",
        "64": "size-16",
        "72": "size-[4.5rem]",
        "80": "size-20",
        "88": "size-[5.5rem]",
        "96": "size-24",
        "112": "size-28",
      },
    },
  },
);

function Avatar({
  className,
  type,
  size,
  src,
  showHoverOverlay = false,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        avatarVariants({ type, size }),
        showHoverOverlay && "cursor-pointer",
        className,
      )}
      {...props}
    >
      <AvatarImage src={src} />
      <AvatarFallback>
        <Image
          src="/pineway-default-avatar.svg"
          className="h-full w-full object-cover"
          alt="Fallback avatar image"
          fill
          fetchPriority="high"
          priority
          loading="eager"
          quality={50}
        />
      </AvatarFallback>
      {showHoverOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 hover:opacity-100">
          <ImagePlus className="size-6 text-white" />
        </div>
      )}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      fetchPriority="high"
      loading="eager"
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
