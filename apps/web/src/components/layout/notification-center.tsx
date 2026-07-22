'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Bell, Check, CheckCheck, Inbox } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New order received',
    description: 'Raj Traders placed order #ORD-1234',
    time: '2 min ago',
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Payment confirmed',
    description: '₹45,200 received from Patel & Sons',
    time: '15 min ago',
    read: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'Low stock alert',
    description: 'Product SKU-100 is below threshold',
    time: '1 hour ago',
    read: false,
    type: 'warning',
  },
  {
    id: '4',
    title: 'Invoice generated',
    description: 'Invoice #INV-567 for Sharma Dist.',
    time: '3 hours ago',
    read: true,
    type: 'info',
  },
  {
    id: '5',
    title: 'Order dispatched',
    description: 'Order #ORD-1230 shipped via BlueDart',
    time: 'Yesterday',
    read: true,
    type: 'success',
  },
];

type Tab = 'all' | 'unread';

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [tab, setTab] = React.useState<Tab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = tab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="danger"
              size="sm"
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center px-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-medium"
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <div className="flex gap-1 px-2 py-2">
          {(['all', 'unread'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors',
                tab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Inbox className="text-muted-foreground/50 mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm font-medium">No notifications</p>
            </div>
          ) : (
            <div className="divide-border divide-y">
              {filtered.map((n) => (
                <button
                  key={n.id}
                  className={cn(
                    'hover:bg-accent/50 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                    !n.read && 'bg-primary/5',
                  )}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                    );
                  }}
                >
                  <div className="mt-0.5">
                    {!n.read ? (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    ) : (
                      <Check className="text-muted-foreground h-3 w-3" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm font-medium', !n.read && 'font-semibold')}>
                      {n.title}
                    </p>
                    <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                      {n.description}
                    </p>
                    <p className="text-muted-foreground mt-1 text-[10px]">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
