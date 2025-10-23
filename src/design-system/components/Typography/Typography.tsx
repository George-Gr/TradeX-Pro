import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../src/lib/utils';

const headingVariants = cva('tracking-tight', {
  variants: {
    size: {
      h1: 'text-4xl font-extrabold lg:text-5xl',
      h2: 'text-3xl font-semibold lg:text-4xl',
      h3: 'text-2xl font-semibold lg:text-3xl',
      h4: 'text-xl font-semibold lg:text-2xl',
      h5: 'text-lg font-semibold lg:text-xl',
      h6: 'text-base font-semibold lg:text-lg',
    },
  },
  defaultVariants: {
    size: 'h1',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, as = 'h1', ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size: size || as, className }))}
        {...props}
      />
    );
  }
);

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    variant: {
      default: 'text-neutral-950',
      muted: 'text-neutral-500',
      success: 'text-success-500',
      error: 'text-error-500',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    variant: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, variant, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(textVariants({ size, weight, variant, className }))} {...props} />
    );
  }
);
