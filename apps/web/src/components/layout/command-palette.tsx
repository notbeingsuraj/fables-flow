'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command';
import { getCommandActions, type CommandAction } from '@/lib/navigation';
import { useRecentSearches } from '@/hooks/use-recent-searches';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { searches, addSearch } = useRecentSearches();
  const allActions = React.useMemo(() => getCommandActions(), []);

  // Global keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = React.useCallback(
    (action: CommandAction) => {
      setOpen(false);
      if (action.id === 'action-theme') {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
        return;
      }
      if (action.href) {
        addSearch(action.label);
        router.push(action.href);
      }
    },
    [router, setTheme, addSearch],
  );

  const navigationActions = allActions.filter((a) => a.category === 'Navigation');
  const actionItems = allActions.filter((a) => a.category === 'Action');
  const settingItems = allActions.filter((a) => a.category === 'Setting');

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions, settings…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {searches.length > 0 && (
          <CommandGroup heading="Recent">
            {searches.map((term) => (
              <CommandItem key={term} onSelect={() => {}}>
                {term}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Navigation">
          {navigationActions.map((action) => (
            <CommandItem key={action.id} onSelect={() => handleSelect(action)}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions">
          {actionItems.map((action) => (
            <CommandItem key={action.id} onSelect={() => handleSelect(action)}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
              {action.shortcut && <CommandShortcut>{action.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Settings">
          {settingItems.map((action) => (
            <CommandItem key={action.id} onSelect={() => handleSelect(action)}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
              {action.shortcut && <CommandShortcut>{action.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Trigger button for command palette – rendered inside the top-nav */
export function CommandTrigger({
  onClick: _onClick,
  className: _className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return null;
}
