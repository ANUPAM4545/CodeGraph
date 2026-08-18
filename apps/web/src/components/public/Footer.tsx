import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xs">
                C
              </div>
              <span className="font-bold">CodeGraph</span>
            </div>
            <p className="text-sm text-muted max-w-xs">
              Transforming repositories into intelligent architectural maps using knowledge graphs, AI reasoning, and immersive visualization.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-sm text-muted hover:text-foreground">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted hover:text-foreground">Pricing</Link></li>
              <li><Link href="/changelog" className="text-sm text-muted hover:text-foreground">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/docs" className="text-sm text-muted hover:text-foreground">Documentation</Link></li>
              <li><Link href="/security" className="text-sm text-muted hover:text-foreground">Security</Link></li>
              <li><Link href="/about" className="text-sm text-muted hover:text-foreground">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} CodeGraph Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-muted hover:text-foreground">Privacy</Link>
            <Link href="#" className="text-xs text-muted hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
