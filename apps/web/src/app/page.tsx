'use client';

import { AppShell } from '@/components/layout/app-shell';
import { PageTemplate } from '@/components/layout/page-template';
import { StatsCard } from '@/components/data/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatCardSkeleton } from '@/components/feedback/skeletons';
import { ShoppingCart, Package, Users, BarChart3, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <AppShell user={{ name: 'Suraj Kumar', email: 'suraj@fablesflow.com' }}>
      <PageTemplate
        title="Dashboard"
        subtitle="Welcome back. Here's what's happening today."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Order
          </Button>
        }
      >
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="₹12.4L"
            trend={{ value: 12.5, direction: 'up' }}
            description="vs last month"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatsCard
            title="Orders"
            value="342"
            trend={{ value: 8.2, direction: 'up' }}
            description="vs last month"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <StatsCard
            title="Inventory Items"
            value="1,247"
            trend={{ value: 2.1, direction: 'down' }}
            description="vs last month"
            icon={<Package className="h-4 w-4" />}
          />
          <StatsCard
            title="Active Contacts"
            value="89"
            trend={{ value: 0, direction: 'neutral' }}
            description="no change"
            icon={<Users className="h-4 w-4" />}
          />
        </div>

        <Separator />

        {/* Content Cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your distributors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Raj Traders', amount: '₹45,200', status: 'Delivered' as const },
                  { name: 'Patel & Sons', amount: '₹28,900', status: 'In Transit' as const },
                  { name: 'Gupta Enterprises', amount: '₹67,100', status: 'Processing' as const },
                  { name: 'Sharma Distributors', amount: '₹15,400', status: 'Pending' as const },
                ].map((order) => (
                  <div key={order.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{order.name}</p>
                      <p className="text-muted-foreground text-xs font-medium">{order.amount}</p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'Delivered'
                          ? 'success'
                          : order.status === 'In Transit'
                            ? 'info'
                            : order.status === 'Processing'
                              ? 'warning'
                              : 'secondary'
                      }
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {[
                  { label: 'Create New Order', href: '/orders', icon: ShoppingCart },
                  { label: 'Update Inventory', href: '/inventory', icon: Package },
                  { label: 'Add New Contact', href: '/retailers', icon: Users },
                  { label: 'View Reports', href: '/reports', icon: BarChart3 },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <Button variant="outline" className="h-10 w-full justify-start">
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skeleton Preview */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Loading States Preview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>
      </PageTemplate>
    </AppShell>
  );
}
