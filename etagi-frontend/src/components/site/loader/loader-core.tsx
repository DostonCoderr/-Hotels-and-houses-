'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const LOADER_EVENT = 'site:loader-done';
export const LOADER_KEY = 'site-loader-seen';

export type Milestones = {
  dom: boolean;
  fonts: boolean;
  images: number;
  load: boolean;
  time: boolean;
};

type Opts = {
  minMs?: number;
  maxMs?: number;
  onProgress: (p: number, m: Milestones) => void;
  onComplete: () => void;
};

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Saytga loader tugaganini xabar qiladi */
export function markLoaderDone() {
  document.body.style.overflow = '';
  (window as any).__loaderDone = true;
  try {
    sessionStorage.setItem(LOADER_KEY, '1');
  } catch {}
  window.dispatchEvent(new Event(LOADER_EVENT));
}

/** Reduced-motion (animatsiyani kamaytirish) uchun */
export function reducedExit(el: HTMLElement | null, done: () => void) {
  markLoaderDone();
  if (el) gsap.to(el, { opacity: 0, duration: 0.35, onComplete: done });
  else done();
}

export function useLoaderCore(opts: Opts) {
  const [skipped, setSkipped] = useState(false);
  const ref = useRef(opts);
  ref.current = opts;

  useEffect(() => {
    // Eslatma: Dev rejimida har safar loaderni ko'rish uchun
    // sessionStorage tekshiruvini o'chirib turamiz.
    // Ishlab chiqarishga (production) chiqarganda quyidagi 3 qatorni yoqing.
    /*
    let seen = false;
    try { seen = !!sessionStorage.getItem(LOADER_KEY); } catch {}
    if (seen) { setSkipped(true); return; }
    */

    const minMs = prefersReduced() ? 400 : ref.current.minMs ?? 2800;
    const maxMs = ref.current.maxMs ?? 8000;
    document.body.style.overflow = 'hidden';

    const m: Milestones = { dom: false, fonts: false, images: 0, load: false, time: false };
    const cleanups: Array<() => void> = [];
    let force = false;
    let completed = false;
    let shown = 0;
    const start = performance.now();

    m.dom = document.readyState !== 'loading';

    const fonts = (document as any).fonts;
    if (fonts?.ready) fonts.ready.then(() => (m.fonts = true));
    else m.fonts = true;

    const imgs = Array.from(document.images).filter((i) => i.loading !== 'lazy');
    let loaded = 0;
    const bump = () => {
      loaded++;
      m.images = loaded / imgs.length;
    };
    if (!imgs.length) m.images = 1;
    imgs.forEach((img) => {
      if (img.complete) return bump();
      img.addEventListener('load', bump, { once: true });
      img.addEventListener('error', bump, { once: true });
      cleanups.push(() => {
        img.removeEventListener('load', bump);
        img.removeEventListener('error', bump);
      });
    });

    if (document.readyState === 'complete') m.load = true;
    else {
      const onLoad = () => (m.load = true);
      window.addEventListener('load', onLoad, { once: true });
      cleanups.push(() => window.removeEventListener('load', onLoad));
    }

    const t1 = setTimeout(() => (m.time = true), minMs);
    const t2 = setTimeout(() => (force = true), maxMs);

    const targetOf = () => {
      if (force) return 100;
      if (m.dom && m.fonts && m.images >= 1 && m.load && m.time) return 100;
      return (m.dom ? 10 : 0) + (m.fonts ? 15 : 0) + m.images * 45 + (m.load ? 20 : 0);
    };

    const tick = (_t: number, delta: number) => {
      if (completed) return;
      const x = Math.min(1, (performance.now() - start) / minMs);
      const cap = force ? 100 : (1 - Math.pow(1 - x, 2)) * 100;
      const goal = Math.min(targetOf(), cap);
      
      // Silliqlash (easing) sekinroq ko'tarilishi uchun 6 dan 4 ga tushirildi
      shown += (goal - shown) * (1 - Math.exp(-(delta / 1000) * 4));
      
      if (goal >= 100 && shown > 99.5) shown = 100;
      ref.current.onProgress(shown, m);
      
      if (shown >= 100) {
        completed = true;
        ref.current.onComplete();
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(t1);
      clearTimeout(t2);
      cleanups.forEach((fn) => fn());
      document.body.style.overflow = '';
    };
  }, []);

  return { skipped };
}