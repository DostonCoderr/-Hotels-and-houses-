'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';
import { useVideoModal } from '@/components/site/common/video-modal';
import { useLoaderDone } from '../animations/use-loader-done';
import { useTranslation } from '@/lib/i18n';

const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=900&fit=crop',
];

const SLIDE_SECONDS = 6;
const PRICE = 16980000;
const EZ: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EZ } },
};
const headline: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const word: Variants = {
  hidden: { y: '115%', rotate: 4 },
  show: { y: '0%', rotate: 0, transition: { duration: 1, ease: EZ } },
};

// ✅ TO'G'RILANGAN QISM: em ni ixtiyoriy (optional) qildik
type LinePart = { t: string; em?: boolean };

export function Hero() {
  const { t } = useTranslation();
  const ready = useLoaderDone();
  const setVideoOpen = useVideoModal((s) => s.setOpen);

  const [activeIdx, setActiveIdx] = useState(0);
  const prevIdx = useRef(0);

  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // ✅ TypeScript endi xato bermaydi
  const LINES: Array<Array<LinePart>> = [
    [{ t: t('hero_title_line1') }],
    [{ t: t('hero_title_line2'), em: true }],
    [{ t: t('hero_title_line3') }],
  ];

  /* 1. Slayd almashishi */
  useEffect(() => {
    if (!ready) return;
    const next = imgRefs.current[activeIdx];
    const prev = imgRefs.current[prevIdx.current];
    if (!next) return;

    next.style.zIndex = '2';
    anime.remove(next);

    if (prev && prev !== next) {
      prev.style.zIndex = '1';
      anime({ targets: prev, opacity: 0, duration: 1800, easing: 'easeInOutQuad' });
      anime({ targets: next, opacity: [0, 1], scale: [1.18, 1.04], duration: 2200, easing: 'easeOutQuart' });
    } else {
      anime({ targets: next, scale: [1.2, 1.04], duration: 3200, easing: 'easeOutQuart' });
    }
    prevIdx.current = activeIdx;
  }, [activeIdx, ready]);

  /* 2. Avto-o'tish */
  useEffect(() => {
    if (!ready) return;
    const bars = barRefs.current.filter(Boolean) as HTMLSpanElement[];
    bars.forEach((b, j) => gsap.set(b, { scaleX: j < activeIdx ? 1 : 0 }));
    const tween = gsap.to(bars[activeIdx], {
      scaleX: 1,
      duration: SLIDE_SECONDS,
      ease: 'none',
      onComplete: () => setActiveIdx((i) => (i + 1) % IMAGES.length),
    });
    return () => { tween.kill(); };
  }, [activeIdx, ready]);

  /* 3. Scroll parallax + tilt */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(hover: hover) and (pointer: fine) and (min-width: 1024px)',
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        const st = { trigger: heroRef.current, start: 'top top', scrub: true } as const;

        gsap.to(bgRef.current, { yPercent: 18, ease: 'none', scrollTrigger: { ...st, end: 'bottom top' } });
        gsap.to(textRef.current, { y: -120, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '65% top' } });
        gsap.to(cueRef.current, { opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '15% top' } });

        gsap.to('.hero-orb-1', { x: 70, y: -50, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.hero-orb-2', { x: -60, y: 40, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        if (!desktop) return;

        const card = cardRef.current!;
        gsap.set(card, { transformPerspective: 1000 });
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3' });
        const sc = gsap.quickTo(card, 'scale', { duration: 0.6, ease: 'power3' });
        const o1x = gsap.quickTo('.hero-orb-1', 'xPercent', { duration: 1.4, ease: 'power3' });
        const o2x = gsap.quickTo('.hero-orb-2', 'xPercent', { duration: 1.8, ease: 'power3' });

        const move = (e: PointerEvent) => {
          const px = e.clientX / window.innerWidth - 0.5;
          const py = e.clientY / window.innerHeight - 0.5;
          const r = card.getBoundingClientRect();
          const inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
          ry(px * 14);
          rx(-py * 10);
          sc(inside ? 1.03 : 1);
          o1x(px * 25);
          o2x(-px * 35);
        };
        const hero = heroRef.current!;
        hero.addEventListener('pointermove', move);
        return () => hero.removeEventListener('pointermove', move);
      }
    );
    return () => mm.revert();
  }, []);

  /* 4. Narx hisoblagich */
  useEffect(() => {
    if (!ready) return;
    const el = priceRef.current;
    const o = { v: 0 };
    const counter = anime({
      targets: o,
      v: PRICE,
      round: 1,
      duration: 2400,
      delay: 1100,
      easing: 'easeOutExpo',
      update: () => {
        if (el) el.textContent = o.v.toLocaleString('ru-RU') + ' ₽';
      },
    });
    const cue = anime({
      targets: '.hero-cue-dot',
      translateY: [0, 14],
      opacity: [1, 0],
      duration: 1600,
      loop: true,
      easing: 'easeInOutQuad',
    });
    return () => {
      counter.pause();
      cue.pause();
      anime.remove('.hero-cue-dot');
    };
  }, [ready]);

  const state = ready ? 'show' : 'hidden';

  return (
    <section
      className="hero"
      id="hero"
      ref={heroRef}
      style={{ height: '100vh', minHeight: 650, overflow: 'hidden', position: 'relative' }}
    >
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, zIndex: 0, height: '120%', top: '-10%' }}>
        {IMAGES.map((src, i) => (
          <img
            key={src}
            ref={(el) => { imgRefs.current[i] = el; }}
            className="hero-bg-img bg"
            src={src}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: i === 0 ? 1 : 0, willChange: 'transform, opacity',
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,9,18,0.9) 0%, rgba(5,9,18,0.4) 50%, transparent 100%)', zIndex: 3 }} />
      </div>

      <span className="hero-orb-1" aria-hidden style={{ position: 'absolute', left: '8%', top: '18%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,163,106,.22), transparent 70%)', filter: 'blur(30px)', zIndex: 1, pointerEvents: 'none' }} />
      <span className="hero-orb-2" aria-hidden style={{ position: 'absolute', right: '6%', bottom: '14%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,120,200,.18), transparent 70%)', filter: 'blur(40px)', zIndex: 1, pointerEvents: 'none' }} />

      <div className="w" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div ref={textRef} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.div className="tx" variants={container} initial="hidden" animate={state}>
            <motion.div variants={item} className="eb">
              {t('hero_eb')}
            </motion.div>

            <motion.h1 variants={headline} aria-label={`${t('hero_title_line1')} ${t('hero_title_line2')} ${t('hero_title_line3')}`}>
              {LINES.map((line, li) => (
                <span key={li} aria-hidden style={{ display: 'block', overflow: 'hidden', paddingBottom: '.12em', marginBottom: '-.12em' }}>
                  {line.map((w, wi) => (
                    <motion.span key={wi} variants={word} style={{ display: 'inline-block', willChange: 'transform' }}>
                      {w.em ? <em>{w.t}</em> : w.t}
                      {wi < line.length - 1 ? '\u00A0' : ''}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p variants={item} style={{ maxWidth: 450 }}>
              {t('hero_sub')}
            </motion.p>

            <motion.div variants={item} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
              <a href="/novostroyki" className="bt" style={{ textDecoration: 'none' }}>
                {t('hero_btn_view')}
              </a>
              <button className="vd" onClick={() => setVideoOpen(true)}>
                <span className="pl">▶</span> {t('hero_btn_video')}
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
            transition={{ duration: 1.1, delay: 0.6, ease: EZ }}
          >
            <div ref={cardRef} className="glass" style={{ willChange: 'transform' }}>
              <div style={{ fontSize: 12, color: '#e6c993', letterSpacing: 1 }}>{t('hero_card_exclusive')}</div>
              <h3 style={{ fontSize: 28, margin: '10px 0 4px' }}>{t('hero_card_title')}</h3>
              <div style={{ fontSize: 13, color: '#d8d2c6' }}>{t('hero_card_addr')}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.2)', marginTop: 20, paddingTop: 15, fontSize: 13 }}>
                <span>{t('hero_card_studio')}</span>
                <span>29,8 м²</span>
                <span>{t('hero_card_date')}</span>
              </div>
              <div ref={priceRef} style={{ fontSize: 24, margin: '15px 0' }} className="glass-price">
                16 980 000 ₽
              </div>
              <a href="/novostroyki/1" className="bt" style={{ padding: '12px 24px', textDecoration: 'none', display: 'inline-block', width: '100%', textAlign: 'center' }}>
                {t('hero_card_btn')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slayd progress */}
      <div style={{ position: 'absolute', left: 24, bottom: 110, zIndex: 5, display: 'flex', gap: 8 }}>
        {IMAGES.map((_, i) => (
          <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setActiveIdx(i)} style={{ width: 56, height: 3, padding: 0, border: 0, borderRadius: 2, overflow: 'hidden', background: 'rgba(255,255,255,.28)', cursor: 'pointer' }}>
            <span ref={(el) => { barRefs.current[i] = el; }} style={{ display: 'block', height: '100%', background: '#e6c993', transformOrigin: '0 50%', transform: 'scaleX(0)' }} />
          </button>
        ))}
      </div>

      <span ref={cueRef} aria-hidden style={{ position: 'absolute', left: '50%', bottom: 100, zIndex: 5, width: 22, height: 36, marginLeft: -11, border: '1.5px solid rgba(255,255,255,.55)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
        <i className="hero-cue-dot" style={{ width: 3, height: 7, borderRadius: 2, background: '#e6c993', display: 'block' }} />
      </span>
    </section>
  );
}