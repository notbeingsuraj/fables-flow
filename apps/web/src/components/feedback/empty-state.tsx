import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Inbox, SearchX, WifiOff, FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-4 py-16 text-center', className)}
    >
      <div className="bg-muted mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        {icon ?? <Inbox className="text-muted-foreground h-7 w-7" />}
      </div>
      <h3 className="text-foreground text-base font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm font-medium">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-5" size="md">
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

/** No search results state. */
export function NoSearchResults({ query, className }: { query?: string; className?: string }) {
  return (
    <EmptyState
      icon={<SearchX className="text-muted-foreground h-7 w-7" />}
      title="No results found"
      description={
        query
          ? `No results for "${query}". Try a different search term.`
          : 'No results found. Try a different search term.'
      }
      className={className}
    />
  );
}

/** No internet connection state. */
export function NoInternet({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <EmptyState
      icon={<WifiOff className="text-muted-foreground h-7 w-7" />}
      title="No internet connection"
      description="Please check your network connection and try again."
      action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
      className={className}
    />
  );
}

/** No data state. */
export function NoData({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<FileText className="text-muted-foreground h-7 w-7" />}
      title="No data available"
      description="There is no data to display at the moment."
      className={className}
    />
  );
}
