'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../../lib/auth/authService';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (code && state) {
          await authService.handleCallback(code, state);
        } else if (code) {
          await authService.handleCallback(code, 'default');
        }
        
        const { organization } = await authService.getSession();
        if (organization) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('OAuth callback failed:', error);
        router.push('/login?error=auth_failed');
      }
    };
    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <h2 className="text-lg font-semibold tracking-tight">Authenticating securely...</h2>
        <p className="text-sm text-muted">Exchanging tokens with GitHub</p>
      </div>
    </div>
  );
}
