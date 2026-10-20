'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n'; // ✅ Import

const EZ: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SECONDS = 6;

export function AdBanner() {
  const { t } = useTranslation(); // ✅ Hook
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ✅ Tarjima qilingan bannerlar
  const BANNERS = [
    {
      eb2: t('ad_1_eb'),
      title: t('ad_1_title'),
      desc: t('ad_1_desc'),
      btn: t('ad_1_btn'),
      bg: 'linear-gradient(120deg, #1a2744 0%, #2a4263 40%, #c9a36a 100%)',
      link: '#ls',
    },
    {
      eb2: t('ad_2_eb'),
      title: t('ad_2_title'),
      desc: t('ad_2_desc'),
      btn: t('ad_2_btn'),
      bg: 'linear-gradient(135deg, #2a4263, #13213a)',
      link: '/novostroyki?filter=new',
    },
    {
      eb2: t('ad_3_eb'),
      title: t('ad_3_title'),
      desc: t('ad_3_desc'),
      btn: t('ad_3_btn'),
      bg: 'linear-gradient(135deg, #c9a36a, #8a5f27)',
      link: '/novostroyki?filter=sale',
    },
    {
      eb2: t('ad_4_eb'),
      title: t('ad_4_title'),
      desc: t('ad_4_desc'),
      btn: t('ad_4_btn'),
      bg: 'linear-gradient(135deg, #4ea87a, #1f6b48)',
      link: '/novostroyki?filter=family',
    },
  ];

  if (!visible) return null;

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + BANNERS.length) % BANNERS.length);
  const b = BANNERS[index];

  return (
    <section className="sc" id="ad">
      <div className="w">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EZ }}
          className="ad-banner"
          id="adBanner"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) go(1);
            else if (info.offset.x > 80) go(-1);
          }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          style={{ padding: '48px 40px', position: 'relative', overflow: 'hidden', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'grab' }}
        >
          {BANNERS.map((x, i) => (
            <motion.div
              key={i}
              aria-hidden
              initial={false}
              animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.12 }}
              transition={{ duration: 1.2, ease: EZ }}
              style={{ position: 'absolute', inset: 0, backgroundImage: x.bg, zIndex: 0 }}
            />
          ))}

          <motion.span aria-hidden animate={{ y: [0, -26, 0], x: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} style={{ position: 'absolute', right: '8%', top: '-12%', width: 260, height: 260, borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', zIndex: 1, pointerEvents: 'none' }} />
          <motion.span aria-hidden animate={{ y: [0, 20, 0], scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }} style={{ position: 'absolute', right: '18%', bottom: '-20%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.08)', zIndex: 1, pointerEvents: 'none' }} />

          <button className="ad-close" onClick={() => setVisible(false)} aria-label="Закрыть" style={{ zIndex: 10 }}>✕</button>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: EZ }}
              className="ad-text"
              style={{ width: '100%', maxWidth: 'min(640px, 100%)', position: 'relative', zIndex: 2 }}
            >
              <div className="eb2">{b.eb2}</div>
              <h3 style={{ fontSize: 38, margin: '10px 0', lineHeight: 1.2 }}>{b.title}</h3>
              <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 24 }}>{b.desc}</p>
              <a href={b.link} className="bt" style={{ padding: '14px 28px', fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>{b.btn}</a>
            </motion.div>
          </AnimatePresence>

          <div style={{ position: 'absolute', bottom: 20, left: 40, display: 'flex', gap: 8, zIndex: 10 }}>
            {BANNERS.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} aria-label={`Перейти к баннеру ${i + 1}`} style={{ position: 'relative', height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', overflow: 'hidden', width: i === index ? 40 : 8, background: 'rgba(255,255,255,0.4)', transition: 'width .4s cubic-bezier(.22,1,.36,1)' }}>
                {i === index && (
                  <span key={index} onAnimationEnd={() => go(1)} style={{ position: 'absolute', inset: 0, background: '#fff', transformOrigin: '0 50%', animation: `adfill ${SECONDS}s linear forwards`, animationPlayState: paused ? 'paused' : 'running' }} />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}