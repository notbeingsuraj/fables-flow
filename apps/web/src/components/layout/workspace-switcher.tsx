'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { SizedAvatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check, Plus } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  plan: string;
}

const defaultWorkspaces: Workspace[] = [
  { id: '1', name: 'Fables Flow', plan: 'Enterprise' },
  { id: '2', name: 'Demo Workspace', plan: 'Free' },
];

export function WorkspaceSwitcher() {
  const [workspaces] = React.useState<Workspace[]>(defaultWorkspaces);
  const [current, setCurrent] = React.useState<Workspace>(defaultWorkspaces[0] as Workspace);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-sm font-semibold">
          <SizedAvatar size="xs" name={current.name} />
          <span className="hidden max-w-[120px] truncate lg:inline">{current.name}</span>
          <ChevronDown className="text-muted-foreground h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((ws) => (
          <DropdownMenuItem key={ws.id} onClick={() => setCurrent(ws)} className="gap-2">
            <SizedAvatar size="xs" name={ws.name} />
            <div className="flex-1">
              <p className="text-sm font-medium">{ws.name}</p>
              <p className="text-muted-foreground text-xs">{ws.plan}</p>
            </div>
            {ws.id === current.id && <Check className="text-primary h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-muted-foreground gap-2">
          <Plus className="h-4 w-4" />
          Create Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
