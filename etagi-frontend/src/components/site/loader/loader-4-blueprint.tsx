'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markLoaderDone, prefersReduced, reducedExit, useLoaderCore } from './loader-core';

/**
 * 4) "Chizma": bino qavat-qavat quriladi (nom ham shu: ЭТАЖИ = qavatlar).
 * Mantiq: progress -> qurilgan qavatlar soni (8 qavat, har biri tepadan
 * tushib "sakraydi"). 100% da derazalar yonadi, markaziy deraza yorqin bo'ladi,
 * kamera shu derazaga kiradi va butun sayt DERAZA MARKAZIDAN doira bo'lib
 * ochiladi (CSS mask + --r o'zgaruvchisi GSAP bilan animatsiya qilinadi).
 */

const FLOORS = 8;
const FH = 34; // qavat balandligi
const GROUND = 320;
const BX = 50;
const BW = 140;
const HERO_FLOOR = 4;
const GOLD = '#e6c993';
const FONT = "Impact, 'Arial Black', sans-serif";
const STROKE = 'rgba(230,201,147,.85)';

export function LoaderBlueprint() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<SVGRectElement>(null);
  const floorRefs = useRef<Array<SVGGElement | null>>([]);
  const pctRef = useRef<HTMLSpanElement>(null);
  const floorTxt = useRef<HTMLSpanElement>(null);
  const built = useRef(0);

  const build = (i: number) => {
    const g = floorRefs.current[i];
    if (!g) return;
    gsap.fromTo(g, { opacity: 0, y: -140 }, { opacity: 1, y: 0, duration: 0.9, ease: 'bounce.out' });
  };

  const { skipped } = useLoaderCore({
    minMs: 3400,
    onProgress: (p) => {
      if (pctRef.current) pctRef.current.textContent = String(Math.floor(p));
      const target = Math.min(FLOORS, Math.floor((p / 100) * FLOORS + 0.001));
      while (built.current < target) {
        build(built.current);
        built.current++;
      }
      if (floorTxt.current) floorTxt.current.textContent = `${built.current} / ${FLOORS}`;
    },
    onComplete: () => {
      const root = rootRef.current;
      if (!root) return;
      if (prefersReduced()) return reducedExit(root, () => setGone(true));

      const wins = root.querySelectorAll('.bp-win');
      const hero = heroRef.current!;
      const tl = gsap.timeline({ onComplete: () => setGone(true) });

      // oxirgi qavat tushib bo'lishini kutamiz, nom chiqadi, derazalar yonadi
      tl.fromTo(
        '.bp-title span',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'expo.out' },
        0.7
      )
        .to(wins, { fill: 'rgba(230,201,147,.8)', duration: 0.4, stagger: { each: 0.05, from: 'random' } }, 0.9)
        .to(hero, { fill: '#fff6dc', duration: 0.5 }, '>')
        .add(() => {
          // kamera markaziy derazaga kiradi + sayt doira bo'lib ochiladi
          const hr = hero.getBoundingClientRect();
          const cx = hr.left + hr.width / 2;
          const cy = hr.top + hr.height / 2;
          const wrap = wrapRef.current!;
          const wr = wrap.getBoundingClientRect();
          gsap.set(wrap, { transformOrigin: `${cx - wr.left}px ${cy - wr.top}px` });
          const maxR = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
          root.style.setProperty('--cx', cx + 'px');
          root.style.setProperty('--cy', cy + 'px');
          gsap.to(wrap, { scale: 9, duration: 1.5, ease: 'expo.in' });
          gsap.to('.bp-ui', { opacity: 0, duration: 0.4 });
          gsap.to(root, { '--r': maxR + 'px', duration: 1.5, ease: 'expo.in' });
          gsap.delayedCall(0.9, markLoaderDone);
        }, '+=0.35')
        .to({}, { duration: 1.5 });
    },
  });

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(floorRefs.current, { opacity: 0 });
      gsap.from('.bp-ui', { opacity: 0, duration: 0.8, delay: 0.3 });
      gsap.from('.bp-ground', { scaleX: 0, transformOrigin: '50% 50%', duration: 1, ease: 'expo.out' });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  if (skipped || gone) return null;

  const mask = 'radial-gradient(circle at var(--cx) var(--cy), #0000 var(--r), #000 calc(var(--r) + 1px))';

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Загрузка"
      style={
        {
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          backgroundColor: '#070c17',
          backgroundImage:
            'linear-gradient(rgba(230,201,147,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(230,201,147,.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          '--r': '0px',
          '--cx': '50%',
          '--cy': '50%',
          WebkitMaskImage: mask,
          maskImage: mask,
        } as React.CSSProperties
      }
    >
      <div ref={wrapRef} style={{ height: 'min(54vh, 500px)', willChange: 'transform' }}>
        <svg viewBox="0 0 240 340" style={{ height: '100%', width: 'auto', overflow: 'visible' }} aria-hidden>
          <line className="bp-ground" x1="10" y1={GROUND} x2="230" y2={GROUND} stroke={STROKE} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          {Array.from({ length: FLOORS }, (_, i) => {
            const y = GROUND - (i + 1) * FH;
            return (
              <g
                key={i}
                ref={(el) => {
                  floorRefs.current[i] = el;
                }}
              >
                <rect x={BX} y={y} width={BW} height={FH} fill="#070c17" stroke={STROKE} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                {[62, 109, 156].map((x, k) => {
                  const isHero = i === HERO_FLOOR && k === 1;
                  return (
                    <rect
                      key={k}
                      ref={isHero ? heroRef : undefined}
                      className={isHero ? undefined : 'bp-win'}
                      x={isHero ? x - 3 : x}
                      y={y + (isHero ? 7 : 9)}
                      width={isHero ? 28 : 22}
                      height={isHero ? 20 : 16}
                      fill="rgba(230,201,147,0)"
                      stroke={STROKE}
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                      style={isHero ? { filter: 'drop-shadow(0 0 6px rgba(255,246,220,.9))' } : undefined}
                    />
                  );
                })}
              </g>
            );
          })}
          {/* Antenna */}
          <line x1={BX + BW / 2} y1={GROUND - FLOORS * FH} x2={BX + BW / 2} y2={GROUND - FLOORS * FH - 16} stroke={STROKE} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="bp-title" style={{ display: 'flex', overflow: 'hidden', fontFamily: FONT, color: GOLD, fontSize: 'clamp(34px, 6vw, 72px)', letterSpacing: '.18em', lineHeight: 1.1 }}>
        {'ЭТАЖИ'.split('').map((c, i) => (
          <span key={i} style={{ display: 'inline-block', opacity: 0 }}>{c}</span>
        ))}
      </div>

      <div
        className="bp-ui"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 28px 24px', display: 'flex', justifyContent: 'space-between', color: '#98a1b4', fontSize: 13, letterSpacing: '.18em' }}
      >
        <span>
          ЭТАЖ <span ref={floorTxt} style={{ color: GOLD, fontVariantNumeric: 'tabular-nums' }}>0 / {FLOORS}</span>
        </span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          <span ref={pctRef}>0</span>%
        </span>
      </div>
    </div>
  );
}