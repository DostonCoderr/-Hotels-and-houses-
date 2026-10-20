'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useTranslation();
  const [glitch, setGlitch] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: '#050505',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* ORQA FON VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: videoLoaded ? 0.5 : 0,
          transition: 'opacity 1s ease'
        }}
      >
        <source src="https://videos.pexels.com/video-files/7578552/7578552-hd_1920_1080_30fps.mp4" type="video/mp4" />
      </video>

      {/* Fallback rasm */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1,
        opacity: 0.4,
        filter: 'brightness(0.3)'
      }} />

      {/* QORONG'I PARDA */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1
      }} />

      {/* ASOSIY KONTENT */}
      <div className="w" style={{ position: 'relative', zIndex: 2, padding: '0 5%' }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ maxWidth: 600 }}
        >
          {/* KATTA GLITCH EFFEKTLI 404 */}
          <motion.h1
            animate={glitch ? { x: [-3, 3, -2, 2, 0], opacity: [1, 0.7, 1] } : {}}
            transition={{ duration: 0.1 }}
            style={{
              fontSize: 'clamp(120px, 18vw, 220px)',
              fontWeight: 900,
              lineHeight: 0.9,
              margin: 0,
              letterSpacing: '-4px',
              textShadow: glitch ? '4px 0 #ff0000, -4px 0 #00ffff' : 'none',
              color: '#fff'
            }}
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 400,
              marginTop: 20,
              marginBottom: 40,
              color: '#e0e0e0'
            }}
          >
            {t('nf_title')}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-block',
                background: '#fff',
                color: '#000',
                padding: '16px 40px',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: '2px solid #fff',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#000';
              }}
            >
              {t('nf_back_home')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}