'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { CommandMenu } from '../ui/CommandMenu';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isUniverse = pathname?.includes('/universe');

  if (isUniverse) {
    return (
      <div className="w-screen h-screen bg-background overflow-hidden text-foreground">
        {children}
        <CommandMenu />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
      <CommandMenu />
    </div>
  );
}
