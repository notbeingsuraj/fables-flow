'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarDefaultCollapsed?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSearch?: () => void;
  onCommandPalette?: () => void;
  className?: string;
}

export function AppShell({
  children,
  sidebar,
  sidebarDefaultCollapsed = false,
  user,
  onSearch,
  onCommandPalette,
  className,
}: AppShellProps) {
  return (
    <SidebarProvider defaultCollapsed={sidebarDefaultCollapsed}>
      <div className={cn('flex h-screen overflow-hidden', className)}>
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <SidebarInset>
          <TopNav user={user} onSearch={onSearch} onCommandPalette={onCommandPalette} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
