'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HOVER_SEL = 'a,button,[role="button"],.swiper-slide,.jr .cd,.t,.q,.member';

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3' });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as HTMLElement).closest(HOVER_SEL);
      gsap.to(r, { scale: hit ? 1.9 : 1, backgroundColor: hit ? 'rgba(201,163,106,.12)' : 'rgba(201,163,106,0)', duration: 0.35, ease: 'power3.out' });
      gsap.to(d, { scale: hit ? 0 : 1, duration: 0.25 });
    };
    const leave = () => { shown = false; gsap.to([d, r], { opacity: 0, duration: 0.3 }); };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  const base: React.CSSProperties = { position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 9997, borderRadius: '50%' };
  return (
    <>
      <div ref={ring} aria-hidden style={{ ...base, width: 38, height: 38, border: '1px solid #c9a36a' }} />
      <div ref={dot} aria-hidden style={{ ...base, width: 6, height: 6, background: '#e6c993' }} />
    </>
  );
}