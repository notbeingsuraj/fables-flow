import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95 active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/90 active:scale-[0.98]',
        outline:
          'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.98]',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        danger:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95 active:scale-[0.98]',
        success:
          'bg-success text-success-foreground shadow-sm hover:bg-success/90 active:bg-success/95 active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-7 rounded-[10px] px-2.5 text-[11px] gap-1 [&_svg]:size-3',
        sm: 'h-8 rounded-[11px] px-3 text-xs gap-1.5 [&_svg]:size-3.5',
        md: 'h-9 rounded-btn px-4 text-sm gap-2 [&_svg]:size-4',
        lg: 'h-10 rounded-btn px-5 text-sm gap-2 [&_svg]:size-4',
        xl: 'h-11 rounded-btn px-6 text-base gap-2.5 [&_svg]:size-4.5',
        icon: 'h-9 w-9 rounded-btn [&_svg]:size-4',
        'icon-sm': 'h-8 w-8 rounded-[11px] [&_svg]:size-3.5',
        'icon-lg': 'h-10 w-10 rounded-btn [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
