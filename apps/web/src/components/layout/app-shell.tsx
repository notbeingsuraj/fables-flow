'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  DefaultSidebar,
} from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';
import { CommandPalette } from '@/components/layout/command-palette';
import { UtilityPanel } from '@/components/layout/utility-panel';
import { Footer } from '@/components/layout/footer';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarDefaultCollapsed?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  className?: string;
}

function AppShellInner({
  children,
  user,
  sidebar,
  className,
}: Omit<AppShellProps, 'sidebarDefaultCollapsed'>) {
  const [utilityPanelOpen, setUtilityPanelOpen] = React.useState(false);

  return (
    <div className={cn('flex h-screen overflow-hidden', className)}>
      {sidebar ? <Sidebar>{sidebar}</Sidebar> : <DefaultSidebar />}
      <SidebarInset>
        <TopNav
          user={user}
          onCommandPalette={() => {
            // CommandPalette manages its own open state via ⌘K
            // Dispatch a keyboard event to toggle it
            document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
              }),
            );
          }}
          onUtilityPanel={() => setUtilityPanelOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
          <Footer />
        </main>
      </SidebarInset>

      <CommandPalette />
      <UtilityPanel open={utilityPanelOpen} onOpenChange={setUtilityPanelOpen} />
    </div>
  );
}

export function AppShell({
  children,
  sidebarDefaultCollapsed = false,
  user,
  sidebar,
  className,
}: AppShellProps) {
  return (
    <SidebarProvider defaultCollapsed={sidebarDefaultCollapsed}>
      <AppShellInner user={user} sidebar={sidebar} className={className}>
        {children}
      </AppShellInner>
    </SidebarProvider>
  );
}
