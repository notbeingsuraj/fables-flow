'use client';

import * as React from 'react';

export function Footer() {
  return (
    <footer className="bg-background border-t px-6 py-3">
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>© {new Date().getFullYear()} Fables Flow. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
