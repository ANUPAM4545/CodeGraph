'use client';

import React, { useState } from 'react';
import { AuthCard } from '../../../components/ui/AuthCard';
import { OAuthButton } from '../../../components/ui/OAuthButton';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { authService } from '../../../lib/auth/authService';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    authService.loginWithGithub();
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to CodeGraph to access your workspaces."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/signup"
    >
      <div className="space-y-4">
        <OAuthButton provider="github" onClick={handleLogin} isLoading={isLoading} />
        
        <Link href="/dashboard" className="block">
          <Button variant="outline" className="w-full gap-2 text-xs font-semibold h-10 shadow-2xs">
            <LayoutDashboard className="w-4 h-4 text-muted" />
            <span>Continue to Dashboard (Demo Workspace)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted" />
          </Button>
        </Link>
        
        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted">Enterprise Single Sign-On</span>
          </div>
        </div>
        
        <p className="text-xs text-center text-muted">
          SSO login is available for Enterprise customers. <br/>
          <a href="#" className="underline hover:text-foreground">Contact support</a> to configure SAML.
        </p>
      </div>
    </AuthCard>
  );
}
