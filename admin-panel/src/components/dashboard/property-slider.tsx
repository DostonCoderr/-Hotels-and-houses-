'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  Keyboard,
  Mousewheel,
  Thumbs,
  Zoom,
} from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion } from 'framer-motion';
import { Play, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

import { cn } from '@/lib/utils';
import { UPLOADS_URL } from '@/lib/constants';
import { useTranslation } from '@/lib/translations';
import type { Image } from '@/types';

interface PropertySliderProps {
  images: Image[];
  propertyName: string;
  hasVideo?: boolean;
}

export function PropertySlider({
  images,
  propertyName,
  hasVideo,
}: PropertySliderProps) {
  const { t } = useTranslation();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted">
        <div className="w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            {t.imageNotUploaded}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.addImageHint}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 group">
      <Swiper
        onSwiper={(swiper) => {
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== 'boolean'
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        modules={[
          Navigation,
          Pagination,
          Autoplay,
          EffectFade,
          Keyboard,
          Mousewheel,
          Thumbs,
          Zoom,
        ]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={images.length > 1}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
          el: '.custom-swiper-pagination',
        }}
        thumbs={{
          swiper:
            thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        zoom={{ maxRatio: 3 }}
        className="w-full h-full property-main-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id}  className="relative w-full h-full">
            <div className="swiper-zoom-container w-full h-full">
              <img
                src={`${UPLOADS_URL}${image.url}`}
                alt={`${propertyName} - ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>

            <div className="absolute top-20 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium z-10">
              {index + 1} / {images.length}
            </div>

            {hasVideo && index === 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-20 hover:bg-white/30 transition-colors"
              >
                <Play className="h-8 w-8 text-white ml-1" fill="white" />
              </motion.button>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <motion.button
            ref={prevRef}
            whileHover={{ scale: 1.05, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
            aria-label={t.previousImage}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </motion.button>

          <motion.button
            ref={nextRef}
            whileHover={{ scale: 1.05, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
            aria-label={t.nextImage}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </motion.button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 max-w-[80%]">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView="auto"
            watchSlidesProgress
            modules={[Thumbs]}
            className="property-thumbs-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={image.id}
                className="!w-14 !h-14 cursor-pointer"
              >
                <div
                  className={cn(
                    'w-full h-full rounded-lg overflow-hidden transition-all',
                    activeIndex === index
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-50 hover:opacity-100'
                  )}
                >
                  <img
                    src={`${UPLOADS_URL}${image.url}`}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {images.length > 1 && (
        <div className="custom-swiper-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5" />
      )}
    </div>
  );
}