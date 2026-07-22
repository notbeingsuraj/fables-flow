'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = React.useMemo(() => generateBreadcrumbs(pathname), [pathname]);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.href}>
            {i > 0 && <ChevronRight className="text-muted-foreground/50 h-3 w-3 shrink-0" />}
            {isLast ? (
              <span className="text-foreground max-w-[140px] truncate font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className={cn(
                  'text-muted-foreground hover:text-foreground max-w-[140px] truncate font-medium transition-colors',
                )}
              >
                {i === 0 ? <Home className="h-3.5 w-3.5" /> : crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
