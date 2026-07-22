'use client';

import { PageTemplate } from '@/components/layout/page-template';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
}

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <PageTemplate
      title={title}
      subtitle={subtitle}
      actions={
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      }
    >
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <Construction className="text-muted-foreground h-7 w-7" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">Coming Soon</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            This page is under construction. Check back soon for updates.
          </p>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}
