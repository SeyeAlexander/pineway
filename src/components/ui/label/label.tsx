"use client";

import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import * as React from "react";

export interface CustomLabelProps
  extends React.ComponentPropsWithRef<typeof LabelPrimitive.Root> {
  children: string;
  visuallyHidden?: boolean;
  showOptionalLabel?: boolean;
  description?: string;
  required?: boolean;
  size?: "default" | "sm";
}

const labelVariants = cva(
  `
  select-none font-medium w-full
  group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50
  peer-disabled:cursor-not-allowed peer-disabled:opacity-50
`,
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function DisplayedLabel({
  children,
  showOptionalLabel,
  required,
  description,
}: Pick<
  CustomLabelProps,
  "children" | "showOptionalLabel" | "required" | "description"
>) {
  return (
    <span className="inline-flex w-full flex-col">
      <span className="inline-flex items-center gap-1">
        {children}
        {required && (
          <span className="text-red-500" aria-label="This is a required field">
            *
          </span>
        )}
      </span>
      {description && (
        <span className="text-sm font-normal text-gray-500">{description}</span>
      )}
    </span>
  );
}
function Label({
  className,
  size = "default",
  children,
  visuallyHidden,
  showOptionalLabel,
  required,
  description,
  ...props
}: CustomLabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants({ size }), className)}
      {...props}
    >
      {visuallyHidden ? (
        <span className="sr-only">{children}</span>
      ) : (
        <DisplayedLabel
          showOptionalLabel={showOptionalLabel}
          required={required}
          description={description}
        >
          {children}
        </DisplayedLabel>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
