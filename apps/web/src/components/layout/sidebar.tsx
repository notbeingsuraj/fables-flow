'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const toggle = React.useCallback(() => setCollapsed((c) => !c), []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed, children, ...props }, ref) => {
    const sidebarContext = React.useContext(SidebarContext);
    const isCollapsed = collapsed ?? sidebarContext?.collapsed ?? false;

    return (
      <aside
        ref={ref}
        className={cn(
          'border-sidebar-border bg-sidebar text-sidebar-foreground ease-smooth relative flex h-screen flex-col border-r transition-all duration-300',
          isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
          className,
        )}
        data-collapsed={isCollapsed}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 px-4 py-4', className)} {...props} />
  ),
);
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <ScrollArea className="flex-1 px-3">
      <div ref={ref} className={cn('space-y-1', className)} {...props} />
    </ScrollArea>
  ),
);
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-sidebar-border mt-auto border-t px-3 py-3', className)}
      {...props}
    />
  ),
);
SidebarFooter.displayName = 'SidebarFooter';

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('py-2', className)} {...props}>
      {label && (
        <p className="text-muted-foreground mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest">
          {label}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  ),
);
SidebarGroup.displayName = 'SidebarGroup';

interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
}

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, href, icon, active, badge, children, ...props }, ref) => {
    const sidebarContext = React.useContext(SidebarContext);
    const isCollapsed = sidebarContext?.collapsed ?? false;

    const content = (
      <Link
        ref={ref}
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          active && 'bg-sidebar-accent text-sidebar-accent-foreground',
          !active && 'text-sidebar-foreground/70',
          isCollapsed && 'justify-center px-0',
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>}
        {!isCollapsed && <span className="flex-1 truncate">{children}</span>}
        {!isCollapsed && badge && <span className="ml-auto shrink-0">{badge}</span>}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{children}</TooltipContent>
        </Tooltip>
      );
    }

    return content;
  },
);
SidebarItem.displayName = 'SidebarItem';

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, ...props }, ref) => {
    const sidebarContext = React.useContext(SidebarContext);
    const Icon = sidebarContext?.collapsed ? ChevronRight : ChevronLeft;

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon-sm"
        onClick={sidebarContext?.toggle}
        className={cn('', className)}
        aria-label={sidebarContext?.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        {...props}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  },
);
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-1 flex-col overflow-hidden', className)} {...props} />
  ),
);
SidebarInset.displayName = 'SidebarInset';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarTrigger,
  SidebarInset,
};
