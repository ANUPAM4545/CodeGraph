'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  BarChart, 
  Settings, 
  CreditCard,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../lib/auth/context';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, organization, logout } = useAuth();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Repositories', href: '/repositories', icon: Database },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
  ];

  const footerItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Billing', href: '/billing', icon: CreditCard },
  ];

  const orgDisplayName = organization?.name || 'Personal Workspace';
  const orgRoleOrPlan = organization ? 'Enterprise Plan' : 'Developer Plan';
  const userDisplayName = user?.name || user?.username || 'Authenticated Developer';
  const userEmail = user?.email || 'user@codegraph.dev';
  const avatarLetter = (userDisplayName[0] || 'A').toUpperCase();

  const isItemActive = (item: any) => {
    if (item.href === '/dashboard' && pathname === '/dashboard') return true;
    if (item.href === '/repositories' && (pathname === '/repositories' || pathname.startsWith('/repositories/'))) return true;
    if (item.href === '/analytics' && pathname.startsWith('/analytics')) return true;
    if (item.href !== '/dashboard' && item.href !== '/repositories' && pathname.startsWith(item.href)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col h-full flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center space-x-2.5 font-bold text-base tracking-tight text-foreground">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-black text-xs">
            C
          </div>
          <span>CodeGraph</span>
        </Link>
      </div>
      
      {/* Workspace / Org Switcher */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface/60 border border-border/80 hover:bg-surface transition-colors cursor-pointer shadow-2xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-xs flex-shrink-0">
              {orgDisplayName[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-tight text-foreground truncate">{orgDisplayName}</span>
              <span className="text-[10px] text-muted">{orgRoleOrPlan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(item => {
          const active = isItemActive(item);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-xs font-medium ${
                active 
                  ? 'bg-surface font-semibold text-foreground border border-border/80 shadow-2xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface/50 border border-transparent'
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-muted'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
        
        <div className="my-3 border-t border-border/80" />
        
        {footerItems.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-xs font-medium ${
                active 
                  ? 'bg-surface font-semibold text-foreground border border-border/80 shadow-2xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface/50 border border-transparent'
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-muted'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* User Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface transition-colors">
          <div className="flex items-center space-x-2.5 min-w-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={userDisplayName} className="w-7 h-7 rounded-full object-cover shrink-0 border border-border" />
            ) : (
              <div className="w-7 h-7 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-xs flex-shrink-0">
                {avatarLetter}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium leading-tight text-foreground truncate">{userDisplayName}</span>
              <span className="text-[10px] text-muted truncate">{userEmail}</span>
            </div>
          </div>
          
          <button 
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-muted hover:text-red-600 rounded hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
