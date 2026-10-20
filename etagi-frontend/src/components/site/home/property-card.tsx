'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import anime from 'animejs';
import type { Property } from '@/lib/types';                    // ✅ static-data → types
import { useTranslation } from '@/lib/i18n';                     // ✅ QO'SHILDI
import type { TranslationKey } from '@/lib/i18n';

const TYPE_LABEL_KEYS: Record<string, TranslationKey> = {        // ✅ string (xavfsiz)
  new: 'pcard_type_new',
  house: 'pcard_type_house',
  com: 'pcard_type_com',
};

const fmt = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

/** Yurak bosilganda 12 ta zarracha otiladi (Anime.js) */
function burst(btn: HTMLElement) {
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const N = 12;

  const dots = Array.from({ length: N }, (_, i) => {
    const d = document.createElement('span');
    Object.assign(d.style, {
      position: 'fixed',
      left: cx - 3 + 'px',
      top: cy - 3 + 'px',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: i % 2 ? '#e6c993' : '#ff6b81',
      pointerEvents: 'none',
      zIndex: '9999',
    });
    document.body.appendChild(d);
    return d;
  });

  anime({
    targets: dots,
    translateX: (_el: Element, i: number) => Math.cos((i / N) * Math.PI * 2) * (34 + Math.random() * 18),
    translateY: (_el: Element, i: number) => Math.sin((i / N) * Math.PI * 2) * (34 + Math.random() * 18),
    scale: [1, 0],
    opacity: [1, 0],
    duration: 750,
    easing: 'easeOutExpo',
    complete: () => dots.forEach((d) => d.remove()),
  });
}

export function PropertyCard({ property }: { property: Property }) {
  const { t } = useTranslation();                                // ✅ import qilindi
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const on = btn.classList.toggle('on');
    anime.remove(btn);
    anime({
      targets: btn,
      scale: [1, on ? 1.55 : 0.8, 1],
      rotate: on ? [0, -16, 0] : [0, 0, 0],
      duration: 650,
      easing: 'easeOutElastic(1, .6)',
    });
    if (on) burst(btn);
  };

  const zoom = (to: number) => () =>
    gsap.to(imgRef.current, { scale: to, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });

  // ✅ type xavfsiz olinadi
  const typeKey = TYPE_LABEL_KEYS[property.type || 'new'] || 'pcard_type_new';

  return (
    <div className="swiper-slide" onPointerEnter={zoom(1.08)} onPointerLeave={zoom(1)}>
      <div className="im" style={{ overflow: 'hidden' }}>
        <img ref={imgRef} src={property.img} alt="" loading="lazy" draggable={false} />
        <span className="bdg">{t(typeKey)}</span>
        <button className="hr" onClick={handleFav} aria-label={t('pcard_fav_aria')}>
          ♥
        </button>
      </div>
      <div className="cb">
        <h3>{property.name}</h3>
        <div className="mu" style={{ fontSize: 12 }}>
          {property.address}
        </div>
        <div className="mt">
          <span>{property.rooms}</span>
          <span>{property.area} {t('pd_m2')}</span>
        </div>
        <div className="pr">{fmt(property.price)}</div>
      </div>
    </div>
  );
}