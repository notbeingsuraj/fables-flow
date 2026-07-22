'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Bot, Send } from 'lucide-react';

interface UtilityPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UtilityPanel({ open, onOpenChange }: UtilityPanelProps) {
  const [message, setMessage] = React.useState('');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] p-0 sm:w-[440px]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-4 w-4" />
              <SheetTitle className="text-sm font-semibold">AI Assistant</SheetTitle>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Bot className="text-primary h-6 w-6" />
              </div>
              <p className="text-foreground text-sm font-semibold">How can I help?</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Ask about orders, inventory, payments, or analytics.
              </p>
            </div>
          </ScrollArea>

          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything…"
                className="bg-background placeholder:text-muted-foreground focus:ring-ring flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    setMessage('');
                  }
                }}
              />
              <Button
                size="icon-sm"
                disabled={!message.trim()}
                onClick={() => setMessage('')}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
