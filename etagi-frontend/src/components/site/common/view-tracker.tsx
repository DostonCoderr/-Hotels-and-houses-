'use client';

import { useEffect } from 'react';
import { addToHistory } from '@/lib/api-users';

export function ViewTracker({ propertyId }: { propertyId: number }) {
  useEffect(() => {
    const token = localStorage.getItem('site-token');
    if (token) {
      addToHistory(propertyId).catch(() => {});
    }
  }, [propertyId]);

  return null;
}