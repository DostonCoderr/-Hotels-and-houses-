'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markLoaderDone, prefersReduced, reducedExit, useLoaderCore } from './loader-core';

/**
 * 3) "Jalyuzi": 5 ustun = 5 harf = 5 HAQIQIY yuklanish bosqichi.
 *   Э — karkas (DOM)       Т — шрифты
 *   А — фотографии         Ж — данные (window.load)
 *   И — готово (min vaqt)
 * Har bir harf o'z bosqichi tugagan zahoti yonadi (tartibsiz ham bo'lishi mumkin).
 * Chiqish: ustunlar chetlardan markazga qarab stagger bilan tepaga ko'tariladi.
 */

const LETTERS = ['Э', 'Т', 'А', 'Ж', 'И'];
const CAPTIONS = ['Каркас', 'Шрифты', 'Фотографии', 'Данные', 'Готово'];
const GOLD = '#e6c993';
const FONT = "Impact, 'Arial Black', sans-serif";

export function LoaderBlinds() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panels = useRef<Array<HTMLDivElement | null>>([]);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lit = useRef([false, false, false, false, false]);

  const lightUp = (i: number) => {
    if (lit.current[i]) return;
    lit.current[i] = true;
    const el = panels.current[i];
    if (!el) return;
    const letter = el.querySelector('.lb-letter');
    const glow = el.querySelector('.lb-glow');
    const cap = el.querySelector('.lb-cap');
    gsap
      .timeline()
      .fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      .to(glow, { opacity: 0.35, duration: 0.9 })
      .fromTo(letter, { scale: 1.1 }, { scale: 1, duration: 0.8, ease: 'expo.out' }, 0)
      .to(letter, { color: GOLD, duration: 0.4 }, 0)
      .to(cap, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.1);
  };

  const { skipped } = useLoaderCore({
    minMs: 3000,
    onProgress: (p, m) => {
      [m.dom, m.fonts, m.images >= 1, m.load, m.time].forEach((ok, i) => ok && lightUp(i));
      if (pctRef.current) pctRef.current.textContent = String(Math.floor(p));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p / 100})`;
    },
    onComplete: () => {
      if (prefersReduced()) return reducedExit(rootRef.current, () => setGone(true));
      lit.current.forEach((_, i) => lightUp(i)); // majburan tugagan bo'lsa ham hammasi yonsin
      const tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.to('.lb-meta', { opacity: 0, duration: 0.3 }, 0.6)
        .to(
          panels.current,
          { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: { each: 0.09, from: 'edges' } },
          0.8
        )
        .call(markLoaderDone, [], 1.2);
    },
  });

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.lb-letter', { opacity: 0, y: 50, duration: 1, stagger: 0.08, ease: 'expo.out' });
      gsap.set('.lb-cap', { opacity: 0, y: 10 });
      gsap.from('.lb-meta', { opacity: 0, duration: 0.8, delay: 0.4 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  if (skipped || gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Загрузка"
      style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', overflow: 'hidden' }}
    >
      {LETTERS.map((c, i) => (
        <div
          key={c}
          ref={(el) => {
            panels.current[i] = el;
          }}
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: `linear-gradient(180deg, #0c1322 0%, #070c17 100%)`,
            borderRight: i < LETTERS.length - 1 ? '1px solid rgba(230,201,147,.12)' : 'none',
            willChange: 'transform',
          }}
        >
          <div
            className="lb-glow"
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              background: 'radial-gradient(circle at 50% 55%, rgba(230,201,147,.28), transparent 65%)',
            }}
          />
          <span
            className="lb-letter"
            style={{
              position: 'relative',
              fontFamily: FONT,
              fontSize: 'clamp(56px, 13vw, 240px)',
              lineHeight: 1,
              color: 'rgba(230,201,147,0)',
              WebkitTextStroke: '1.5px rgba(230,201,147,.4)',
            }}
          >
            {c}
          </span>
          <span
            className="lb-cap"
            style={{
              position: 'absolute',
              bottom: 'clamp(70px, 12vh, 120px)',
              left: 0,
              right: 0,
              textAlign: 'center',
              color: GOLD,
              fontSize: 'clamp(9px, 1.1vw, 14px)',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
            }}
          >
            {CAPTIONS[i]}
          </span>
        </div>
      ))}

      <div
        className="lb-meta"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 28px 24px', pointerEvents: 'none', zIndex: 5 }}
      >
        <div style={{ height: 2, background: 'rgba(255,255,255,.12)', overflow: 'hidden', marginBottom: 12 }}>
          <div ref={barRef} style={{ height: '100%', background: GOLD, transformOrigin: '0 50%', transform: 'scaleX(0)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#98a1b4', fontSize: 13, letterSpacing: '.18em' }}>
          <span>(ЗАГРУЗКА)</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span ref={pctRef}>0</span>%
          </span>
        </div>
      </div>
    </div>
  );
}