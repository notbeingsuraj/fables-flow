import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, suffix, disabled, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {icon && (
          <div className="text-muted-foreground pointer-events-none absolute left-3 flex items-center [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'border-border bg-background shadow-xs flex h-9 w-full rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
            'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-9',
            suffix && 'pr-9',
            error && 'border-destructive focus-visible:ring-destructive/30',
            className,
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="text-muted-foreground absolute right-3 flex items-center [&_svg]:h-4 [&_svg]:w-4">
            {suffix}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
