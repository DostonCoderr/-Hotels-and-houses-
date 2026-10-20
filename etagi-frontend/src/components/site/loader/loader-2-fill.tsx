'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markLoaderDone, prefersReduced, reducedExit, useLoaderCore } from './loader-core';

/**
 * 2) "Oltin to'lish": kontur harflar progress bo'yicha pastdan tepaga to'ladi.
 * Mantiq: progress -> clip-path (to'liq silliq, har kadrda).
 * Chiqish: harflar markazdan boshlab tepaga uchadi, so'ng butun ekran
 * clip-path bilan tepaga qarab "ochiladi".
 */

const WORD = 'ЭТАЖИ'.split('');
const GOLD = '#e6c993';
const FONT = "Impact, 'Arial Black', sans-serif";

const wordStyle: React.CSSProperties = {
  display: 'flex',
  fontFamily: FONT,
  fontSize: 'clamp(70px, 18vw, 280px)',
  lineHeight: 0.95,
  letterSpacing: '-0.02em',
};

const outlineLetter: React.CSSProperties = {
  display: 'inline-block',
  color: 'transparent',
  WebkitTextStroke: '1.5px rgba(230,201,147,.45)',
};
const fillLetter: React.CSSProperties = {
  display: 'inline-block',
  backgroundImage: 'linear-gradient(180deg, #f7e7c0 0%, #c9a36a 55%, #8a5f27 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export function LoaderFill() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const { skipped } = useLoaderCore({
    minMs: 3000,
    onProgress: (p) => {
      const inv = 100 - p;
      if (fillRef.current) fillRef.current.style.clipPath = `inset(${inv}% 0 0 0)`;
      if (lineRef.current) {
        lineRef.current.style.top = `${inv}%`;
        lineRef.current.style.opacity = p > 0.5 && p < 99.5 ? '1' : '0';
      }
      if (pctRef.current) pctRef.current.textContent = String(Math.floor(p));
    },
    onComplete: () => {
      if (prefersReduced()) return reducedExit(rootRef.current, () => setGone(true));
      const tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.to('.lf-meta', { opacity: 0, duration: 0.3 }, 0.1);
      [outlineRef.current, fillRef.current].forEach((layer) => {
        if (!layer) return;
        tl.to(
          layer.querySelectorAll('span'),
          { yPercent: -110, opacity: 0, duration: 0.8, ease: 'expo.in', stagger: { each: 0.07, from: 'center' } },
          0.45
        );
      });
      tl.call(markLoaderDone, [], '-=0.35').to(
        rootRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' },
        '-=0.5'
      );
    },
  });

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      [outlineRef.current, fillRef.current].forEach((layer) => {
        if (!layer) return;
        gsap.from(layer.querySelectorAll('span'), { yPercent: 40, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out' });
      });
      gsap.from('.lf-meta', { opacity: 0, y: 10, duration: 0.8, delay: 0.5 });
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        clipPath: 'inset(0% 0% 0% 0%)',
        background: 'radial-gradient(circle at 50% 60%, #1a2235 0%, #070c17 100%)',
      }}
    >
      <div style={{ position: 'relative' }}>
        <div ref={outlineRef} style={wordStyle} aria-hidden>
          {WORD.map((c, i) => (
            <span key={i} style={outlineLetter}>{c}</span>
          ))}
        </div>

        <div ref={fillRef} aria-hidden style={{ position: 'absolute', inset: 0, clipPath: 'inset(100% 0 0 0)' }}>
          <div style={wordStyle}>
            {WORD.map((c, i) => (
              <span key={i} style={fillLetter}>{c}</span>
            ))}
          </div>
        </div>

        {/* To'lish chizig'i */}
        <div
          ref={lineRef}
          aria-hidden
          style={{
            position: 'absolute',
            left: '-4%',
            right: '-4%',
            top: '100%',
            height: 2,
            opacity: 0,
            background: GOLD,
            boxShadow: '0 0 18px 2px rgba(230,201,147,.7)',
          }}
        />
      </div>

      <div
        className="lf-meta"
        style={{ display: 'flex', alignItems: 'baseline', gap: 14, color: '#98a1b4', fontSize: 13, letterSpacing: '.18em' }}
      >
        <span style={{ fontFamily: FONT, fontSize: 28, color: GOLD, fontVariantNumeric: 'tabular-nums', letterSpacing: 0 }}>
          <span ref={pctRef}>0</span>%
        </span>
        <span>ПОДБИРАЕМ ЛУЧШИЕ ОБЪЕКТЫ</span>
      </div>
    </div>
  );
}