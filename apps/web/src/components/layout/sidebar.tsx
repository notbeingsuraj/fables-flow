'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { mainNavGroups, type NavGroup } from '@/lib/navigation';

/* ------------------------------------------------------------------ */
/*  Sidebar Context                                                    */
/* ------------------------------------------------------------------ */

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
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
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    'ff-sidebar-collapsed',
    defaultCollapsed,
  );
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const toggle = React.useCallback(() => setCollapsed((c) => !c), [setCollapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle, mobileOpen, setMobileOpen }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar root                                                       */
/* ------------------------------------------------------------------ */

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  navGroups?: NavGroup[];
  activeHref?: string;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed, children, ...props }, ref) => {
    const sidebarContext = React.useContext(SidebarContext);
    const isCollapsed = collapsed ?? sidebarContext?.collapsed ?? false;

    const content = (
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

    return content;
  },
);
Sidebar.displayName = 'Sidebar';

/* ------------------------------------------------------------------ */
/*  Sidebar building blocks                                            */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  SidebarGroup & SidebarItem                                         */
/* ------------------------------------------------------------------ */

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
  disabled?: boolean;
}

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, href, icon, active, badge, disabled, children, ...props }, ref) => {
    const sidebarContext = React.useContext(SidebarContext);
    const isCollapsed = sidebarContext?.collapsed ?? false;

    const content = (
      <Link
        ref={ref}
        href={disabled ? '#' : href}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
          active && 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold',
          !active && 'text-sidebar-foreground/70',
          isCollapsed && 'justify-center px-0',
          disabled && 'pointer-events-none opacity-50',
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

/* ------------------------------------------------------------------ */
/*  SidebarTrigger & SidebarInset                                      */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  DefaultSidebar – full sidebar with nav from config                 */
/* ------------------------------------------------------------------ */

interface DefaultSidebarProps {
  navGroups?: NavGroup[];
}

function DefaultSidebar({ navGroups = mainNavGroups }: DefaultSidebarProps) {
  const pathname = usePathname();
  const sidebarContext = React.useContext(SidebarContext);
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const isCollapsed = sidebarContext?.collapsed ?? false;

  const sidebarNav = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
            FF
          </div>
          {!isCollapsed && <span className="text-sm font-bold tracking-tight">Fables Flow</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group, gi) => (
          <SidebarGroup key={gi} label={group.label}>
            {group.items.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={<item.icon />}
                active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                badge={
                  item.badge ? (
                    <Badge variant="info" size="sm">
                      {item.badge}
                    </Badge>
                  ) : undefined
                }
                disabled={item.disabled}
              >
                {item.label}
              </SidebarItem>
            ))}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {!isCollapsed && <p className="text-muted-foreground text-center text-[10px]">v1.0.0</p>}
      </SidebarFooter>
    </>
  );

  // Mobile: floating drawer via Sheet
  if (isMobile) {
    return (
      <Sheet open={sidebarContext?.mobileOpen} onOpenChange={sidebarContext?.setMobileOpen}>
        <SheetContent side="left" className="w-sidebar p-0">
          <Sidebar>{sidebarNav}</Sidebar>
        </SheetContent>
      </Sheet>
    );
  }

  return <Sidebar>{sidebarNav}</Sidebar>;
}

export {
  DefaultSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarTrigger,
  SidebarInset,
};
