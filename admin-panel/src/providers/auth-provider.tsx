// src/providers/auth-provider.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadAdmin = useAuthStore((s) => s.loadAdmin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadAdmin();
  }, [loadAdmin]);

  // ✅ Brauzerda Zustand to'liq yuklanmaguncha kutamiz (hydration xatosi bo'lmasligi uchun)
  if (!mounted) return null;

  return <>{children}</>;
}