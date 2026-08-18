'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Organization, authService } from './authService';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  refreshSession: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const session = await authService.getSession();
      setUser(session.user);
      setOrganization(session.organization);
    } catch (e) {
      setUser(null);
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider value={{ user, organization, isLoading, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
