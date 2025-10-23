import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../src/lib/utils';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
      auto: 'grid-cols-auto',
    },
    gap: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    responsive: {
      true: 'md:grid-cols-2 lg:grid-cols-3',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 'md',
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  children: React.ReactNode;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, responsive, children, ...props }, ref) => {
    return (
      <div className={cn(gridVariants({ cols, gap, responsive, className }))} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);
