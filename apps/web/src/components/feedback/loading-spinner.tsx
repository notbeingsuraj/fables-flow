import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return <Loader2 className={cn('text-primary animate-spin', spinnerSizes[size], className)} />;
}

/** Full-page loading overlay. */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-full w-full items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse-subtle text-sm font-medium">Loading…</p>
      </div>
    </div>
  );
}
