'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

// ============================================================
// USE AUTH — himoyalangan sahifalar uchun
// ============================================================
export function useAuth() {
  const pathname = usePathname();
  const { admin, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Agar yuklanish tugagan bo'lsa va auth bo'lmasa
    if (!isLoading && !isAuthenticated && !pathname.includes('/login')) {
      window.location.href = '/login'; // ✅ To'liq yangilash
    }
  }, [pathname, isLoading, isAuthenticated]);

  return { admin, isAuthenticated, isLoading };
}

// ============================================================
// USE REDIRECT IF AUTHENTICATED — login sahifasi uchun
// ============================================================
export function useRedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = '/dashboard'; // ✅ To'liq yangilash
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}