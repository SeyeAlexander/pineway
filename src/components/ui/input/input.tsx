"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Cross, Eye, EyeClosed } from "lucide-react";
import { Button } from "../button/button";

interface InputProps extends Omit<React.ComponentPropsWithRef<"input">, "size" | "value"> {
  /**
   * The controlled value of the input.
   * Accepts null to support nullable database fields from Drizzle ORM.
   */
  value?: string | number | readonly string[] | null | undefined;
  "data-error"?: string;
  disabled?: boolean;
  size?: "base" | "sm";
  /**
   * Icon to be displayed at the start of the input (left side from RTL)
   */
  iconLeading?: React.ElementType;
  iconTrailing?: React.ElementType;
  /**
   * Custom element to be displayed at the end of the input (right side from RTL)
   * This takes precedence over iconTrailing, showClearInput, and showPasswordViewToggle
   */
  trailingElement?: React.ReactNode;
  staticContent?: {
    text?: string;
    symbol?: string;
  };
  withCurrency?: boolean;
  showClearInput?: boolean;
  showPasswordViewToggle?: boolean;
  onPasswordViewToggleClick?: () => void;
  showKbdShortcut?: boolean;
  /**
   * Text explaining what the user is expected to enter into this input
   */
  helperText?: string;
  /**
   * Input type
   */
  type?: React.HTMLInputTypeAttribute;
}

const inputVariants = cva(
  `flex items-center gap-1.5 self-stretch bg-white text-gray-800 shadow-input-rest transition-all duration-150 outline-none w-full
  placeholder:text-gray-400
  hover:shadow-input-hover
  focus:shadow-input-active
  data-[error=true]:shadow-input-error
  disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-400 disabled:placeholder:text-gray-300
  selection:bg-violet-200
  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`,
  {
    variants: {
      size: {
        base: "rounded-xl px-3 h-10 text-sm",
        sm: "rounded-[8px] px-2.5 h-8 text-xs",
      },
      iconLeading: {
        false: null,
        true: "",
      },
      iconTrailing: {
        false: null,
        true: "",
      },
    },
    compoundVariants: [
      { size: "base", iconLeading: true, class: "ps-8" },
      { size: "sm", iconLeading: true, class: "ps-7" },
      { size: "base", iconTrailing: true, class: "pe-8" },
      { size: "sm", iconTrailing: true, class: "pe-7" },
    ],
    defaultVariants: {
      size: "base",
    },
  },
);

function Input({
  className,
  type,
  size = "base",
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  trailingElement,
  showClearInput,
  showPasswordViewToggle,
  onPasswordViewToggleClick,
  staticContent,
  maxLength,
  value,
  ...props
}: InputProps) {
  const initialLength =
    typeof value === "string"
      ? value.length
      : typeof props.defaultValue === "string"
        ? props.defaultValue.length
        : 0;
  const [valueLength, setValueLength] = React.useState(initialLength);
  const isOverCharLimit = maxLength != null && valueLength >= maxLength;

  React.useEffect(() => {
    if (typeof value === "string") {
      setValueLength(value.length);
    }
  }, [value]);

  const leadingContentAreaRef = React.useRef<HTMLDivElement>(null);
  const trailingContentAreaRef = React.useRef<HTMLDivElement>(null);
  const [paddingStart, setPaddingStart] = React.useState(size === "sm" ? 10 : 12);
  const [paddingEnd, setPaddingEnd] = React.useState(size === "sm" ? 10 : 12);

  const hasIconLeading = !!IconLeading;
  const hasIconTrailing = !!IconTrailing;

  const showTrailingContentArea =
    !!trailingElement || hasIconTrailing || showClearInput || showPasswordViewToggle;

  React.useEffect(() => {
    setPaddingStart(size === "sm" ? 10 : 12);
    setPaddingEnd(size === "sm" ? 10 : 12);
  }, [size]);

  React.useEffect(() => {
    if (leadingContentAreaRef.current) {
      const width = leadingContentAreaRef.current.offsetWidth;
      setPaddingStart(width);
    }
  }, [size, staticContent, IconLeading]);

  React.useEffect(() => {
    if (trailingContentAreaRef.current) {
      const width = trailingContentAreaRef.current.offsetWidth;
      setPaddingEnd(width);
    }
  }, [trailingElement, IconTrailing, showClearInput, showPasswordViewToggle, size]);

  return (
    <div className='relative w-full flex items-center'>
      {(hasIconLeading || staticContent) && (
        <div
          ref={leadingContentAreaRef}
          className='pointer-events-none absolute left-0 flex items-center pl-3 gap-2 text-gray-400 h-full'
        >
          {hasIconLeading && <IconLeading className='size-4' />}
          {staticContent?.text && (
            <div className='flex items-center gap-2 pr-2'>
              <span className='text-sm tracking-wide'>{staticContent.text}</span>
              <div className='h-6 w-[1px] bg-gray-300' />
            </div>
          )}
        </div>
      )}
      <input
        type={type}
        maxLength={maxLength}
        data-slot='input'
        data-error={isOverCharLimit ? "true" : undefined}
        className={cn(
          inputVariants({
            size,
            iconLeading: hasIconLeading,
            iconTrailing: hasIconTrailing,
            className,
          }),
        )}
        style={{
          paddingInlineStart: `${paddingStart}px`,
          paddingInlineEnd: `${paddingEnd}px`,
        }}
        {...props}
        value={value ?? undefined}
        onChange={(e) => {
          setValueLength(e.target.value.length);
          props.onChange?.(e);
        }}
      />

      {showTrailingContentArea && (
        <div
          ref={trailingContentAreaRef}
          className='absolute top-0 right-0 bottom-0 my-auto mr-0.5 inline-flex items-center gap-2'
        >
          {trailingElement ? (
            trailingElement
          ) : (
            <>
              {hasIconTrailing && <IconTrailing className='mr-2 size-4' />}
              {showClearInput && (
                <Button
                  type='button'
                  disabled={props.disabled}
                  iconOnly
                  iconLeft={Cross}
                  size='sm'
                  variant='ghost'
                  className='m-1 rounded-full text-gray-500'
                />
              )}
              {showPasswordViewToggle && (
                <Button
                  type='button'
                  onClick={onPasswordViewToggleClick}
                  disabled={props.disabled}
                  iconOnly
                  iconLeft={type === "password" ? Eye : EyeClosed}
                  size='sm'
                  variant='ghost'
                  className='m-1 rounded-full text-gray-500'
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export { Input };
