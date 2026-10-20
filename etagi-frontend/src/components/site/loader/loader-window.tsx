'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markLoaderDone, prefersReduced, reducedExit, useLoaderCore } from './loader-core';

/**
 * 1) "Oyna": ЭТ [rasm] ЖИ
 * Mantiq: progress rasmni almashtiradi (har 25% da yangi rasm tepadan tushadi).
 * Oxirida rasm oynasi butun ekranga kengayadi va flex orqali harflarni
 * chap va o'ngga itarib chiqaradi. Keyin overlay so'nadi.
 */

const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=900&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&h=900&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=900&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&h=900&fit=crop',
];
const GOLD = '#e6c993';
const FONT = "Impact, 'Arial Black', sans-serif";

const pair: React.CSSProperties = {
  display: 'flex',
  flexShrink: 0,
  overflow: 'hidden',
  padding: '0.05em 0',
  fontFamily: FONT,
  color: GOLD,
  fontSize: 'clamp(90px, 17vw, 260px)',
  lineHeight: 0.82,
  letterSpacing: '-0.03em',
  textShadow: '0 0 30px rgba(230,201,147,.25)',
};

export function LoaderWindow() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const slides = useRef<Array<HTMLImageElement | null>>([]);
  const idx = useRef(0);

  const { skipped } = useLoaderCore({
    minMs: 3200,
    onProgress: (p) => {
      if (pctRef.current) pctRef.current.textContent = String(Math.floor(p));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p / 100})`;

      const next = Math.min(IMAGES.length - 1, Math.floor(p / (100 / IMAGES.length)));
      if (next !== idx.current) {
        gsap.fromTo(slides.current[next], { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' });
        gsap.to(slides.current[idx.current], { yPercent: 100, duration: 0.8, ease: 'expo.out' });
        idx.current = next;
      }
    },
    onComplete: () => {
      if (prefersReduced()) return reducedExit(rootRef.current, () => setGone(true));
      const tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.to('.lw-meta', { opacity: 0, duration: 0.3 })
        .to(
          winRef.current,
          { width: window.innerWidth, height: window.innerHeight, borderRadius: 0, duration: 1.3, ease: 'expo.inOut' },
          '+=0.2'
        )
        .to('.lw-letter', { opacity: 0, duration: 0.5 }, '<')
        .call(markLoaderDone, [], '-=0.45') // Hero shu payt boshlanadi
        .to(rootRef.current, { opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.1');
    },
  });

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(slides.current.slice(1), { yPercent: -100 });
      gsap.from('.lw-letter', { yPercent: 115, duration: 1.1, stagger: 0.08, ease: 'expo.out' });
      gsap.from(winRef.current, { scale: 0.6, opacity: 0, duration: 1, delay: 0.15, ease: 'expo.out' });
      gsap.from('.lw-meta', { opacity: 0, y: 12, duration: 0.8, delay: 0.5 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  if (skipped || gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Загрузка"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'radial-gradient(circle at center, #1a2235 0%, #070c17 100%)',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={pair}>
          {'ЭТ'.split('').map((c, i) => (
            <span key={i} className="lw-letter" style={{ display: 'inline-block' }}>{c}</span>
          ))}
        </div>

        <div
          ref={winRef}
          style={{
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden',
            borderRadius: 16,
            margin: '0 clamp(8px, 1.4vw, 24px)',
            width: 'clamp(150px, 18vw, 270px)',
            height: 'clamp(190px, 23vw, 340px)',
            boxShadow: '0 0 50px rgba(0,0,0,.8)',
            outline: '1px solid rgba(255,255,255,.1)',
          }}
        >
          {IMAGES.map((src, i) => (
            <img
              key={src}
              ref={(el) => {
                slides.current[i] = el;
              }}
              src={src}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}
            />
          ))}
        </div>

        <div style={pair}>
          {'ЖИ'.split('').map((c, i) => (
            <span key={i} className="lw-letter" style={{ display: 'inline-block' }}>{c}</span>
          ))}
        </div>
      </div>

      <div className="lw-meta" style={{ padding: '0 32px 28px', color: '#98a1b4' }}>
        <div style={{ height: 2, background: 'rgba(255,255,255,.12)', overflow: 'hidden', marginBottom: 14 }}>
          <div ref={barRef} style={{ height: '100%', background: GOLD, transformOrigin: '0 50%', transform: 'scaleX(0)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, letterSpacing: '.18em', fontWeight: 600 }}>
          <span>(ЗАГРУЗКА)</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span ref={pctRef}>0</span>%
          </span>
        </div>
      </div>
    </div>
  );
}