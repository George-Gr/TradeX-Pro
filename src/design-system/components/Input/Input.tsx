import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../src/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
      variant: {
        default: 'border-neutral-200',
        error: 'border-error-500 focus-visible:ring-error-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            size,
            variant: error ? 'error' : 'default',
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
