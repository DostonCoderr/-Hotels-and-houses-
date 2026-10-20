'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

// ============================================================
// USE AUTH — himoyalangan sahifalar uchun
// ============================================================
export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (
      !pathname.includes('/login') &&
      !isLoading &&
      !isAuthenticated
    ) {
      router.push('/login');
    }
  }, [pathname, isLoading, isAuthenticated, router]);

  return { admin, isAuthenticated, isLoading };
}

// ============================================================
// USE REDIRECT IF AUTHENTICATED — login sahifasi uchun
// ============================================================
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}