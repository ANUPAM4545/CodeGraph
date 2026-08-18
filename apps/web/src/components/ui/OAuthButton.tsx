import React from 'react';
import { Button } from './Button';
import { Github } from 'lucide-react';

interface OAuthButtonProps {
  provider: 'github';
  onClick: () => void;
  isLoading?: boolean;
}

export function OAuthButton({ provider, onClick, isLoading }: OAuthButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="w-full py-5 flex items-center justify-center gap-3 relative" 
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      ) : (
        <>
          <Github className="w-5 h-5" />
          <span className="font-medium">Continue with GitHub</span>
        </>
      )}
    </Button>
  );
}
