'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../../lib/auth/authService';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        let provider = (urlParams.get('provider') as 'github' | 'google') || 'github';

        // Auto-detect provider if scope or state hints at google
        if (urlParams.has('scope') && urlParams.get('scope')?.includes('google')) {
          provider = 'google';
        }

        if (!code || !state) {
          throw new Error('Missing code or state parameter from OAuth provider');
        }

        await authService.handleCallback(code, state, provider);
        
        // Retrieve preserved redirect URL from sessionStorage
        let targetDestination = '/dashboard';
        const savedRedirect = sessionStorage.getItem('auth_redirect');
        if (savedRedirect && savedRedirect.startsWith('/') && !savedRedirect.startsWith('//')) {
          targetDestination = savedRedirect;
          sessionStorage.removeItem('auth_redirect');
        }

        router.push(targetDestination);
      } catch (error) {
        console.error('OAuth callback processing failed:', error);
        setErrorMessage('Authentication failed or was rejected by provider.');
        setTimeout(() => {
          router.push('/login?error=auth_failed');
        }, 2000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-mono text-xs text-foreground p-6 select-none">
      <div className="flex flex-col items-center justify-center space-y-4 max-w-sm text-center p-8 rounded-3xl border border-border bg-white shadow-xl">
        {errorMessage ? (
          <>
            <AlertCircle className="w-8 h-8 text-red-600 animate-bounce" />
            <h2 className="text-base font-extrabold tracking-tight text-foreground">Authentication Failed</h2>
            <p className="text-xs text-muted font-sans">{errorMessage}</p>
            <span className="text-[10px] text-neutral-400">Redirecting back to login...</span>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 text-black animate-spin" />
            <h2 className="text-base font-extrabold tracking-tight text-foreground">Authenticating Securely...</h2>
            <p className="text-xs text-muted font-sans">
              Exchanging authorization code &amp; initializing session
            </p>
          </>
        )}
      </div>
    </div>
  );
}
