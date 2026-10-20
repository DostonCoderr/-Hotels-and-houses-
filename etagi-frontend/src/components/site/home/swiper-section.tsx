'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Property } from '@/lib/types';        // ✅ static-data → types
import { PropertyCard } from './property-card';
import { useTranslation } from '@/lib/i18n';

export function SwiperSection({ items }: { items: Property[] }) {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const childWidth = el.firstElementChild?.firstElementChild?.clientWidth || 300;
    const index = Math.round(scrollLeft / (childWidth + 18));
    setActiveIndex(index);
  };

  const scroll = (dir: 1 | -1) => {
    const el = wrapperRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const childWidth = el.firstElementChild?.firstElementChild?.clientWidth || 300;
    el.scrollTo({ left: index * (childWidth + 18), behavior: 'smooth' });
  };

  return (
    <section className="sc" id="swiper-sec">
      <div className="w">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hd2">
          <div>
            <div className="mu" style={{ marginBottom: 6 }}>{t('swipe_sub')}</div>
            <h2>{t('swipe_title')} <span style={{ color: 'var(--g2)' }}>{t('swipe_title_arrow')}</span></h2>
            <div className="sf" style={{ fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--g2)', lineHeight: 1.1 }}>
              {t('swipe_desc')}
            </div>
          </div>
          <Link href="/novostroyki" className="bo" style={{ textDecoration: 'none' }}>
            {t('swipe_btn_all')}
          </Link>
        </motion.div>

        <div className="swiper-section">
          <button className="swiper-btn prev" onClick={() => scroll(-1)} aria-label="Назад">←</button>
          <button className="swiper-btn next" onClick={() => scroll(1)} aria-label="Вперёд">→</button>
          <div className="swiper">
            <div className="swiper-wrapper" ref={wrapperRef} onScroll={handleScroll}>
              <div className="swiper-grid">
                {items.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>
          </div>
          <div className="swiper-dots">
            {items.map((_, i) => (
              <i key={i} className={i === activeIndex ? 'on' : ''} onClick={() => scrollToIndex(i)} style={{ cursor: 'pointer' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}