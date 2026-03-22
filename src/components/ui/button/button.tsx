"use client";

import { ButtonSpinner } from "@/components/ui/button/button-spinner";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

export interface ButtonProps {
  /**
   * If this is specified, only one of iconLeft or iconRight needs to be provided
   */
  iconOnly?: boolean;
  /**
   * Icon to be displayed to the left of the button label
   */
  iconLeft?: React.ElementType;
  /**
   * Icon to be displayed to the right of the button label
   */
  iconRight?: React.ElementType;

  label?: string;
  /**
   * The button's size. Affects icon sizing too
   */
  size?: "lg" | "sm" | "default";
  /**
   * Sets the button's disabled state
   */
  disabled?: boolean;
  /**
   * Shows a loading indicator and disables the button
   */
  isLoading?: boolean;

  /**
   * Additional classes to pass to icons in button
   */
  iconClassName?: string;
}

const buttonVariants = cva(
  "inline-flex justify-center items-center gap-1 text-sm transition-all duration-150 outline-none cursor-pointer disabled:cursor-not-allowed focus:shadow-button-focus group disabled:[&_*]:text-gray-400 disabled:text-gray-400 active:scale-[0.98] disabled:active:scale-100 relative",
  {
    variants: {
      variant: {
        primary: `
          bg-violet-600 bg-(image:--gradient-button-primary) text-white shadow-button-primary
          hover:bg-(image:--gradient-button-primary-hover) hover:shadow-button-primary-hover
          focus:shadow-button-primary-focus
        `,
        neutral: `
          bg-white-50 text-gray-800 shadow-button-neutral
          hover:bg-gray-100 hover:shadow-button-neutral-hover
        `,
        ghost: `
          bg-white-50
          hover:bg-gray-100 hover:shadow-button-ghost-hover hover:text-gray-800
        `,
        link: `
          p-0
          hover:text-violet-600
        `,
        danger: `
          bg-red-600 bg-(image:--gradient-button-primary) text-white shadow-button-danger
          hover:bg-(image:--gradient-button-primary-hover) hover:shadow-button-danger-hover
          focus:shadow-button-danger-focus
        `,
        dangerGhost: `
          bg-white-50 text-red-500
          hover:bg-red-100/80 hover:shadow-button-danger-ghost-hover
          focus:shadow-button-danger-ghost-focus
        `,
      },
      size: {
        sm: "py-1.5 px-2.5 rounded-lg",
        default: "py-2.5 px-3 rounded-xl",
        lg: "py-3 px-3.5 rounded-2xl",
      },
      iconOnly: {
        false: null,
        true: "p-0",
      },
      isLoading: {
        false: null,
        true: "pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      isLoading: false,
    },
    compoundVariants: [
      {
        variant: "link",
        className: "p-0",
      },
      {
        size: "lg",
        className: "text-base gap-0.5",
      },
      {
        size: "sm",
        iconOnly: true,
        className: "p-[0.4375rem]",
      },
      {
        size: "default",
        iconOnly: true,
        className: "p-2.5",
      },
      {
        size: "lg",
        iconOnly: true,
        className: "p-3",
      },
      // Loading states
      {
        variant: "primary",
        isLoading: true,
        className:
          "bg-(image:--gradient-button-primary-hover) shadow-button-primary-hover",
      },
      {
        variant: "neutral",
        isLoading: true,
        className: "bg-gray-100 shadow-button-neutral-hover",
      },
      {
        variant: "ghost",
        isLoading: true,
        className: "bg-gray-100 shadow-button-ghost-hover text-gray-800",
      },
      {
        variant: "link",
        isLoading: true,
        className: "text-violet-600",
      },
      {
        variant: "danger",
        isLoading: true,
        className:
          "bg-(image:--gradient-button-primary-hover) shadow-button-danger-hover",
      },
      {
        variant: "dangerGhost",
        isLoading: true,
        className: "bg-red-100/80 shadow-button-danger-ghost-hover",
      },
      // Disabled states (when not loading)
      {
        variant: "primary",
        isLoading: false,
        className:
          "disabled:bg-none disabled:bg-gray-100 disabled:shadow-button-neutral",
      },
      {
        variant: "neutral",
        isLoading: false,
        className: "disabled:bg-gray-100 disabled:hover:shadow-button-neutral",
      },
      {
        variant: "ghost",
        isLoading: false,
        className: "disabled:bg-none disabled:shadow-none",
      },
      {
        variant: "link",
        isLoading: false,
        className: "disabled:bg-none disabled:shadow-none",
      },
      {
        variant: "danger",
        isLoading: false,
        className:
          "disabled:bg-none disabled:bg-gray-100 disabled:shadow-button-neutral",
      },
      {
        variant: "dangerGhost",
        isLoading: false,
        className:
          "disabled:bg-none disabled:shadow-none disabled:hover:bg-gray-100 disabled:hover:shadow-none",
      },
    ],
  },
);

const iconVariants = cva("text-gray-600 transition-colors duration-150", {
  variants: {
    variant: {
      primary: "text-white group-disabled:text-gray-400",
      neutral: "",
      ghost: "group-disabled:text-gray-400",
      link: "group-hover:text-violet-600",
      danger: "text-white group-disabled:text-gray-400",
      dangerGhost: "text-red-500 group-disabled:text-gray-400",
    },
    size: {
      sm: "size-[1.125rem]",
      default: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "primary",
  },
});

const labelVariants = cva("font-medium", {
  variants: {
    size: {
      sm: "mx-0.5",
      default: "mx-1",
      lg: "mx-1.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Helper to assign a node to a single ref
function setRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(node);
  } else {
    try {
      (ref as React.RefObject<T | null>).current = node;
    } catch {
      // ignore write errors
    }
  }
}

// Hook to compose multiple refs into a single stable callback ref
function useComposedRef<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  // Store refs in a mutable ref so the callback identity never changes
  const refsRef = React.useRef(refs);
  refsRef.current = refs;

  return React.useCallback((node: T | null) => {
    for (const r of refsRef.current) {
      setRef(r, node);
    }
  }, []);
}

// @todo rewrite to use composition pattern
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    } & ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size,
      asChild = false,
      iconOnly,
      iconLeft: IconLeft,
      iconRight: IconRight,
      label,
      isLoading = false,
      disabled = false,
      iconClassName,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const isButtonDisabled = disabled || isLoading;

    const { type = "button", ...buttonProps } = props;

    const buttonContent = iconOnly ? (
      <>
        {/* Original content - hidden when loading */}
        <span className={cn(isLoading && "invisible")}>
          {IconLeft ? (
            <IconLeft className={cn(iconVariants({ size, variant }))} />
          ) : IconRight ? (
            <IconRight className={cn(iconVariants({ size, variant }))} />
          ) : null}
        </span>

        {/* Loading spinner - positioned absolutely */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ButtonSpinner size={size} variant={variant || "primary"} />
          </div>
        )}
      </>
    ) : null;

    if (iconOnly) {
      const button = (
        <Comp
          data-slot="button"
          className={cn(
            buttonVariants({ size, variant, className, iconOnly, isLoading }),
          )}
          disabled={isButtonDisabled}
          {...buttonProps}
          type={type}
          ref={ref}
        >
          {buttonContent}
        </Comp>
      );

      return button;
    }

    const hasStructuredContent = label || IconLeft || IconRight;
    const regularButtonContent = (
      <>
        {/* Original content - hidden when loading */}
        {hasStructuredContent ? (
          <span
            className={cn("flex items-center gap-1", isLoading && "invisible")}
          >
            {IconLeft && (
              <IconLeft
                className={cn(iconVariants({ size, variant }), iconClassName)}
              />
            )}
            {label && (
              <span className={cn(labelVariants({ size }))}>{label}</span>
            )}
            {IconRight && (
              <IconRight
                className={cn(iconVariants({ size, variant }), iconClassName)}
              />
            )}
          </span>
        ) : (
          (buttonProps as React.HTMLAttributes<HTMLButtonElement>).children
        )}

        {/* Loading spinner - positioned absolutely */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ButtonSpinner size={size} variant={variant || "primary"} />
          </div>
        )}
      </>
    );

    const regularButton = (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ size, variant, className, isLoading }))}
        disabled={isButtonDisabled}
        {...buttonProps}
        type={type}
        ref={ref}
      >
        {regularButtonContent}
      </Comp>
    );

    return regularButton;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
