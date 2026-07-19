'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border bg-card p-4 shadow-lg transition-all animate-slide-up',
  {
    variants: {
      variant: {
        default: 'border-border',
        success: 'border-success/30 bg-success/5',
        danger: 'border-destructive/30 bg-destructive/5',
        warning: 'border-warning/30 bg-warning/5',
        info: 'border-info/30 bg-info/5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  onClose?: () => void;
  closable?: boolean;
}

const toastIcons = {
  success: CheckCircle2,
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  default: null,
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', onClose, closable = true, children, ...props }, ref) => {
    const Icon = toastIcons[variant ?? 'default'];

    return (
      <div ref={ref} role="alert" className={cn(toastVariants({ variant }), className)} {...props}>
        {Icon && (
          <Icon
            className={cn(
              'h-5 w-5 shrink-0',
              variant === 'success' && 'text-success',
              variant === 'danger' && 'text-destructive',
              variant === 'warning' && 'text-warning',
              variant === 'info' && 'text-info',
            )}
          />
        )}
        <div className="flex-1 text-sm font-medium">{children}</div>
        {closable && onClose && (
          <button
            onClick={onClose}
            className="focus:ring-ring shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
Toast.displayName = 'Toast';

const ToastContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    aria-live="polite"
    aria-label="Notifications"
    className={cn('z-toast fixed bottom-4 right-4 flex w-full max-w-sm flex-col gap-2', className)}
  >
    {children}
  </div>
);

export { Toast, ToastContainer, toastVariants };
