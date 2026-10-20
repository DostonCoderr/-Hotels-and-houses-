'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/lib/types';        // ✅ static-data → types
import { PropertyCard } from './property-card';
import { useTranslation } from '@/lib/i18n';

export function FeaturedSlider({ items }: { items: Property[] }) {
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
    <section className="sc" id="ls">
      <div className="w">
        <div className="hd2">
          <div>
            <div className="mu" style={{ marginBottom: 6 }}>{t('feat_sub')}</div>
            <Link href="/novostroyki" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>{t('feat_title')}</h2>
            </Link>
            <div className="sf" style={{ fontSize: 'clamp(26px,3.4vw,40px)', color: 'var(--g2)', lineHeight: 1.1 }}>
              {t('feat_desc')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="bo" data-go="map">{t('feat_btn_map')}</button>
            <Link href="/novostroyki" className="bo" style={{ textDecoration: 'none' }}>
              {t('feat_btn_all')}
            </Link>
          </div>
        </div>

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