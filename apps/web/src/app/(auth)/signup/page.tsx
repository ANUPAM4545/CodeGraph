'use client';

import React, { useState } from 'react';
import { AuthCard } from '../../../components/ui/AuthCard';
import { OAuthButton } from '../../../components/ui/OAuthButton';
import { authService } from '../../../lib/auth/authService';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    setIsLoading(true);
    authService.loginWithGithub();
  };

  return (
    <AuthCard
      title="Create an account"
      subtitle="Start exploring your architecture instantly."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <div className="space-y-4">
        <OAuthButton provider="github" onClick={handleSignup} isLoading={isLoading} />
        <p className="text-xs text-center text-muted px-4">
          By clicking continue, you agree to our <a href="#" className="underline hover:text-foreground">Terms of Service</a> and <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </AuthCard>
  );
}
