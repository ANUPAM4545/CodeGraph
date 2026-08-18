'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth/context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Bypassed for local development
  return <>{children}</>;
}
