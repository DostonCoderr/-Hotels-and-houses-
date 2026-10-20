'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, EffectCreative } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Building2, MapPin, Bed, Maximize, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { UPLOADS_URL } from '@/lib/constants';
import { useTranslation } from '@/lib/translations';
import type { Property } from '@/types';

import 'swiper/css';
import 'swiper/css/effect-creative';

interface PropertySwiperProps {
  properties: Property[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

const STATUS_STYLE: Record<string, string> = {
  available: 'bg-emerald-500 text-white hover:bg-emerald-500',
  sold: 'bg-rose-500 text-white hover:bg-rose-500',
  booked: 'bg-amber-500 text-white hover:bg-amber-500',
};

export function PropertySwiper({ properties, selectedId, onSelect }: PropertySwiperProps) {
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperType | null>(null);

  const index = Math.max(0, properties.findIndex((p) => p.id === selectedId));
  const loop = properties.length > 2;

  const statusLabels: Record<string, string> = {
    available: t.statusAvailable,
    sold: t.statusSold,
    booked: t.statusBooked,
  };

  // Ro'yxatdan tanlanganda slayder ham o'sha uyga o'tadi.
  // (loop rejimida activeIndex emas, realIndex ishlatiladi)
  useEffect(() => {
    const s = swiperRef.current;
    if (!s || s.destroyed || s.realIndex === index) return;
    loop ? s.slideToLoop(index, 600) : s.slideTo(index, 600);
  }, [index, loop]);

  if (!properties || properties.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-card">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="group absolute inset-0">
      <Swiper
        initialSlide={index}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => {
          const p = properties[s.realIndex];
          if (p && p.id !== selectedId) onSelect(p.id);
        }}
        modules={[Keyboard, Mousewheel, EffectCreative]}
        effect="creative"
        creativeEffect={{
          prev: { shadow: true, translate: ['-20%', 0, -1], opacity: 0.5 },
          next: { translate: ['100%', 0, 0] },
        }}
        speed={700}
        loop={loop}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true }}
        className="property-swiper-main h-full w-full"
      >
        {properties.map((property, i) => {
          const image = property.images?.[0];
          return (
            <SwiperSlide key={property.id} className="relative">
              {image ? (
                <img
                  src={`${UPLOADS_URL}${image.url}`}
                  alt={property.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">{t.imageNotUploaded}</p>
                  <p className="text-xs text-muted-foreground">{t.addImageHint}</p>
                </div>
              )}

              {image && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/25" />}

              {/* Badge'lar */}
              <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-white/90 text-foreground backdrop-blur">{property.type?.name || t.property}</Badge>
                <Badge className={cn('border-0', STATUS_STYLE[property.status])}>
                  {statusLabels[property.status] || property.status}
                </Badge>
                {property.discount && <Badge className="border-0 bg-orange-500 text-white">-{property.discount}%</Badge>}
              </div>

              {/* Ma'lumot paneli */}
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10">
                <div className="flex items-end justify-between gap-4 rounded-2xl border border-white/15 bg-black/35 p-4 text-white backdrop-blur-md lg:p-5">
                  <div className="min-w-0">
                    <h2 className="mb-1.5 truncate text-2xl font-bold lg:text-3xl">{property.name}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
                      <span className="flex min-w-0 items-center gap-1"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{property.address}</span></span>
                      <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{property.rooms} {t.rooms}</span>
                      <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{property.area} m²</span>
                      <span className="hidden items-center gap-1 sm:flex"><Layers className="h-3.5 w-3.5" />{property.floor}/{property.floorsTotal}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-bold leading-none lg:text-3xl">{formatPrice(property.price)}</p>
                    <p className="mt-1.5 text-xs text-white/70">{formatPrice(property.priceM2)} / m²</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Hisoblagich + progress */}
      <div className="pointer-events-none absolute right-4 top-16 z-20 flex flex-col items-end gap-1.5">
        <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-md">
          {index + 1} / {properties.length}
        </span>
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-white/25">
          <motion.div
            className="h-full rounded-full bg-white"
            animate={{ width: `${((index + 1) / properties.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {properties.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label={t.previousProperty}
            className="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all hover:bg-white/40 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label={t.nextProperty}
            className="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all hover:bg-white/40 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </>
      )}
    </div>
  );
}