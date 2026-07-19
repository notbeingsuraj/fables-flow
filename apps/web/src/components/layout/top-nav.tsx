'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SizedAvatar } from '@/components/ui/avatar';
import { Bell, Search, Settings, LogOut, User, Command } from 'lucide-react';
import { SidebarTrigger } from '@/components/layout/sidebar';

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  onSearch?: () => void;
  onCommandPalette?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  ({ className, onSearch, onCommandPalette, user, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'z-sticky border-border bg-background/80 sticky top-0 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-md lg:px-6',
        className,
      )}
      {...props}
    >
      <SidebarTrigger className="lg:hidden" />

      <Separator orientation="vertical" className="h-6 lg:hidden" />

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
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCommandPalette}
          className="hidden md:flex"
          aria-label="Open command palette"
        >
          <Command className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="User menu">
              <SizedAvatar size="sm" name={user?.name ?? 'U'} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user?.name ?? 'User'}</p>
                <p className="text-muted-foreground text-xs font-medium">
                  {user?.email ?? 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  ),
);
TopNav.displayName = 'TopNav';

export { TopNav };
