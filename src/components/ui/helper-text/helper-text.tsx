import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type ElementType, type ReactNode } from "react";

interface HelperTextProps {
  children: ReactNode;
  type?: "error" | "warning" | "neutral";
  icon?: ElementType;
  iconVariant?: "filled" | "outline";
  /**
   * Class to be passed to the helper text label
   */
  className?: string;
}

const helperTextVariants = cva("inline-flex items-center gap-1.5 font-normal", {
  variants: {
    type: {
      error: "text-red-500",
      warning: "text-orange-600",
      neutral: "text-gray-500",
    },
  },
  defaultVariants: {
    type: "neutral",
  },
});

function HelperText({ type, icon: Icon, children, className }: HelperTextProps) {
  return (
    <div className={cn(helperTextVariants({ type }), className)}>
      {Icon && <Icon className={`size-4.5 ${type === "neutral" ? "text-gray-400" : ""}`} />}
      <span className='text-xs '>{children}</span>
    </div>
  );
}

export { HelperText };
