'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadAdmin = useAuthStore((s) => s.loadAdmin);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  return <>{children}</>;
}