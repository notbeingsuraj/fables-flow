import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
  ...props
}: StatsCardProps) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-semibold">{title}</CardTitle>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1.5">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold',
                trend.direction === 'up' && 'text-success',
                trend.direction === 'down' && 'text-destructive',
                trend.direction === 'neutral' && 'text-muted-foreground',
              )}
            >
              {trend.direction === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {trend.direction === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {trend.direction === 'neutral' && <Minus className="h-3 w-3" />}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <p className="text-muted-foreground text-xs font-medium">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
