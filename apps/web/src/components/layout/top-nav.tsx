'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Sparkles, Command } from 'lucide-react';
import { SidebarTrigger } from '@/components/layout/sidebar';
import { NotificationCenter } from '@/components/layout/notification-center';
import { ProfileMenu } from '@/components/layout/profile-menu';
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  onSearch?: () => void;
  onCommandPalette?: () => void;
  onUtilityPanel?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  ({ className, onSearch, onCommandPalette, onUtilityPanel, user, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'z-sticky border-border bg-background/80 sticky top-0 flex h-16 flex-col border-b backdrop-blur-md',
        className,
      )}
      {...props}
    >
      {/* Main row */}
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <SidebarTrigger className="lg:hidden" />

        <Separator orientation="vertical" className="h-6 lg:hidden" />

        <WorkspaceSwitcher />

        <Separator orientation="vertical" className="mx-1 hidden h-6 md:block" />

        {/* Search trigger */}
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground hidden h-9 w-64 justify-start gap-2 md:flex"
          onClick={onSearch ?? onCommandPalette}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm font-medium">Search…</span>
          <kbd className="border-border bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium">
            <Command className="h-3 w-3" />K
          </kbd>
        </Button>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Quick Create */}
          <Button
            variant="primary"
            size="sm"
            className="hidden h-8 gap-1.5 px-3 sm:flex"
            aria-label="Create new"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden text-xs font-semibold lg:inline">New</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCommandPalette}
            className="hidden md:flex"
            aria-label="Open command palette"
          >
            <Command className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onUtilityPanel}
            className="hidden md:flex"
            aria-label="AI Assistant"
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <NotificationCenter />

          <Separator orientation="vertical" className="mx-1 h-6" />

          <ProfileMenu user={user} />
        </div>
      </div>

      {/* Breadcrumb row – only visible on inner pages */}
      <div className="hidden h-8 items-center border-t px-4 lg:flex lg:px-6">
        <Breadcrumbs />
      </div>
    </header>
  ),
);
TopNav.displayName = 'TopNav';

export { TopNav };
