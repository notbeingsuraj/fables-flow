import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ErrorPageProps {
  code: number;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

function ErrorPage({ code, title, description, action, className }: ErrorPageProps) {
  return (
    <div
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center px-4 text-center',
        className,
      )}
    >
      <p className="text-muted-foreground/30 text-7xl font-bold tracking-tighter">{code}</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm font-medium">{description}</p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}

export function NotFound({ className }: { className?: string }) {
  return (
    <ErrorPage
      code={404}
      title="Page not found"
      description="The page you are looking for does not exist or has been moved."
      action={{ label: 'Go Home', href: '/' }}
      className={className}
    />
  );
}

export function ServerError({ className }: { className?: string }) {
  return (
    <ErrorPage
      code={500}
      title="Internal server error"
      description="Something went wrong on our end. Please try again later."
      action={{ label: 'Try Again', onClick: () => window.location.reload() }}
      className={className}
    />
  );
}

export function Unauthorized({ className }: { className?: string }) {
  return (
    <ErrorPage
      code={403}
      title="Access denied"
      description="You do not have permission to access this page."
      action={{ label: 'Go Home', href: '/' }}
      className={className}
    />
  );
}
