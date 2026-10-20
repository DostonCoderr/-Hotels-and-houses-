'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const getLenis = () =>
  (typeof window !== 'undefined' ? ((window as any).lenis as Lenis | undefined) : undefined);

/**
 * Lenis = "sariyog'dek" silliq scroll.
 * GSAP ticker bilan ulangan, shuning uchun ScrollTrigger/parallax
 * scroll bilan bir kadrda yangilanadi (titroq bo'lmaydi).
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      anchors: true,
    });
    (window as any).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return null;
}
