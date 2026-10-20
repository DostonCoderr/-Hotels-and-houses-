'use client';

import { useEffect, useState } from 'react';

export const LOADER_EVENT = 'site:loader-done';
export const LOADER_KEY = 'site-loader-seen';

export function useLoaderDone() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(LOADER_KEY);
    } catch {}

    if (seen || (window as any).__loaderDone) {
      setDone(true);
      return;
    }
    const on = () => setDone(true);
    window.addEventListener(LOADER_EVENT, on, { once: true });
    return () => window.removeEventListener(LOADER_EVENT, on);
  }, []);

  return done;
}