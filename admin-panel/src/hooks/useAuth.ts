// src/hooks/useAuth.ts
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.includes('/login')) {
      router.replace('/login');
    }
  }, [pathname, isLoading, isAuthenticated, router]);

  return { admin, isAuthenticated, isLoading };
}

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // ✅ Agar foydalanuvchi auth bo'lsa, dashboardga yuboramiz
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}