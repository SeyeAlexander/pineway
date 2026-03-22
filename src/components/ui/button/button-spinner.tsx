import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('animate-spin rounded-full border-[1.5px]', {
  variants: {
    variant: {
      primary: 'border-white-950/30 border-t-white-950',
      neutral: 'border-gray-400/30 border-t-gray-400',
      ghost: 'border-gray-400/30 border-t-gray-400',
      link: 'border-violet-400/30 border-t-violet-500',
      danger: 'border-white-950/30 border-t-white-950',
      dangerGhost: 'border-red-400/30 border-t-red-500',
    },
    size: {
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

type ButtonSpinnerProps = VariantProps<typeof spinnerVariants> & {
  className?: string;
};

export function ButtonSpinner({
  variant,
  size,
  className,
}: ButtonSpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ variant, size }), className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
