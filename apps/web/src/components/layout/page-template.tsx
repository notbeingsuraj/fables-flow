'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageTemplate({
  title,
  subtitle,
  actions,
  filters,
  children,
  className,
}: PageTemplateProps) {
  return (
    <div className={cn('space-y-6 p-6', className)}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm font-medium">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      {/* Filters */}
      {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}

      {/* Content */}
      {children}
    </div>
  );
}
