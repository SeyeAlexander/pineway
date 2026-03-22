"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  maxLength?: number;
}

function Textarea({ className, maxLength, value, ...props }: TextareaProps) {
  const initialLength =
    typeof value === "string"
      ? value.length
      : typeof props.defaultValue === "string"
        ? props.defaultValue.length
        : 0;
  const [valueLength, setValueLength] = React.useState(initialLength);
  const isOverCharLimit = maxLength != null && valueLength >= maxLength;

  return (
    <div className="relative w-full">
      <textarea
        data-slot="textarea"
        data-error={isOverCharLimit ? "true" : undefined}
        className={cn(
          `m-0 block w-full rounded-xl bg-white px-3 py-2.5 text-sm text-gray-800 shadow-input-rest transition-all duration-150 outline-none selection:bg-violet-200 placeholder:text-gray-400 hover:shadow-input-hover focus:shadow-input-active disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-300 disabled:placeholder:text-gray-300 data-[error=true]:shadow-input-error`,
          className,
        )}
        {...props}
        value={value}
        maxLength={maxLength}
        onChange={(e) => {
          setValueLength(e.target.value.length);
          props.onChange?.(e);
        }}
      />
    </div>
  );
}

export { Textarea };
