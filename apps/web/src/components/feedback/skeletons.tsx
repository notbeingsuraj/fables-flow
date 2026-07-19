import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Table row skeleton for loading states. */
export function TableRowSkeleton({
  columns = 5,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center space-x-4 p-4', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/** Card skeleton. */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-card border-border bg-card border p-6', className)}>
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

/** Stat card skeleton. */
export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-card border-border bg-card border p-6', className)}>
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/** Table skeleton with header and rows. */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('rounded-card border-border bg-card border', className)}>
      {/* Header */}
      <div className="border-border flex items-center space-x-4 border-b p-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton
          key={i}
          columns={columns}
          className={i < rows - 1 ? 'border-border border-b' : ''}
        />
      ))}
    </div>
  );
}

/** Page header skeleton. */
export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}

/** Chart skeleton. */
export function ChartSkeleton({
  height = 300,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn('rounded-card border-border bg-card border p-6', className)}>
      <Skeleton className="mb-4 h-5 w-32" />
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
}
