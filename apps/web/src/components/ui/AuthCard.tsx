import React from 'react';
import { Card, CardContent } from './Card';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, footerText, footerLinkText, footerLinkHref, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-primary text-primary-foreground font-bold flex items-center justify-center rounded-lg mx-auto mb-4">
            C
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        
        <Card className="shadow-lg border-border">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted">
          {footerText}{' '}
          <Link href={footerLinkHref} className="text-foreground font-medium hover:underline">
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
